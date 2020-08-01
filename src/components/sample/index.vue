<template lang="pug">
  div
    v-data-table(
      :headers="headers"
      :items="items"
      :server-items-length="box.count"
      :options.sync="options"
      :items-per-page="5"
      :footer-props="{'items-per-page-options':[5,10,20,30,50]}"
      must-sort
      item-key="id"
    )
      template(v-slot:item.createdAt="{ item }")
        display-time(:time="item.createdAt")
      template(v-slot:item.title="{ item }")
        a(@click="read(item)") {{ item.title }}
      template(v-slot:item.user.displayName="{ item }")
        display-user(:user="item.user")
</template>

<script>
import { head, last } from 'lodash'
import DisplayTime from '@/components/display-time'
import DisplayUser from '@/components/display-user'
// import DisplaySample from '@/components/display-sample'

export default {
  components: {
    DisplayTime,
    DisplayUser,
    // DisplaySample,
  },
  props: ['box', 'boxId'],
  data() {
    return {
      headers: [
        { value: 'createdAt', text: '등록일' },
        { value: 'title', text: '샘플명' },
        { value: 'user.displayName', text: '등록자' },
        { value: 'currentStock', text: '현재고' },
        { value: 'commentCount', text: '댓글' },
      ],
      items: [],
      docs: [],
      unsubscribe: null,
      options: {
        itemsPerPage: 5,
        sortBy: ['createdAt'],
        sortDesc: [true],
      },
      dialog: false,
      selectedItem: null,
    }
  },
  watch: {
    boxId() {
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
          head(o.sortDesc) !== head(o.sortDesc)
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
  },
  methods: {
    subscribe(arrow) {
      if (this.unsubscribe) this.unsubscribe()

      const order = this.options.sortBy[0]
      const sort = this.options.sortDesc[0] ? 'desc' : 'asc'
      const limit = this.options.itemsPerPage
      const ref = this.$firebase
        .firestore()
        .collection('boxes')
        .doc(this.boxId)
        .collection('samples')
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
    read(item) {
      this.$router.push({ path: this.$route.path + '/' + item.id })
    },
  },
  created() {},
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
}
</script>
