<template lang="pug">
  v-container(fluid)
    v-row(dense)
      v-col(
        v-for="rack in racks"
        :key="rack.id"
      )
        v-card.mx-auto(max-width="312")
          a(@click="rackLink(rack)" style="text-decoration: none;")
            v-img.white--text.align-end(
              :src="rack.coverUrl"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="194"
            )
              v-card-title.display-1(v-text="rack.title")
              v-card-text.font-italic id: {{ rack.rackId }}
          v-card-text
            v-row
              v-col(cols="4") POSITION:
              v-col(cols="8") {{ ellipseContent(rack.position, 10) }}
            v-row
              v-col(cols="12") {{ ellipseContent(rack.description, 40) }}
            v-row
              v-col(cols="4") created:
              v-col(cols="8" align="right") {{ rack.createdAt.toLocaleString() }}
            v-row
              v-col(cols="4") updated:
              v-col(cols="8" align="right") {{ rack.updatedAt.toLocaleString() }}
            v-row
              v-col(cols="4") boxes:
              v-col.display-3(cols="8" align="right") {{ rack.boxCount }}
            v-row
              v-col(cols="4") samples SKU:
              v-col.display-3(cols="8" align="right") {{ rack.sampleSKU }}
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

    },
    rackLink (rack) {
      this.$router.push('/rack/' + rack.title)
    },
    ellipseContent (txt, length) {
      const ellipseText =
        txt.length < length ? txt : txt.slice(0, length) + '...'

      return ellipseText
    }
  }
}
</script>
