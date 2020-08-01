<template lang="pug">
  v-container(fluid)
    v-card(v-if="sample")
      v-toolbar(color="info" dark dense flat)
        v-toolbar-title {{ sample.title }}
        v-spacer
        v-btn(@click="sampleWrite" icon) <v-icon>mdi-pencil</v-icon>
        v-btn(@click="remove" icon) <v-icon>mdi-delete</v-icon>
        v-btn(@click="back" icon) <v-icon>mdi-close</v-icon>
      v-card-text
        v-row.no-gutters
          v-col.pb-2(lg="6" cols="sm")
            v-img.mx-auto(:src="sample.qrCodeUrl" max-width="200px")
          v-col.pb-2(lg="6" cols="sm")
            v-row
              v-text-field(type="number" v-model="stockInOut" flat dense outlined label="Current stock")
              v-btn(icon @click="incomming") <v-icon>mdi-basket-fill</v-icon>
              v-btn(icon @click="outcomming") <v-icon>mdi-basket-unfill</v-icon>
      v-card-text
        viewer(v-if="content" :initialValue="content")
        v-container(v-else)
          v-row(justify="center" align="center")
            v-progress-circular(indeterminate)
      v-card-actions
        v-spacer
        span.font-italic.caption 작성일: <display-time :time="sample.createdAt"></display-time>
      v-card-actions
        v-spacer
        span.font-italic.caption 수정일: <display-time :time="sample.updatedAt"></display-time>
      v-divider
      display-history(:docRef="ref")
      v-divider
      display-comment(:article="sample" :docRef="ref")
    v-card(v-else)
      v-container
        v-row(justify="center" align="center")
          v-progress-circular(indeterminate)
</template>

<script>
import axios from 'axios'
import DisplayTime from '@/components/display-time'
import DisplayComment from '@/components/display-comment'
import DisplayHistory from '@/components/display-history'

export default {
  components: {
    DisplayTime,
    DisplayComment,
    DisplayHistory,
  },
  props: ['boxId', 'sampleId'],
  data() {
    return {
      content: '',
      ref: this.$firebase
        .firestore()
        .collection('boxes')
        .doc(this.boxId)
        .collection('samples')
        .doc(this.sampleId),
      unsubscribe: null,
      sample: null,
      stockInOut: 0,
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  async created() {
    await this.readCountUpdate()
    this.subscribe()
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    async readCountUpdate() {
      await this.ref.update({
        readCount: this.$firebase.firestore.FieldValue.increment(1),
      })
    },
    subscribe() {
      if (this.unsubscribe) this.unsubscribe()
      this.unsubscribe = this.ref.onSnapshot(doc => {
        if (!doc.exists) {
          this.back()
          return
        }
        const item = doc.data()
        item.createdAt = item.createdAt.toDate()
        item.updatedAt = item.updatedAt.toDate()
        if (!this.sample || this.sample.url !== item.url) this.fetch(item.url)
        this.sample = item
        this.stockInOut = this.sample.currentStock
      }, console.error)
    },
    async fetch(url) {
      this.content = ''
      const r = await axios.get(url)
      this.content = typeof r.data === 'string' ? r.data : r.data.toString()
    },
    async sampleWrite() {
      this.$router.push({ path: this.$route.path, query: { action: 'write' } })
    },
    async remove() {
      await this.ref.delete()
    },
    back() {
      const us = this.$route.path.split('/')
      us.pop()
      this.$router.push({ path: us.join('/') })
    },
    async incomming() {
      if (this.stockInOut <= 0) {
        return
      }
      const history = {
        actionTime: new Date(),
        type: 'in',
        amount: this.stockInOut,
        user: {
          email: this.user.email,
          photoURL: this.user.photoURL,
          displayName: this.user.displayName,
        },
      }
      const id = history.actionTime.getTime().toString()
      const batch = this.$firebase.firestore().batch()
      batch.set(this.ref.collection('histories').doc(id), history)
      batch.update(this.ref, {
        currentStock: this.$firebase.firestore.FieldValue.increment(
          parseInt(this.stockInOut)
        ),
      })
      await batch.commit()
    },
    async outcomming() {
      if (this.stockInOut <= 0) {
        return
      }
      const out = this.currentStock - this.stockInOut
      if (out < 0) {
        throw Error('insufficient stock')
      }
      const history = {
        actionTime: new Date(),
        type: 'out',
        amount: this.stockInOut,
        user: {
          email: this.user.email,
          photoURL: this.user.photoURL,
          displayName: this.user.displayName,
        },
      }
      const id = history.actionTime.getTime().toString()
      const batch = this.$firebase.firestore().batch()

      batch.set(this.ref.collection('histories').doc(id), history)
      batch.update(this.ref, {
        currentStock: this.$firebase.firestore.FieldValue.increment(
          -parseInt(this.stockInOut)
        ),
      })
      await batch.commit()
    },
  },
}
</script>
