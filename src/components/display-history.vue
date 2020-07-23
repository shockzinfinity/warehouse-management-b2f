<template lang="pug">
    v-card
      v-card-title history
      template(v-for="(item, i) in items")
        v-list-item(:key="item.id")
          v-list-item-action
            display-user(:user="item.user")
          v-list-item-content
            v-list-item-subtitle
              display-time(:time="item.actionTime")
        v-divider(:key="i")
</template>

<script>
import DisplayTime from '@/components/display-time'
import DisplayUser from '@/components/display-user'

export default {
  props: ['docRef'],
  components: {
    DisplayTime,
    DisplayUser
  },
  created () {
    this.subscribe()
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  },
  data () {
    return {
      items: [],
      unsubscribe: null
    }
  },
  methods: {
    subscribe () {
      if (this.unsubscribe) this.unsubscribe()
      this.unsubscribe = this.docRef.collection('histories').onSnapshot(sn => {
        if (sn.empty) {
          this.items = []
          return
        }
        this.items = sn.docs.map(doc => {
          const item = doc.data()
          item.id = doc.id
          return item
        })
      })
    }
  }
}
</script>
