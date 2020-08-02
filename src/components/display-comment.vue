<template lang="pug">
  v-card(flat)
    v-card-title
      v-textarea(
        v-model="comment"
        rows="1"
        outlined
        label="댓글 작성"
        placeholder="Ctrl + Enter 로 작성가능"
        append-icon="mdi-comment-plus"
        @click:append="save"
        @keypress.ctrl.enter="save"
        hide-details
        auto-grow
        clearable
      )
    template(v-for="(item, i) in items")
      v-list-item(:key="item.id")
        v-list-item-action
          display-user(:user="item.user")
        v-list-item-content
          v-list-item-subtitle.black--text.comment(v-text="item.comment")
          v-list-item-subtitle.font-italic
            display-time(:time="item.createdAt")
        v-list-item-action
          v-btn(text @click="like(item)") <v-icon left :color="liked(item) ? 'success' : ''">mdi-thumb-up</v-icon>
            span {{ item.likeCount }}
        v-list-item-action(v-if="(fireUser && fireUser.uid === item.uid) || (user && user.level === 0)")
          v-btn(icon @click="remove(item)") <v-icon>mdi-delete</v-icon>
      v-divider(:key="i" v-if="i < items.length - 1")
    v-list-item(v-if="lastDoc && items.length < article.commentCount")
      v-btn(v-intersect="onIntersect" @click="more" text color="primary" block) more
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
    fireUser() {
      return this.$store.state.fireUser
    },
    user() {
      return this.$store.state.user
    },
  },
  watch: {
    docRef() {
      this.subscribe()
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
        const findItem = this.items.find(item => doc.id === item.id)
        const item = doc.data()
        if (!findItem) {
          item.id = doc.id
          item.createdAt = item.createdAt.toDate()
          item.updatedAt = item.updatedAt.toDate()
          this.items.push(item)
        } else {
          findItem.comment = item.comment
          findItem.likeCount = item.likeCount
          findItem.likeUids = item.likeUids
          findItem.updatedAt = item.updatedAt.toDate()
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
    onIntersect(entries, observer, isIntersecting) {
      if (isIntersecting) {
        this.more()
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
      if (!this.fireUser) throw Error('로그인이 필요합니다')
      // if (this.comment.length > 10) throw Error('문자 허용치를 넘었습니다')
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
        likeCount: 0,
        likeUids: [],
      }
      const id = doc.createdAt.getTime().toString()

      this.docRef
        .collection('comments')
        .doc(id)
        .set(doc)
      this.comment = ''
    },
    async like(comment) {
      if (!this.fireUser) throw Error('로그인이 필요합니다')
      if (this.liked(comment)) {
        await this.docRef
          .collection('comments')
          .doc(comment.id)
          .update({
            likeCount: this.$firebase.firestore.FieldValue.increment(-1),
            likeUids: this.$firebase.firestore.FieldValue.arrayRemove(
              this.fireUser.uid
            ),
          })
      } else {
        await this.docRef
          .collection('comments')
          .doc(comment.id)
          .update({
            likeCount: this.$firebase.firestore.FieldValue.increment(1),
            likeUids: this.$firebase.firestore.FieldValue.arrayUnion(
              this.fireUser.uid
            ),
          })
      }

      // ??
      if (this.items.findIndex(el => el.id === comment.id) < LIMIT) return
      const doc = await this.docRef
        .collection('comments')
        .doc(comment.id)
        .get()
      const item = doc.data()
      comment.likeCount = item.likeCount
      comment.likeUids = item.likeUids
    },
    liked(item) {
      if (!this.fireUser) return false
      return item.likeUids.includes(this.fireUser.uid)
    },
    async remove(comment) {
      // if (!this.fireUser) throw Error('로그인이 필요합니다')
      await this.docRef
        .collection('comments')
        .doc(comment.id)
        .delete()
      const i = this.items.findIndex(el => el.id === comment.id)
      this.items.splice(i, 1)
    },
  },
}
</script>

<style lang="sass" scoped>
.comment
  white-space: pre-wrap
</style>
