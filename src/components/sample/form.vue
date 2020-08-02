<template lang="pug">
  v-container(fluid :class="$vuetify.breakpoint.xs ? 'pa-0' : ''")
    validation-observer(ref="obs" v-slot="{ invalid, validated, passes, validate }")
      v-form
        v-card(:loading="loading" outlined :tile="$vuetify.breakpoint.xs")
          v-toolbar(color="transparent" dense flat)
            v-toolbar-title 샘플 등록
            v-spacer
            v-btn(icon @click="goBack") <v-icon>mdi-arrow-left</v-icon>
            v-btn(icon @click="save" :disabled="!user") <v-icon>mdi-content-save</v-icon>
          v-card-text
          v-row
            v-col(cols="12" sm="4" v-if="box")
              v-combobox(v-model="form.category" :items="box.categories" label="종류" outlined hide-details)
            v-col(cols="12" sm="8" v-if="box")
              v-combobox(v-model="form.tags" :items="box.tags" label="태그" outlined multiple small-chips hide-details)
            v-col(cols="12")
              v-text-field(v-model="form.title" outlined label="제목")
            v-col(cols="12")
              editor(v-if="sampleId === 'new'" :initialValue="form.content" ref="editor" height="600px" initialEditType="wysiwyg" :options="{ }")
              template(v-else)
                editor(v-if="form.content" :initialValue="form.content" ref="editor" height="600px" initialEditType="wysiwyg" :options="{ }")
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
import getSummary from '@/util/getSummary'

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
        category: '일반',
        tags: [],
        content: '',
      },
      exists: false,
      loading: false,
      ref: null,
      sample: null,
      box: null,
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
      const docBox = await this.ref.get()
      this.box = docBox.data()

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
      this.form.category = item.category
      this.form.tags = item.tags
      const { data } = await axios.get(item.url)
      this.form.content = data
    },
    async save() {
      if (!this.fireUser) throw Error('로그인이 필요합니다')
      if (!this.form.category) throw Error('종류는 필수 항목입니다')
      if (!this.form.title) throw Error('제목은 필수 항목입니다')
      const md = this.$refs.editor.invoke('getMarkdown')
      if (!md) throw Error('내용은 필수 항목입니다')

      this.loading = true
      try {
        const createdAt = new Date()
        const doc = {
          title: this.form.title,
          updatedAt: createdAt,
          category: this.form.category,
          tags: this.form.tags,
          summary: getSummary(md, 300),
        }

        if (this.sampleId === 'new') {
          const id = createdAt.getTime().toString()
          const fn = id + '-' + this.fireUser.uid + '.md'
          const sn = await this.$firebase
            .storage()
            .ref()
            .child('samples')
            .child(id)
            .child(fn)
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
          doc.likeCount = 0
          doc.likeUids = []

          if (!doc.qrCodeUrl) {
            const qr = await this.codeGenration(this.boxId, id)
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
          const fn = this.sampleId + '-' + this.sample.uid + '.md'
          await this.$firebase
            .storage()
            .ref()
            .child('samples')
            .child(this.sampleId)
            .child(fn)
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
