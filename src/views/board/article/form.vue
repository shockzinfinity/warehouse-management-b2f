<template lang="pug">
  v-container(fluid)
    v-form
      v-card(:loading="loading")
        v-toolbar(color="accent" dense flat dark)
          v-toolbar-title 게시판 글 작성
          v-spacer
          v-btn(icon @click="$router.push('/board/' + document)") <v-icon>mdi-arrow-left</v-icon>
          v-btn(icon @click="save" :disabled="!user") <v-icon>mdi-content-save</v-icon>
        v-card-text
          v-text-field(v-model="form.title" outlined label="제목")
          editor(v-if="!articleId" :initialValue="form.content" ref="editor" initialEditType="wysiwyg" :options="{ hideModeSwitch: true }")
          template(v-else)
            editor(v-if="form.content" :initialValue="form.content" ref="editor2" initialEditType="wysiwyg" :options="{ hideModeSwitch: true }")
            v-container(v-else)
              v-row(justify="center" align="center")
                v-progress-circular(indeterminate)
</template>

<script>
import axios from 'axios'

export default {
  props: ['document', 'action'],
  data () {
    return {
      unsubscribe: null,
      form: {
        title: '',
        content: ''
      },
      loading: false,
      exists: false,
      ref: null
    }
  },
  computed: {
    articleId () {
      return this.$route.query.articleId
    },
    user () {
      return this.$store.state.user
    }
  },
  watch: {
    document () {
      this.subscribe()
    }
  },
  created () {
    this.fetch()
  },
  destroyed () {
  },
  methods: {
    async fetch () {
      // console.log(this.articleId)
      this.ref = this.$firebase.firestore().collection('boards').doc(this.document)

      // if (this.articleId === 'new') return
      if (!this.articleId) return
      const doc = await this.ref.collection('articles').doc(this.articleId).get()
      this.exists = doc.exists
      if (!this.exists) return
      const item = doc.data()
      this.form.title = item.title
      const { data } = await axios.get(item.url)
      this.form.content = data
    },
    async save () {
      this.loading = true
      try {
        const createdAt = new Date() // primary key
        const id = createdAt.getTime().toString()
        let md
        if (this.exists) md = this.$refs.editor2.invoke('getMarkdown')
        else md = this.$refs.editor.invoke('getMarkdown') // to storage
        const sn = await this.$firebase.storage().ref().child('boards').child(this.document).child(id + '.md').putString(md)
        const url = await sn.ref.getDownloadURL()
        const doc = {
          title: this.form.title,
          updatedAt: createdAt,
          url
        }

        // 한 트랜잭션으로 묶기 (article 과 count)
        const batch = await this.$firebase.firestore().batch()

        if (!this.articleId) {
          // create
          doc.createdAt = createdAt
          doc.commentCount = 0
          doc.readCount = 0
          doc.uid = this.$store.state.fireUser.uid
          doc.user = {
            email: this.user.email,
            photoURL: this.user.photoURL,
            displayName: this.user.displayName
          }
          // 컬렉션 생성 및 카운트 증가
          batch.set(this.ref.collection('articles').doc(id), doc)
          batch.update(this.ref, { count: this.$firebase.firestore.FieldValue.increment(1) })
        } else {
          // update
          batch.update(this.ref.collection('articles').doc(this.articleId), doc)
        }

        await batch.commit()
      } finally {
        this.loading = false
        this.$router.push('/board/' + this.document)
      }
    }
  }
}
</script>
