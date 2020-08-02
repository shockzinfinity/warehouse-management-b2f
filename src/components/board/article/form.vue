<template lang="pug">
  v-container(fluid)
    v-form
      v-card(:loading="loading")
        v-toolbar(color="accent" dense flat dark)
          v-toolbar-title 게시판 글 작성
          v-spacer
          v-btn(icon @click="$router.replace('/board/' + boardId)") <v-icon>mdi-arrow-left</v-icon>
          v-btn(icon @click="save" :disabled="!user") <v-icon>mdi-content-save</v-icon>
        v-card-text
          v-text-field(v-model="form.title" outlined label="제목")
          editor(v-if="articleId === 'new'" :initialValue="form.content" ref="editor" height="600px" initialEditType="wysiwyg" :options="{ }")
          template(v-else)
            editor(v-if="form.content" :initialValue="form.content" ref="editor" height="600px" initialEditType="wysiwyg" :options="{ }")
            v-container(v-else)
              v-row(justify="center" align="center")
                v-progress-circular(indeterminate)
</template>

<script>
import axios from 'axios'

export default {
  props: ['boardId', 'articleId', 'action'],
  data() {
    return {
      form: {
        title: '',
        content: '',
      },
      exists: false,
      loading: false,
      ref: null,
      article: null,
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
    boardId() {
      this.fetch()
    },
  },
  methods: {
    async fetch() {
      this.ref = this.$firebase
        .firestore()
        .collection('boards')
        .doc(this.boardId)
      if (this.articleId === 'new') return
      const doc = await this.ref
        .collection('articles')
        .doc(this.articleId)
        .get()
      this.exists = doc.exists
      if (!this.exists) return
      const item = doc.data()
      this.article = item
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

        if (this.articleId === 'new') {
          const id = createdAt.getTime().toString()
          const fn = id + '-' + this.fireUser.uid + '.md'
          const sn = await this.$firebase
            .storage()
            .ref()
            .child('boards')
            .child(this.boardId)
            .child(fn)
            .putString(md)
          doc.url = await sn.ref.getDownloadURL()
          doc.createdAt = createdAt
          doc.commentCount = 0
          doc.readCount = 0
          doc.uid = this.$store.state.fireUser.uid
          doc.user = {
            email: this.user.email,
            displayName: this.user.displayName,
            photoURL: this.user.photoURL,
          }
          doc.likeCount = 0
          doc.likeUids = []
          await this.ref
            .collection('articles')
            .doc(id)
            .set(doc)
        } else {
          const fn = this.articleId + '-' + this.article.uid + '.md'
          await this.$firebase
            .storage()
            .ref()
            .child('boards')
            .child(this.boardId)
            .child(fn)
            .putString(md)
          await this.ref
            .collection('articles')
            .doc(this.articleId)
            .update(doc)
        }
        this.$router.replace('/board/' + this.boardId)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>