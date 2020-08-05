<template lang="pug">
  div(v-if="rack")
    v-data-table(
      :headers="headers"
      :items="items"
      :server-items-length="rack.boxCount"
      :options.sync="options"
      :items-per-page="5"
      :footer-props="{'items-per-page-options':[5,10,20,30,50]}"
      must-sort
      item-key="boxId"
    )
      template(v-slot:item.createdAt="{ item }")
        display-time(:time="item.createdAt.toDate()")
      template(v-slot:item.title="{ item }")
        a(@click="read(item)") {{ item.title }}
      template(v-slot:item.user.displayName="{ item }")
        display-user(:user="item.user")
</template>

<script>
import { head, last } from 'lodash'
import DisplayTime from '@/components/display-time'
import DisplayUser from '@/components/display-user'

export default {
  components: {
    DisplayTime,
    DisplayUser,
  },
  props: ['rack', 'rackId'],
  data() {
    return {
      headers: [
        { value: 'createdAt', text: '작성일' },
        { value: 'title', text: '박스명' },
        { value: 'sampleCount', text: '샘플수' },
        { value: 'user.displayName', text: '작성자' },
      ],
      items: [],
      docs: [],
      unsubscribe: null,
      options: {
        itemsPerPage: 5,
        sortBy: ['createdAt'],
        sortDesc: [true],
      },
    }
  },
  watch: {
    rackId() {
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
  created() {},
  mounted() {
    this.subscribe(0)
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe(arrow) {
      if (this.unsubscribe) this.unsubscribe()
      if (!this.rack) return

      const order = this.options.sortBy[0]
      const sort = this.options.sortDesc[0] ? 'desc' : 'asc'
      const limit = this.options.itemsPerPage
      const ref = this.$firebase.firestore().collection('boxes')

      let query = ref
        .where('parentRackId', '==', this.rack.rackId)
        .orderBy(order, sort)

      switch (arrow) {
        case -1:
          query = query.endBefore(head(this.docs)).limitToLast(limit)
          break
        case 1:
          query = query.startAfter(last(this.docs)).limit(limit)
          break
        default:
          query = query.limit(limit)
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
          return item
        })
      })
    },
    read(item) {
      this.$router.push({
        path: '/box/' + item.id,
        query: { rackTitle: this.rack.title },
      })
    },
  },
}
</script>
