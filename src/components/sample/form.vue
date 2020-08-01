<template lang="pug">
  v-container(fluid)
    validation-observer(ref="obs" v-slot="{ invalid, validated, passes, validate }")
      v-form
        v-card(:loading="loading")
          v-toolbar(color="accent" dense flat dark)
            v-toolbar-title 샘플 등록
            v-spacer
            v-btn(icon @click="goBack") <v-icon>mdi-arrow-left</v-icon>
            v-btn(icon @click="save" :disabled="!user") <v-icon>mdi-content-save</v-icon>
          v-card-text
            v-text-field(v-model="form.title" outlined label="제목")
            editor(v-if="sampleId === 'new'" :initialValue="form.content" ref="editor" initialEditType="wysiwyg" :options="{ hiddenSwitch: true }")
            template(v-else)
              editor(v-if="form.content" :initialValue="form.content" ref="editor" initialEditType="wysiwyg" :options="{ hiddenSwitch: true }")
              v-container(v-else)
                v-row(justify="center" align="center")
                  v-progress-circular(indeterminate)
</template>

<script>
import axios from 'axios'
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
  },
  props: ['boxId', 'sampleId', 'action'],
  data() {
    return {
      form: {
        title: '',
        content: '',
      },
      exists: false,
      loading: false,
      ref: null,
      sample: null,
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
      if (this.sampleId === 'new') return
      const doc = await this.ref
        .collection('samples')
        .doc(this.sampleId)
        .get()
      this.exists = doc.exists
      if (!this.exists) return
      const item = doc.data()
      this.sample = item
      this.form.title = item.title
      const { data } = await axios.get(item.url)
      this.form.content = data
    },
    async save() {
      if (!this.fireUser) throw Error('로그인이 필요합니다')
      if (!this.form.title) throw Error('제목은 필수 항목입니다')
      const md = this.$refs.editor.invoke('getMarkdown')
      if (!md) throw Error('내용은 필수 항목입니다')

      this.loading = true
      try {
        const createdAt = new Date()
        const doc = {
          title: this.form.title,
          updatedAt: createdAt,
        }

        if (this.sampleId === 'new') {
          const id = createdAt.getTime().toString()
          const sn = await this.$firebase
            .storage()
            .ref()
            .child('boxes')
            .child(this.boxId)
            .child(id + '.md')
            .putString(md)
          doc.url = await sn.ref.getDownloadURL()
          doc.createdAt = createdAt
          doc.commentCount = 0
          doc.readCount = 0
          doc.currentStock = 0
          doc.uid = this.$store.state.fireUser.uid
          doc.user = {
            createdAt,
            email: this.user.email,
            displayName: this.user.displayName,
            photoURL: this.user.photoURL,
          }

          if (!doc.qrCodeUrl) {
            const box = await this.$firebase
              .firestore()
              .collection('boxes')
              .doc(this.boxId)
              .get()
            let boxId
            if (box.exists) {
              const item = box.data()
              boxId = item.boxId
            }

            const qr = await this.codeGenration(boxId, id)
            const qrSn = await this.$firebase
              .storage()
              .ref()
              .child('samples')
              .child(id)
              .child(id + '.qr.png')
              .putString(qr, 'data_url')
            doc.qrCodeUrl = await qrSn.ref.getDownloadURL()
          }

          await this.ref
            .collection('samples')
            .doc(id)
            .set(doc)
        } else {
          await this.$firebase
            .storage()
            .ref()
            .child('boxes')
            .child(this.boxId)
            .child(this.sampleId + '.md')
            .putString(md)
          await this.ref
            .collection('samples')
            .doc(this.sampleId)
            .update(doc)
        }
      } finally {
        this.loading = false
        this.$router.replace('/box/' + this.boxId)
      }
    },
    async codeGenration(boxId, sampleId) {
      const qrCodeAddress =
        'https://warehouse-management-b2f.firebaseapp.com/confirm?qc=sp-' +
        boxId +
        sampleId
      return await QRCode.toDataURL(qrCodeAddress)
    },
    goBack() {
      if (this.sampleId !== 'new')
        return this.$router.replace('/box/' + this.boxId + '/' + this.sampleId)
      else return this.$router.replace('/box/' + this.boxId)
    },
  },
}
</script>
