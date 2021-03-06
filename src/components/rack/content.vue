<template lang="pug">
  v-container(fluid)
    v-card(v-if="article")
      v-toolbar(color="info" dark dense flat)
        v-toolbar-title {{ article.title }}
        v-spacer
        v-btn(@click="articleWrite" icon) <v-icon>mdi-pencil</v-icon>
        v-btn(@click="remove" icon) <v-icon>mdi-delete</v-icon>
        v-btn(@click="back" icon) <v-icon>mdi-close</v-icon>
      v-card-text
        viewer(v-if="content" :initialValue="content")
        v-container(v-else)
          v-row(justify="center" align="center")
            v-progress-circular(indeterminate)
      v-card-action
        v-spacer
        span.font-italic.caption 작성일: <display-time :time="article.createdAt"></display-time>
      v-card-action
        v-spacer
        span.font-italic.caption 수성일: <display-time :time="article.updatedAt"></display-time>
      v-divider
      display-comment(:article="article" :docRef="ref")
    v-card(v-else)
      v-container
        v-row(justify="center" align="center")
          v-progress-circular(indeterminate)
</template>

<script>
import axios from 'axios'
import DisplayTime from '@/components/display-time'
import DisplayComment from '@/components/display-comment'

export default {
  components: {
    DisplayTime,
    DisplayComment,
  },
  props: ['boardId', 'articleId'],
  data() {
    return {
      content: '',
      ref: this.$firebase
        .firestore()
        .collection('boards')
        .doc(this.boardId)
        .collection('articles')
        .doc(this.articleId),
      unsubscribe: null,
      article: null,
    }
  },
  async created() {
    await this.readCountUpdate()
    this.subscribe()
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    async readCountUpdate() {
      await this.ref.update({
        readCount: this.$firebase.firestore.FieldValue.increment(1),
      })
    },
    subscribe() {
      if (this.unsubscribe) this.unsubscribe()
      this.unsubscribe = this.ref.onSnapshot(doc => {
        if (!doc.exists) {
          this.back()
          return
        }
        const item = doc.data()
        item.createdAt = item.createdAt.toDate()
        item.updatedAt = item.updatedAt.toDate()
        if (!this.article || this.article.url !== item.url) this.fetch(item.url)
        this.article = item
      }, console.error)
    },
    async fetch(url) {
      this.content = ''
      const r = await axios.get(url)
      this.content = typeof r.data === 'string' ? r.data : r.data.toString()
    },
    async articleWrite() {
      this.$router.push({ path: this.$route.path, query: { action: 'write' } })
    },
    async remove() {
      await this.ref.delete()
    },
    back() {
      const us = this.$route.path.split('/')
      us.pop()
      this.$router.push({ path: us.join('/') })
    },
  },
}
</script>
