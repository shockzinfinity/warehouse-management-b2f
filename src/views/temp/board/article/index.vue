<template lang="pug">
  div
    v-data-table(
      :headers="headers"
      :items="items"
      :server-items-length="info.count"
      :options.sync="options"
      :items-per-page="5"
      :footer-props="{'items-per-page-options': [5, 10, 20, 30]}"
      must-sort
      item-key="id"
    )
      template(v-slot:item.createdAt="{item}")
        display-time(:time="item.createdAt")
      template(v-slot:item.title="{item}")
        a(@click="openDialog(item)") {{ item.title }}
      template(v-slot:item.user.displayName="{item}")
        display-user(:user="item.user")
    v-dialog(v-model="dialog" v-if="selectedItem" fullscreen)
      display-content(:item="selectedItem" :document="document" @close="dialog = false")
</template>

<script>
import { head, last } from 'lodash'
import DisplayTime from '@/components/display-time'
import DisplayUser from '@/components/display-user'
import DisplayContent from '@/components/display-content'

export default {
  components: {
    DisplayTime,
    DisplayUser,
    DisplayContent,
  },
  props: ['info', 'document'],
  data() {
    return {
      headers: [
        { value: 'createdAt', text: '작성일' },
        { value: 'title', text: '제목' },
        { value: 'user.displayName', text: '작성자' },
        { value: 'readCount', text: '조회수' },
        { value: 'commentCount', text: '댓글' },
      ],
      items: [],
      unsubscribe: null,
      docs: [],
      options: {
        sortBy: ['createdAt'],
        sortDesc: [true],
      },
      dialog: false,
      selectedItem: null,
    }
  },
  watch: {
    document() {
      this.subscribe(0)
    },
    options: {
      handler(n, o) {
        if (!o.page) {
          this.subscribe(0)
          return
        }
        if (
          head(o.sortBy) !== head(n.sortBy) ||
          head(o.sortDesc) !== head(n.sortDesc)
        ) {
          n.page = 1
          this.subscribe(0)
          return
        }
        const arrow = n.page - o.page
        this.subscribe(arrow)
      },
      deep: true,
    },
    dialog(n, o) {
      if (!n) {
        this.selectedItem = null
      }
    },
  },
  created() {
    // this.subscribe(0)
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  methods: {
    subscribe(arrow) {
      if (this.unsubscribe) {
        this.unsubscribe()
      }

      const order = head(this.options.sortBy)
      const sort = head(this.options.sortDesc) ? 'desc' : 'asc'
      const limit = this.options.itemsPerPage
      const ref = this.$firebase
        .firestore()
        .collection('boards')
        .doc(this.document)
        .collection('articles')
        .orderBy(order, sort)
      let query

      switch (arrow) {
        case -1:
          query = ref.endBefore(head(this.docs)).limitToLast(limit)
          break
        case 1:
          query = ref.startAfter(last(this.docs)).limit(limit)
          break
        default:
          query = ref.limit(limit)
          break
      }
      this.unsubscribe = query.onSnapshot(sn => {
        if (sn.empty) {
          this.items = []
          return
        }
        this.docs = sn.docs
        this.items = sn.docs.map(doc => {
          const item = doc.data()
          item.id = doc.id
          item.createdAt = item.createdAt.toDate()
          item.updatedAt = item.updatedAt.toDate()
          return item
        })
      })
    },
    openDialog(item) {
      this.selectedItem = item
      this.dialog = true
    },
  },
}
</script>
