<template lang="pug">
  v-container(fluid v-if="items.length")
    template(v-for="(item, i) in items")
      v-card(:key="item.id" :class="i < items.length - 1 ? 'mb-4' : ''" :to="`${boxId}/${item.id}`")
        v-subheader
          v-chip.mr-4(color="info" label small) {{ item.category }}
          display-time(:time="item.createdAt")
          v-spacer
          v-btn(icon v-if="fireUser && fireUser.uid === item.uid" :to="`${boxId}/${item.id}?action=write`")
            v-icon mdi-pencil
        v-card-title {{ item.title }}
        v-card-text
          viewer(v-if="item.summary" :initialValue="item.summary")
          v-container(v-else)
            v-row(justify="center" align="center")
              v-progress-circular(indeterminate)
        v-card-actions
          display-user(:user="item.user")
          v-spacer
          v-sheet.mr-4
            v-icon(left :color="item.currentStock ? 'info' : ''") mdi-pail-plus-outline
            span.body-2 {{ item.currentStock }}
          v-sheet.mr-4
            v-icon(left :color="item.readCount ? 'info' : ''") mdi-eye
            span.body-2 {{ item.readCount }}
          v-sheet.mr-4
            v-icon(left :color="item.commentCount ? 'info' : ''") mdi-comment
            span.body-2 {{ item.commentCount }}
          v-sheet.mr-0
            v-icon(left :color="item.likeCount ? 'success' : ''") mdi-thumb-up
            span.body-2 {{ item.likeCount }}
  v-container(fluid v-else)
    v-alert.mb-0(type="warning" border="left")
    | 데이터가 없습니다.
</template>

<script>
import { last } from 'lodash'
import DisplayTime from '@/components/display-time'
import DisplayUser from '@/components/display-user'
const LIMIT = 5

export default {
  components: {
    DisplayTime,
    DisplayUser,
  },
  props: ['box', 'boxId'],
  data() {
    return {
      items: [],
      unsubscribe: null,
      order: 'createdAt',
      sort: 'desc',
      lastDoc: null,
      ref: null,
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
    boxId() {
      this.subscribe(0)
    },
  },
  created() {
    this.subscribe()
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
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
          if (findItem.summary) {
            findItem.summary = ''
            setTimeout(() => {
              findItem.summary = item.summary
            }, 1000)
          }
          findItem.title = item.title
          findItem.readCount = item.readCount
          findItem.commentCount = item.commentCount
          findItem.likeCount = item.likeCount
          findItem.likeUids = item.likeUids
          findItem.category = item.category
          findItem.tags = item.tags
          findItem.currentStock = item.currentStock
          findItem.createdAt = item.createdAt.toDate()
          findItem.updatedAt = item.updatedAt.toDate()
        }
      })

      this.items.sort((before, after) => {
        return Number(after.id) - Number(before.id)
      })
    },
    subscribe() {
      if (this.unsubscribe) this.unsubscribe()
      this.ref = this.$firebase
        .firestore()
        .collection('boxes')
        .doc(this.boxId)
        .collection('samples')
        .orderBy(this.order, this.sort)
        .limit(LIMIT)

      this.unsubscribe = this.ref.onSnapshot(sn => {
        if (sn.empty) {
          this.items = []
          return
        }

        this.snToItems(sn)
      })
    },
    async more() {
      if (!this.lastDoc) throw Error('No more data')
      const sn = await this.ref.startAfter(this.lastDoc).get()
      this.snToItems(sn)
    },
    onIntersect(entries, observer, isIntersecting) {
      if (isIntersecting) this.more()
    },
    read(item) {
      this.$router.push({ path: this.$route.path + '/' + item.id })
    },
  },
}
</script>

<style lang="sass" scoped>
.text-content
  white-space: pre-wrap
</style>
