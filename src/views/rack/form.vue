<template lang="pug">
  v-container(fluid)
    v-layout(align-center justify-center)
      validation-observer(ref="obs" v-slot="{ invalid, validated, passes, validate }")
        v-form
          v-card.elevation-12(:loading="loading")
            v-toolbar(color="accent" dense flat dark)
              v-toolbar-title 랙 정보 작성
              v-spacer
              v-btn(icon @click="$router.push('/rack/' + document)") <v-icon>mdi-arrow-left</v-icon>
              v-btn(icon @click="save") <v-icon>mdi-content-save</v-icon>
            v-card-subtitle.pb-0 cover image
            v-card-text
              v-img.mx-auto(v-if="!uploading && !uploadEnd && !downloadURL" :src="form.coverUrl" width="50%")
              v-card-text.text-center {{ fileName }}
              v-progress-circular.mx-auto(
                v-if="uploading && !uploadEnd"
                :size="80" :width="15" :rotate="360" :value="progressUpload" color="primary"
              ) {{ progressUpload }}%
              v-img.mx-auto(v-if="uploadEnd" :src="downloadURL" width="50%")
              v-card-actions.justify-center
                v-spacer
                v-btn(
                  color="primary"
                  @click.native="selectFiles"
                  v-if="!uploadEnd && !uploading"
                  :disabled="!$store.state.isAdmin"
                ) change
                v-btn.ma-0(dark small color="error" @click="deleteImage" v-if="uploadEnd") Delete
              v-form(ref="form")
                input(id="files" type="file" name="file" ref="uploadInput" accept="image/*" :multiple="false" @change="detectFiles($event)")
            v-card-subtitle.pb-0 QR code
            v-card-text
              v-img.mx-auto(v-if="exists && form.qrcodeUrl" :src="form.qrcodeUrl" width="50%")
            v-card-text
              v-text-field-with-validation(v-model="form.position" rules="required|max:50" :counter="50" outlined label="위치")
              v-text-field-with-validation(v-model="form.title" rules="required|max:50" :counter="50" outlined label="이름")
              v-textarea(v-model="form.description" outlined label="설명")
</template>

<script>
import cryptRandomString from 'crypto-random-string'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation'
import VSelectWithValidation from '@/components/inputs/VSelectWithValidation'
import QRCode from 'qrcode'

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    VTextFieldWithValidation,
    VSelectWithValidation,
    QRCode
  },
  props: ['document', 'action'],
  data () {
    return {
      unsubscribe: null,
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
      form: {
        position: '',
        description: '',
        title: '',
        coverUrl: '',
        qrcodeUrl: ''
      },
      loading: false,
      exists: false,
      ref: null,
      storageRef: null
    }
  },
  watch: {
    document () {
      this.subscribe()
    },
    uploadTask () {
      this.uploadTask.on('state_changed', sp => {
        this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
      }, null, () => {
        this.uploadTask.snapshot.ref.getDownloadURL().then(url => {
          this.uploadEnd = true
          this.downloadURL = url
          this.$emit('downloadURL', url)
        })
      })
    }
  },
  created () {
    this.subscribe()
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    selectFiles () {
      this.$refs.uploadInput.click()
    },
    detectFiles (e) {
      const fileList = e.target.files || e.dataTransfer.files
      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x])
      })
    },
    upload (file) {
      this.fileName = file.name
      this.uploading = true
      this.uploadTask = this.storageRef.child('cover').child(file.name).put(file)
    },
    deleteImage () {
      this.storageRef.child('cover').child(this.fileName).delete()
        .then(() => {
          this.uploading = false
          this.uploadEnd = false
          this.fileName = ''
          this.downloadURL = ''
        })
        .catch(e => {
          throw Error(e)
        })
      this.$refs.form.reset()
    },
    subscribe () {
      if (this.unsubscribe) this.unsubscribe()
      this.ref = this.$firebase.firestore().collection('racks').doc(this.document)
      this.storageRef = this.$firebase.storage().ref().child('racks').child(this.document)
      this.unsubscribe = this.ref.onSnapshot(doc => {
        this.exists = doc.exists
        if (this.exists) {
          const item = doc.data()
          this.form.rackId = item.rackId
          this.form.position = item.position
          this.form.title = item.title
          this.form.description = item.description
          this.form.coverUrl = item.coverUrl
          this.form.qrcodeUrl = item.qrcodeUrl
        }
      })
    },
    async save () {
      const validation = await this.$refs.obs.validate()
      if (!validation) return

      const form = {
        rackId: this.form.rackId,
        position: this.form.position,
        title: this.form.title,
        description: this.form.description,
        updatedAt: new Date(),
        coverUrl: this.downloadURL ? this.downloadURL : this.form.coverUrl,
        qrcodeUrl: this.form.qrcodeUrl
      }
      this.loading = true

      try {
        if (!this.exists) {
          form.rackId = cryptRandomString({ length: 10 })
          form.createdAt = new Date()
          form.boxCount = 0

          // console.log('create', form)

          if (!form.qrcodeUrl) {
            const qr = await this.codeGenration(form.rackId)
            const qrSn = await this.storageRef.child(this.document + '.qr.png').putString(qr, 'data_url')
            form.qrcodeUrl = await qrSn.ref.getDownloadURL()
          }

          await this.ref.set(form)
        } else {
          if (!this.form.qrcodeUrl) {
            const qr = await this.codeGenration(form.rackId)
            const qrSn = await this.storageRef.child(this.document + '.qr.png').putString(qr, 'data_url')
            form.qrcodeUrl = await qrSn.ref.getDownloadURL()
          }

          // console.log(form.qrcodeUrl)
          // console.log('update', this.form)

          this.ref.update(form)
        }
        this.$router.push('/rack/' + this.document)
      } finally {
        this.loading = false
      }
    },
    async codeGenration (rackId) {
      const qrCodeAddress = 'https://warehouse-management-b2f.firebaseapp.com/confirm?qc=rk-' + rackId
      return await QRCode.toDataURL(qrCodeAddress)
    }
  }
}
</script>

<style lang="sass" scoped>
.progress-bar
  margin: 10px 0

input[type="file"]
  position: absolute
  clip: rect(0,0,0,0)
</style>
