<template lang="pug">
  div
    v-row
      v-col.pb-2(
        lg="4" cols="sm"
        v-for="box in boxes"
        :key="box.id"
      )
        v-card(max-width="312")
          a(@click="boxLink(box)" style="text-decoration: none;")
            v-img.white--text.align-end(
              :src="box.coverUrl"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="150px"
            )
              v-card-title
                h2(v-text="box.title")
              v-card-text.font-italic id: {{ box.boxId }}
          v-card-text
            v-row
              v-col(cols="12") {{ ellipseContent(box.description, 40) }}
            v-row.no-gutters
              v-col(cols="4") created:
              v-col(cols="8" align="right") {{ box.createdAt.toLocaleString() }}
            v-row.no-gutters
              v-col(cols="4") updated:
              v-col(cols="8" align="right") {{ box.updatedAt.toLocaleString() }}
            v-row.no-gutters
              v-col(cols="4") samples:
              v-col.display-3(cols="8" align="right") {{ box.sampleCount }}
          v-card-actions
            v-spacer
            v-btn(icon) <v-icon>mdi-heart</v-icon>
            v-btn(icon) <v-icon>mdi-bookmark</v-icon>
            v-btn(icon) <v-icon>mdi-share-variant</v-icon>
</template>

<script>
export default {
  data() {
    return {
      boxes: [],
      unsubscribe: null,
    }
  },
  created() {
    this.subscribe()
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe() {
      if (this.unsubscribe) this.unsubscribe()

      const ref = this.$firebase
        .firestore()
        .collection('boxes')
        .orderBy('createdAt', 'asc')
      this.unsubscribe = ref.onSnapshot(sn => {
        if (sn.empty) {
          this.racks = []
          return
        }
        this.boxes = sn.docs.map(doc => {
          const item = doc.data()
          item.id = doc.id
          item.createdAt = item.createdAt.toDate()
          item.updatedAt = item.updatedAt.toDate()
          return item
        })
      })
    },
    async boxWrite() {},
    boxLink(box) {
      this.$router.push('/box/' + box.id)
    },
    ellipseContent(text, length) {
      const ellipseText =
        text.length < length ? text : text.slice(0, length) + '...'

      return ellipseText
    },
  },
}
</script>
