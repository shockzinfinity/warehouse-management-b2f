<template lang="pug">
  v-card
    v-card-title
      v-textarea(v-model="comment" rows="3" outlined label="댓글 작성" append-icon="mdi-send" @click:append="save" @keypress.shift.enter="save" hide-details)
    template(v-for="(item, i) in items")
      v-list-item(:key="item.id" three-line)
        v-list-item-action
          display-user(:user="item.user")
        v-list-item-content
          v-list-item-subtitle.black--text.comment(v-text="item.comment")
          v-list-item-subtitle.font-italic
            display-time(:time="item.createdAt")
      v-divider(:key="i")
    v-list-item
      v-btn(v-if="lastDoc && items.length < article.commentCount" v-intersect="onIntersect" @click="more" text color="primary" block) more
</template>

<script>
import { last } from 'lodash'
import DisplayTime from '@/components/display-time'
import DisplayUser from '@/components/display-user'
const LIMIT = 5

export default {
  components: { DisplayTime, DisplayUser },
  props: ['article', 'docRef'],
  data() {
    return {
      comment: '',
      items: [],
      unsubscribe: null,
      lastDoc: null,
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  created() {
    this.subscribe()
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  methods: {
    snToItems(sn) {
      this.lastDoc = last(sn.docs)

      sn.docs.forEach(doc => {
        const exists = this.items.some(item => doc.id === item.id)
        if (!exists) {
          const item = doc.data()
          item.id = doc.id
          item.createdAt = item.createdAt.toDate()
          item.updatedAt = item.updatedAt.toDate()
          this.items.push(item)
        }
      })

      this.items.sort((before, after) => {
        const beforeId = Number(before.id)
        const afterId = Number(after.id)
        return afterId - beforeId
      })
    },
    async more() {
      if (!this.lastDoc) {
        throw Error('No more comments.')
      }
      const sn = await this.docRef
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .startAfter(this.lastDoc)
        .limit(LIMIT)
        .get()
      this.snToItems(sn)
    },
    async onIntersect(entries, observer, isIntersecting) {
      // console.log(isIntersecting)
      if (isIntersecting) {
        await this.more()
      }
    },
    subscribe() {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
      this.unsubscribe = this.docRef
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .limit(LIMIT)
        .onSnapshot(sn => {
          if (sn.empty) {
            this.items = []
            return
          }

          this.snToItems(sn)
        })
    },
    async save() {
      const doc = {
        createdAt: new Date(),
        updatedAt: new Date(),
        comment: this.comment,
        uid: this.$store.state.fireUser.uid,
        user: {
          email: this.user.email,
          photoURL: this.user.photoURL,
          displayName: this.user.displayName,
        },
      }
      const id = doc.createdAt.getTime().toString()

      this.docRef
        .collection('comments')
        .doc(id)
        .set(doc)
      this.comment = ''
    },
  },
}
</script>

<style lang="sass" scoped>
.comment
  white-space: pre-wrap
</style>
