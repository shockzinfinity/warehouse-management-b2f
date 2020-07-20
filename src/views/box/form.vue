<template lang="pug">
  v-container(fluid)
    v-layout(align-center justify-center)
    validation-observer(ref="obs" v-slot="{ invalid, validated, passes, validate }")
      v-form
        v-card.elevation-12(:loading="loading")
          v-toolbar(color="accent" dense flat dark)
            v-toolbar-title 박스 정보 작성
            v-spacer
            v-btn(icon @click="goBack") <v-icon>mdi-arrow-left</v-icon>
            v-btn(icon @click="save") <v-icon>mdi-content-save</v-icon>
          v-card-subtitle.pb-0 cover image
          v-row
            v-col(cols="12")
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
          v-card-text
            .display-1 포함되어 있는 랙 : 
              v-chip.ma-4(large color="accent") {{ form.parentRackId }} ( {{ form.parentRackId }} )
            v-text-field-with-validation(v-model="form.title" rules="required|max:50" :counter="50" outlined label="이름")
            v-textarea(v-model="form.description" outlined label="설명")
</template>

<script>
import cryptoRandomString from 'crypto-random-string'
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
  props: {
    document: String,
    action: String
  },
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
        parentRackId: '',
        description: '',
        title: '',
        sampleCount: 0,
        coverUrl: ''
      },
      loading: false,
      exists: false,
      ref: null
    }
  },
  computed: {
    user () {
      return this.$store.state.user
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
    // console.log(this.parentRackId)
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
      this.uploadTask = this.$firebase.storage().ref().child('boxes').child(this.document).child('cover').child(file.name).put(file)
    },
    deleteImage () {
      this.$firebase.storage().ref().child('boxes').child(this.document).child('cover').child(this.fileName).delete()
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

      this.ref = this.$firebase
        .firestore()
        .collection('boxes')
        .doc(this.document)
      this.unsubscribe = this.ref.onSnapshot(doc => {
        this.exists = doc.exists
        if (this.exists) {
          const item = doc.data()
          this.form.parentRackId = item.parentRackId
          this.form.title = item.title
          this.form.description = item.description
          this.form.coverUrl = item.coverUrl
        }
      })
    },
    goBack () {
      this.$router.push('/box/' + this.document)
    },
    async save () {
      const form = {
        parentRackId: this.form.parentRackId,
        title: this.form.title,
        description: this.form.description,
        updatedAt: new Date(),
        coverUrl: this.downloadURL
      }
      this.loading = true

      try {
        if (!this.form.parentRackId) return
        const batch = await this.$firebase.firestore().batch()
        let parentRackTitle
        await this.$firebase
          .firestore()
          .collection('racks')
          .where('rackId', '==', this.form.parentRackId)
          .get()
          .then(docs => {
            if (!docs.empty) {
              docs.forEach(d => {
                // console.log(d.id, '=>', d.data())
                parentRackTitle = d.id
              })
            }
          })

        if (!this.exists) {
          // if (this.document === 'newBox') {
          this.ref = this.$firebase
            .firestore()
            .collection('boxes')
            .doc(form.title)
          // }
          form.boxId = cryptoRandomString({ length: 10 })
          form.createdAt = new Date()
          form.sampleCount = 0
          form.user = {
            email: this.user.email,
            photoURL: this.user.photoURL,
            displayName: this.user.displayName
          }
          batch.set(this.ref, form)
          batch.update(
            this.$firebase
              .firestore()
              .collection('racks')
              .doc(parentRackTitle),
            { boxCount: this.$firebase.firestore.FieldValue.increment(1) }
          )
        } else {
          // this.ref.update(form)
          batch.update(this.ref, form)
        }
        await batch.commit()
      } finally {
        this.loading = false
        this.goBack()
      }
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
