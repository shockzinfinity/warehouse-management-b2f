<template lang="pug">
  v-card
    v-card-title
      v-text-field(v-model="comment" outlined label="댓글 작성" @keypress.enter="save" hide-details)
    template(v-for="(item, i) in items")
      v-list-item(:key="item.id")
        v-list-item-action
          display-user(:user="item.user")
        v-list-item-content
          v-list-item-subtitle(v-text="item.comment")
          v-list-item-subtitle
            display-time(:time="item.createdAt")
      v-divider(:key="i")
    v-list-item
      v-btn(v-if="lastDoc" @click="more" text color="primary" block) more
</template>

<script>
import { last } from 'lodash'
import DisplayTime from '@/components/display-time'
import DisplayUser from '@/components/display-user'
const LIMIT = 5

export default {
  components: { DisplayTime, DisplayUser },
  props: ['article', 'docRef'],
  data () {
    return {
      comment: '',
      items: [],
      unsubscribe: null,
      lastDoc: null
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  created () {
    this.subscribe()
    // console.log(this.article)
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    snToItems (sn) {
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
    async more () {
      if (!this.lastDoc) throw Error('No more comments.')
      const sn = await this.docRef.collection('comments').orderBy('createdAt', 'desc').startAfter(this.lastDoc).limit(LIMIT).get()
      this.snToItems(sn)
    },
    subscribe () {
      if (this.unsubscribe) this.unsubscribe()
      this.unsubscribe = this.docRef.collection('comments').orderBy('createdAt', 'desc').limit(LIMIT).onSnapshot(sn => {
        if (sn.empty) {
          this.items = []
          return
        }

        this.snToItems(sn)
      })
    },
    async save () {
      const doc = {
        createdAt: new Date(),
        updatedAt: new Date(),
        comment: this.comment,
        uid: this.$store.state.fireUser.uid,
        user: {
          email: this.user.email,
          photoURL: this.user.photoURL,
          displayName: this.user.displayName
        }
      }
      const id = doc.createdAt.getTime().toString()
      const batch = this.$firebase.firestore().batch()
      batch.update(this.docRef, { commentCount: this.$firebase.firestore.FieldValue.increment(1) })
      batch.set(this.docRef.collection('comments').doc(id), doc)
      await batch.commit()
      this.comment = ''
    }
  }
}
</script>
