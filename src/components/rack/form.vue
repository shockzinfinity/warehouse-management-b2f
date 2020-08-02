<template lang="pug">
  v-container(fluid)
    validation-observer(ref="obs" v-slot="{ invalid, validated, passes, validate }")
      v-form
        v-card(:loading="loading")
          v-toolbar(color="accent" dense flat dark)
            v-toolbar-title 랙 정보 작성
            v-spacer
            v-btn(icon @click="$router.replace('/rack/' + rackId)") <v-icon>mdi-arrow-left</v-icon>
            v-btn(icon @click="save" :disabled="!user") <v-icon>mdi-content-save</v-icon>
          v-card-text
            v-text-field-with-validation(v-model="form.position" rules="required|max:50" :counter="50"  outlined label="위치")
            v-text-field-with-validation(v-model="form.title" rules="required|max:50" :counter="50"  outlined label="이름")
            v-textarea(v-model="form.description" outlined label="설명")
          v-card-actions
            cover-upload(ref="cover" type="rack" @downloadURL="getDownloadURL" :originSrc="form.coverUrl" :pathId="rackId")
          v-card-actions
            v-img(v-if="exists && form.qrCodeUrl" :src="form.qrCodeUrl")

</template>

<script>
import cryptRandomString from 'crypto-random-string'
import CoverUpload from '@/components/CoverUpload'
import QRCode from 'qrcode'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation'
import VSelectWithValidation from '@/components/inputs/VSelectWithValidation'

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    VTextFieldWithValidation,
    VSelectWithValidation,
    QRCode,
    CoverUpload,
  },
  props: ['rackId', 'action'],
  data() {
    return {
      form: {
        boxCount: 0,
        coverUrl: '',
        description: '',
        position: '',
        qrCodeUrl: '',
        rackId: '',
        sampleSKU: 0,
        title: '',
        uid: '',
        user: {},
      },
      exists: false,
      loading: false,
      ref: null,
    }
  },
  watch: {
    rackId() {
      this.fetch()
    },
  },
  created() {
    this.fetch()
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    fireUser() {
      return this.$store.state.fireUser
    },
  },
  methods: {
    async fetch() {
      this.ref = this.$firebase
        .firestore()
        .collection('racks')
        .doc(this.rackId)
      const doc = await this.ref.get()
      this.exists = doc.exists
      if (this.exists) {
        const item = doc.data()
        this.form.rackId = item.rackId
        this.form.position = item.position
        this.form.title = item.title
        this.form.description = item.description
        this.form.boxCount = item.boxCount
        this.form.sampleSKU = item.sampleSKU
        this.form.uid = item.uid
        this.form.qrCodeUrl = item.qrCodeUrl
        this.form.coverUrl = item.coverUrl
        this.form.user.displayName = item.user.displayName
        this.form.user.email = item.user.email
        this.form.user.level = item.user.level
        this.form.user.photoURL = item.user.photoURL
      }
    },
    async save() {
      if (!this.$store.state.fireUser) throw Error('로그인이 필요합니다')
      const validation = await this.$refs.obs.validate()
      if (!validation) throw Error('정보가 부족합니다')
      const form = {
        rackId: this.form.rackId,
        position: this.form.position,
        title: this.form.title,
        description: this.form.description,
        updatedAt: new Date(),
        coverUrl: this.form.coverUrl,
        qrCodeUrl: this.form.qrCodeUrl,
      }

      this.loading = true
      try {
        if (!this.exists) {
          form.rackId = cryptRandomString({ length: 10 })
          form.createdAt = new Date()
          form.boxCount = 0
          form.sampleSKU = 0
          form.uid = this.$store.state.fireUser.uid
          form.likeCount = 0
          form.likeUids = []
          form.user = {
            displayName: this.user.displayName,
            email: this.user.email,
            photoURL: this.user.photoURL,
            createdAt: new Date(),
            level: this.user.level,
          }

          if (!form.qrCodeUrl) {
            const qr = await this.codeGenration(form.rackId)
            const qrSn = await this.$firebase
              .storage()
              .ref()
              .child('racks')
              .child(this.rackId)
              .child(this.rackId + '.qr.png')
              .putString(qr, 'data_url')
            form.qrCodeUrl = await qrSn.ref.getDownloadURL()
          }

          await this.ref.set(form)
        } else {
          await this.ref.update(form)
        }

        this.$router.replace('/rack/' + this.rackId)
      } finally {
        this.loading = false
      }
    },
    getDownloadURL(url) {
      this.form.coverUrl = url
    },
    async codeGenration(rackId) {
      const qrCodeAddress =
        'https://warehouse-management-b2f.firebaseapp.com/confirm?qc=rk-' +
        rackId
      return await QRCode.toDataURL(qrCodeAddress)
    },
  },
}
</script>
