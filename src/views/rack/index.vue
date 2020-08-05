<template lang="pug">
  div
    v-row
      v-col.pb-2(
        lg="4" cols="sm"
        v-for="rack in racks"
        :key="rack.id"
      )
        v-card(max-width="312")
          a(@click="rackLink(rack)" style="text-decoration: none;")
            v-img.white--text.align-end(
              :src="rack.coverUrl"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="150px"
            )
              v-card-title
                h2(v-text="rack.title")
              v-card-text.font-italic id: {{ rack.rackId }}
          v-card-text
            v-row.no-gutters
              v-col(cols="4") POSITION:
              v-col(cols="8") {{ ellipseContent(rack.position, 10) }}
            v-row
              v-col(cols="12") {{ ellipseContent(rack.description, 40) }}
            v-row.no-gutters
              v-col(cols="4") created:
              v-col(cols="8" align="right") {{ rack.createdAt.toLocaleString() }}
            v-row.no-gutters
              v-col(cols="4") updated:
              v-col(cols="8" align="right") {{ rack.updatedAt.toLocaleString() }}
            v-row.no-gutters
              v-col(cols="4") boxes:
              v-col.display-3(cols="8" align="right") {{ rack.boxCount }}
            v-row.no-gutters
              v-col(cols="4") samples SKU:
              v-col.display-3(cols="8" align="right") {{ rack.sampleSKU }}
          v-card-actions
            v-spacer
            //- v-btn(icon @click="like(rack)") <v-icon :color="liked(rack) ? 'success' : ''">mdi-thumb-up</v-icon> <span>{{ rack.likeCount }}</span>
            //- v-btn(icon) <v-icon>mdi-heart</v-icon>
            //- v-btn(icon) <v-icon>mdi-bookmark</v-icon>
            //- v-btn(icon) <v-icon>mdi-share-variant</v-icon>
</template>

<script>
export default {
  data() {
    return {
      racks: [],
      unsubscribe: null,
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
  created() {
    this.subscribe()
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe() {
      if (this.unsubscribe) this.unsubscribe()

      this.ref = this.$firebase.firestore().collection('racks')
      this.unsubscribe = this.ref.onSnapshot(sn => {
        if (sn.empty) {
          this.racks = []
          return
        }
        this.racks = sn.docs.map(doc => {
          const item = doc.data()
          item.id = doc.id
          item.createdAt = item.createdAt.toDate()
          item.updatedAt = item.updatedAt.toDate()
          return item
        })
      })
    },
    liked(item) {
      if (!this.fireUser) return false
      return item.likeUids.includes(this.fireUser.uid)
    },
    async like(rack) {
      if (!this.fireUser) throw Error('로그인이 필요합니다')
      if (this.liked(rack)) {
        await this.ref.doc(rack.id).update({
          likeCount: this.$firebase.firestore.FieldValue.increment(-1),
          likeUids: this.$firebase.firestore.FieldValue.arrayRemove(
            this.fireUser.uid
          ),
        })
      } else {
        await this.ref.doc(rack.id).update({
          likeCount: this.$firebase.firestore.FieldValue.increment(1),
          likeUids: this.$firebase.firestore.FieldValue.arrayUnion(
            this.fireUser.uid
          ),
        })
      }

      const doc = await this.ref.doc(rack.id).get()
      const item = doc.data()
      rack.likeCount = item.likeCount
      rack.likeUids = item.likeUids
    },
    async rackWrite() {},
    rackLink(rack) {
      this.$router.push('/rack/' + rack.id)
    },
    ellipseContent(text, length) {
      const ellipseText =
        text.length < length ? text : text.slice(0, length) + '...'

      return ellipseText
    },
  },
}
</script>
