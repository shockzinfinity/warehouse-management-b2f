<template lang="pug">
  v-container(fluid)
    v-row(dense)
      v-col(
        v-for="rack in racks"
        :key="rack.id"
      )
        v-card.mx-auto(max-width="344")
          v-img.white--text.align-end(
            src="../../assets/images/rack.preview.jpg"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            height="194"
          )
            v-card-title.display-1(v-text="rack.title")
            v-card-text {{ rack.rackId }}
          v-card-text
            v-row
              v-col(cols="5") POSITION:
              v-col(cols="7") {{ rack.position }}
            v-row
              v-col(cols="12") {{ rack.description }}
            v-row
              v-col(cols="5") createdAt:
              v-col(cols="7" align="right") {{ rack.createdAt.toLocaleString() }}
            v-row
              v-col(cols="5") updatedAt:
              v-col(cols="7" align="right") {{ rack.updatedAt.toLocaleString() }}
            v-row
              v-col(cols="5") box Count:
              v-col.display-3(cols="7" align="right") {{ rack.boxCount }}
          v-card-actions
            v-spacer
            v-btn(icon) <v-icon>mdi-heart</v-icon>
            v-btn(icon) <v-icon>mdi-bookmark</v-icon>
            v-btn(icon) <v-icon>mdi-share-variant</v-icon>
</template>

<script>
export default {
  data () {
    return {
      racks: [],
      unsubscribe: null
    }
  },
  created () {
    this.subscribe()
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe () {
      if (this.unsubscribe) this.unsubscribe()
      const ref = this.$firebase.firestore().collection('racks')
      this.unsubscribe = ref.onSnapshot(sn => {
        if (sn.empty) {
          this.racks = []
          return
        }
        this.racks = sn.docs.map(doc => {
          // console.log(doc.data())
          const item = doc.data()
          item.createdAt = item.createdAt.toDate()
          item.updatedAt = item.updatedAt.toDate()
          return item
        })
      })
    },
    rackWrite () {

    }
  }
}
</script>
