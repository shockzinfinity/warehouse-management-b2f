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
      item-key="boxId"
    )
      template(v-slot:item.createdAt="{item}")
        display-time(:time="item.createdAt")
      template(v-slot:item.title="{item}")
        a(@click="openBox(item)") {{ item.title }}
      template(v-slot:item.user.displayName="{item}")
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
    DisplayUser
    // DisplaySample
  },
  props: {
    info: Object,
    document: String
  },
  data () {
    return {
      headers: [
        { value: 'createdAt', text: '작성일' },
        { value: 'boxId', text: 'boxId' },
        { value: 'title', text: '박스명' },
        { value: 'user.displayName', text: '등록자' }
      ],
      items: [],
      unsubscribe: null,
      docs: [],
      options: {
        sortBy: ['createdAt'],
        sortDesc: [true]
      },
      dialog: false,
      selectedItem: null
    }
  },
  watch: {
    info () {
      this.subscribe(0)
    },
    options: {
      handler (n, o) {
        if (!o.page) {
          this.subscribe(0)
          return
        }
        if (head(o.sortBy) !== head(n.sortBy) || head(o.sortDesc) !== head(n.sortDesc)) {
          n.page = 1
          this.subscribe(0)
          return
        }
        const arrow = n.page - o.page
        this.subscribe(arrow)
      },
      deep: true
    },
    dialog (n, o) {
      if (!n) {
        this.selectedItem = null
      }
    }
  },
  created () {
    // this.subscribe(0)
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe (arrow) {
      if (!this.info.rackId) return
      if (this.unsubscribe) this.unsubscribe()

      const order = head(this.options.sortBy)
      const sort = head(this.options.sortDesc) ? 'desc' : 'asc'
      const limit = this.options.itemsPerPage
      const ref = this.$firebase.firestore().collection('boxes')
      let query = ref.where('parentRackId', '==', this.info.rackId).orderBy(order, sort)
      // console.log(this.info.rackId)

      switch (arrow) {
        case -1: query = query.endBefore(head(this.docs)).limitToLast(limit)
          break
        case 1: query = query.startAfter(last(this.docs)).limit(limit)
          break
        default: query = query.limit(limit)
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
    openBox (item) {
      this.selectedItem = item
      console.log(item)
      this.$router.push('/box/' + item.id)
    }
  }
}
</script>
