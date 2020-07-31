<template lang="pug">
  v-expansion-panels
    v-expansion-panel
      v-expansion-panel-header History
      v-expansion-panel-content
        template(v-for="(item, i) in items")
          v-list-item(:key="item.id")
            v-list-item-action
              display-user(:user="item.user")
            v-list-item-content
              v-list-item-subtitle {{ item.type }} : {{ item.amount }}
              v-list-item-subtitle
                display-time(:time="item.actionTime")
          v-divider(:key="i")
        v-list-item
          v-btn(v-if="lastDoc" @click="more" text block color="primary") more
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
  props: ['docRef'],
  data() {
    return {
      items: [],
      unsubscribe: null,
      lastDoc: null,
    }
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
          item.actionTime = item.actionTime.toDate()
          this.items.push(item)
        }
      })
      // console.log(this.items)
      this.items.sort((before, after) => {
        const beforeId = Number(before.id)
        const afterId = Number(after.id)
        return afterId - beforeId
      })
    },
    async more() {
      if (!this.lastDoc) {
        throw Error('No more history.')
      }
      const sn = await this.docRef
        .collection('histories')
        .orderBy('actionTime', 'desc')
        .startAfter(this.lastDoc)
        .limit(LIMIT)
        .get()
      this.snToItems(sn)
    },
    subscribe() {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
      this.unsubscribe = this.docRef
        .collection('histories')
        .orderBy('actionTime', 'desc')
        .limit(LIMIT)
        .onSnapshot(sn => {
          if (sn.empty) {
            this.items = []
            return
          }
          this.snToItems(sn)
        })
    },
  },
}
</script>
