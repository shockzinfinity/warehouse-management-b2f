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
      v-card-actions
        v-spacer
        span.font-italic.caption 작성일: <display-time :time="article.createdAt"></display-time>
      v-card-actions
        v-spacer
        span.font-italic.caption 수정일: <display-time :time="article.updatedAt"></display-time>
      v-card-actions
        v-spacer
        v-btn(icon @click="like") <v-icon :color="liked ? 'success' : ''">mdi-thumb-up</v-icon> <span>{{ article.likeCount }}</span>
      v-divider
      v-card-actions.py-0
        v-row.no-gutters
          v-col(cols="4")
            v-btn(text block color="primary" @click="go(-1)") <v-icon left>mdi-arrow-left-bold-circle-outline</v-icon> 이전
          v-col.d-flex(cols="4")
            v-divider(vertical)
            v-btn(text block color="primary" @click="back") <v-icon>mdi-format-list-bulleted-square</v-icon> 목록
            v-divider(vertical)
          v-col(cols="4")
            v-btn(text block color="primary" @click="go(1)") 다음 <v-icon right>mdi-arrow-right-bold-circle-outline</v-icon>
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
      ref: null,
      unsubscribe: null,
      article: null,
      doc: null,
    }
  },
  computed: {
    fireUser() {
      return this.$store.state.fireUser
    },
    user() {
      return this.$store.state.user
    },
    liked() {
      if (!this.fireUser) return false
      return this.article.likeUids.includes(this.fireUser.uid)
    },
  },
  watch: {
    articleId() {
      this.subscribe()
    },
  },
  created() {
    this.subscribe()
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe() {
      if (this.unsubscribe) this.unsubscribe()
      this.ref = this.$firebase
        .firestore()
        .collection('boards')
        .doc(this.boardId)
        .collection('articles')
        .doc(this.articleId)

      this.ref.update({
        readCount: this.$firebase.firestore.FieldValue.increment(1),
      })

      this.unsubscribe = this.ref.onSnapshot(
        doc => {
          if (!doc.exists) {
            this.back()
            return
          }
          this.doc = doc
          const item = doc.data()
          item.createdAt = item.createdAt.toDate()
          item.updatedAt = item.updatedAt.toDate()
          if (!this.article || this.article.url !== item.url)
            this.fetch(item.url)
          this.article = item
        },
        e => {
          throw Error(e.message)
        }
      )
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
    async like() {
      if (!this.fireUser) throw Error('로그인이 필요합니다')
      if (this.liked) {
        await this.ref.update({
          likeCount: this.$firebase.firestore.FieldValue.increment(-1),
          likeUids: this.$firebase.firestore.FieldValue.arrayRemove(
            this.fireUser.uid
          ),
        })
      } else {
        await this.ref.update({
          likeCount: this.$firebase.firestore.FieldValue.increment(1),
          likeUids: this.$firebase.firestore.FieldValue.arrayUnion(
            this.fireUser.uid
          ),
        })
      }
    },
    async go(arrow) {
      if (!this.doc) throw Error('데이터를 가져올 수 없습니다')
      const ref = this.$firebase
        .firestore()
        .collection('boards')
        .doc(this.boardId)
        .collection('articles')
        .orderBy('createdAt', 'desc')
      let sn
      if (arrow < 0)
        sn = await ref
          .endBefore(this.doc)
          .limitToLast(1)
          .get()
      else
        sn = await ref
          .startAfter(this.doc)
          .limit(1)
          .get()

      if (sn.empty) throw Error('더 이상 없습니다.')
      const doc = sn.docs[0]

      console.log(doc.id)
      const us = this.$route.path.split('/')
      us.pop()
      us.push(doc.id)
      this.$router.push({ path: us.join('/') })
    },
  },
}
</script>
