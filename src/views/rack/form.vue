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
            cover-upload(ref="cover" type="rack" @downloadURL="getDownloadURL" :currentSrc="form.coverUrl" :positionId="form.rackId")
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
import CoverUpload from '@/components/CoverUpload'

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    VTextFieldWithValidation,
    VSelectWithValidation,
    QRCode,
    CoverUpload
  },
  props: ['document', 'action'],
  data () {
    return {
      unsubscribe: null,
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
      storageRef: null,
      rackCoverUrl: ''
    }
  },
  watch: {
    document () {
      this.subscribe()
    }
  },
  created () {
    this.subscribe()
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
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
      if (!this.$store.state.fireUser) throw Error('로그인이 필요합니다.')
      const validation = await this.$refs.obs.validate()
      if (!validation) return

      const form = {
        rackId: this.form.rackId,
        position: this.form.position,
        title: this.form.title,
        description: this.form.description,
        updatedAt: new Date(),
        coverUrl: this.rackCoverUrl !== this.form.coverUrl && this.rackCoverUrl ? this.rackCoverUrl : this.form.coverUrl,
        qrcodeUrl: this.form.qrcodeUrl
      }
      this.loading = true

      try {
        if (!this.exists) {
          form.rackId = cryptRandomString({ length: 10 })
          form.createdAt = new Date()
          form.boxCount = 0
          form.uid = this.$store.state.fireUser.uid

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

          await this.ref.update(form)
        }
        this.$router.push('/rack/' + this.document)
      } finally {
        this.loading = false
      }
    },
    getDownloadURL (url) {
      this.rackCoverUrl = url
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
