<template lang="pug">
  v-container(fluid :class="$vuetify.breakpoint.xs ? 'pa-0' : ''")
    v-form
      v-card(:loading="loading" outlined :tile="$vuetify.breakpoint.xs")
        v-toolbar(color="transparent" dense flat)
          v-toolbar-title 게시판 정보 작성
          v-spacer
          v-btn(icon @click="$router.replace('/board/' + boardId)") <v-icon>mdi-arrow-left</v-icon>
          v-btn(icon @click="save") <v-icon>mdi-content-save</v-icon>
        v-card-text
          v-text-field(v-model="form.category" outlined label="종류")
          v-text-field(v-model="form.title" outlined label="제목")
          v-textarea(v-model="form.description" outlined label="설명")
</template>

<script>
export default {
  props: ['boardId', 'action'],
  data() {
    return {
      form: {
        category: '',
        title: '',
        description: '',
      },
      exists: false,
      loading: false,
      ref: null,
    }
  },
  watch: {
    boardId() {
      this.fetch()
    },
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    fireUser() {
      return this.$store.state.fireUser
    },
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      this.ref = this.$firebase
        .firestore()
        .collection('boards')
        .doc(this.boardId)
      const doc = await this.ref.get()
      this.exists = doc.exists
      if (this.exists) {
        const item = doc.data()
        this.form.category = item.category
        this.form.title = item.title
        this.form.description = item.description
      }
    },
    async save() {
      if (!this.$store.state.fireUser) throw Error('로그인이 필요합니다')
      if (!this.form.category || !this.form.title)
        throw Error('종류 및 제목은 필수 입니다')
      const form = {
        category: this.form.category,
        title: this.form.title,
        description: this.form.description,
        updatedAt: new Date(),
      }

      this.loading = true
      try {
        if (!this.exists) {
          form.createdAt = new Date()
          form.boxCount = 0
          form.sampleSKU = 0
          form.uid = this.$store.state.fireUser.uid
          form.user = {
            displayName: this.user.displayName,
            email: this.user.email,
            photoURL: this.user.photoURL,
          }
          form.categories = ['일반']
          form.tags = ['vue', 'firebase']

          await this.ref.set(form)
        } else {
          await this.ref.update(form)
        }

        this.$router.replace('/board/' + this.boardId)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
