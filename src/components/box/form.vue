<template lang="pug">
  v-container(fluid)
    validation-observer(ref="obs" v-slot="{ invalid, validated, passes, validate }")
      v-form
        v-card(:loading="loading")
          v-toolbar(color="accent" dense flat dark)
            v-toolbar-title 박스 정보 작성
            v-spacer
            v-btn(icon @click="goBack") <v-icon>mdi-arrow-left</v-icon>
            v-btn(icon @click="save" :disabled="!user") <v-icon>mdi-content-save</v-icon>
          v-card-text
            v-text-field-with-validation(v-model="form.title" rules="required|max:50" :counter="50"  outlined label="이름")
            v-textarea(v-model="form.description" outlined label="설명")
          v-card-actions
            cover-upload(ref="cover" type="box" @downloadURL="getDownloadURL" :originSrc="form.coverUrl" :pathId="boxId")
          v-card-actions
            v-img(v-if="exists && form.qrCodeUrl" :src="form.qrCodeUrl")
</template>

<script>
// import axios from 'axios'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation'
import VSelectWithValidation from '@/components/inputs/VSelectWithValidation'
import CoverUpload from '@/components/CoverUpload'
import QRCode from 'qrcode'
import cryptRandomString from 'crypto-random-string'

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    VTextFieldWithValidation,
    VSelectWithValidation,
    QRCode,
    CoverUpload,
  },
  props: ['boxId', 'action'],
  data() {
    return {
      form: {
        boxId: '',
        coverUrl: '',
        description: '',
        parentRackId: '',
        qrCodeUrl: '',
        sampleCount: '',
        title: '',
        uid: '',
        user: {},
      },
      exists: false,
      loading: false,
      ref: null,
    }
  },
  created() {
    this.fetch()
  },
  destroyed() {},
  computed: {
    user() {
      return this.$store.state.user
    },
    fireUser() {
      return this.$store.state.fireUser
    },
    parentRackId() {
      return this.$route.query.parentRackId
    },
    parentRackPath() {
      return this.$route.query.parentRackPath
    },
  },
  watch: {
    boxId() {
      this.fetch()
    },
  },
  methods: {
    async fetch() {
      this.ref = this.$firebase
        .firestore()
        .collection('boxes')
        .doc(this.boxId)
      const doc = await this.ref.get()
      this.exists = doc.exists
      if (this.exists) {
        const item = doc.data()
        this.form.id = doc.id
        this.form.boxId = item.boxId
        this.form.coverUrl = item.coverUrl
        this.form.description = item.description
        this.form.parentRackId = item.parentRackId
        this.form.qrCodeUrl = item.qrCodeUrl
        this.form.sampleCount = item.sampleCount
        this.form.title = item.title
        this.form.uid = item.uid
        this.form.user.displayName = item.user.displayName
        this.form.user.email = item.user.email
        this.form.user.level = item.user.level
        this.form.user.photoURL = item.user.photoURL
      }
    },
    async save() {
      if (!this.fireUser) throw Error('로그인이 필요합니다')
      const validation = await this.$refs.obs.validate()
      if (!validation) throw Error('정보가 부족합니다')
      const form = {
        boxId: this.form.boxId,
        coverUrl: this.form.coverUrl,
        description: this.form.description,
        qrCodeUrl: this.form.qrCodeUrl,
        title: this.form.title,
        updatedAt: new Date(),
      }

      this.loading = true
      try {
        if (!this.exists) {
          form.boxId = cryptRandomString({ length: 10 })
          form.createdAt = new Date()
          form.sampleCount = 0
          form.uid = this.fireUser.uid
          form.parentRackId = this.parentRackId
          form.user = {
            displayName: this.user.displayName,
            email: this.user.email,
            photoURL: this.user.photoURL,
            createdAt: new Date(),
            level: this.user.level,
          }

          if (!form.qrCodeUrl) {
            const qr = await this.codeGenration(form.boxId)
            const qrSn = await this.$firebase
              .storage()
              .ref()
              .child('boxes')
              .child(this.boxId)
              .child(this.boxId + '.qr.png')
              .putString(qr, 'data_url')
            form.qrCodeUrl = await qrSn.ref.getDownloadURL()
          }
          await this.ref.set(form)
        } else {
          await this.ref.update(form)
        }
        this.$router.replace('/box/' + this.boxId)
      } finally {
        this.loading = false
      }
    },
    getDownloadURL(url) {
      this.form.coverUrl = url
    },
    async codeGenration(boxId) {
      const qrCodeAddress =
        'https://warehouse-management-b2f.firebaseapp.com/confirm?qc=bx-' +
        boxId
      return await QRCode.toDataURL(qrCodeAddress)
    },
    goBack() {
      if (this.parentRackPath)
        return this.$router.replace('/rack/' + this.parentRackPath)
      else return this.$router.replace('/box/' + this.boxId)
    },
  },
}
</script>
