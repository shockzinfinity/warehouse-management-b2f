<template lang="pug">
  v-card
    v-toolbar(color="primary" dark)
      v-toolbar-title {{ item.title }}
      v-spacer
      v-btn(icon @click="sampleWrite") <v-icon>mdi-pencil</v-icon>
      v-btn(icon @click="remove") <v-icon>mdi-delete</v-icon>
      v-btn(icon @click="incomming") <v-icon>mdi-basket-fill</v-icon>
      v-btn(icon @click="outcomming") <v-icon>mdi-basket-unfill</v-icon>
      v-btn(icon @click="$emit('close')") <v-icon>mdi-close</v-icon>
    v-card-text
      v-spacer
      v-text-field(type="number" style="width: 100px" v-model="stockInOut" flat dense outlined)
      v-btn(icon @click="incomming") <v-icon>mdi-basket-fill</v-icon>
      v-btn(icon @click="outcomming") <v-icon>mdi-basket-unfill</v-icon>
    hr
    v-card-text
      viewer(v-if="content" :initialValue="content")
      v-container(v-else)
        v-row(justify="center" align="center")
          v-progress-circular(indeterminate)
    v-card-actions
      v-spacer
      span.font-italic.caption 작성일: 
        display-time(:time="item.createdAt")
    v-card-actions
      v-spacer
      span.font-italic.caption 수정일: 
        display-time(:time="item.updatedAt")
    v-img(:src="item.qrcodeUrl")
    v-divider
    display-comment(:docRef="this.ref.collection('samples').doc(this.item.id)")
</template>

<script>
import axios from 'axios'
import DisplayTime from '@/components/display-time'
import DisplayComment from '@/components/display-comment'

export default {
  components: {
    DisplayTime,
    DisplayComment
  },
  props: ['document', 'item'],
  data () {
    return {
      spinnerModel: 10,
      content: '',
      ref: this.$firebase.firestore().collection('boxes').doc(this.document),
      stockInOut: 1,
      currentStock: 0
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  mounted () {
    // console.log('mounted')
    this.fetch()
  },
  methods: {
    async fetch () {
      const r = await axios.get(this.item.url)
      this.content = r.data
      await this.ref.collection('samples').doc(this.item.id).update({
        readCount: this.$firebase.firestore.FieldValue.increment(1)
      })
      this.stockInOut = this.currentStock = this.item.currentStock
      // console.log(this.item.currentStock)
    },
    async sampleWrite () {
      // console.log(this.item.id)
      this.$router.push({ path: this.$route.path + '/sample-write', query: { sampleId: this.item.id } })
    },
    async remove () {
      const batch = this.$firebase.firestore().batch()
      batch.update(this.ref, { count: this.$firebase.firestore.FieldValue.increment(-1) })
      batch.delete(this.ref.collection('samples').doc(this.item.id))
      await batch.commit()

      // REF delete step
      // 1. count
      // 2. firestore
      // 3. storage
      // await this.ref.update({ count: this.$firebase.firestore.FieldValue.increment(-1) })
      // await this.ref.collection('articles').doc(this.item.id).delete()
      await this.$firebase.storage().ref().child('boxes').child(this.document).child(this.item.id + '.md').delete()

      this.$emit('close')
    },
    async incomming () {
      const history = {
        actionTime: new Date(),
        type: 'in',
        amount: this.stockInOut,
        user: {
          email: this.user.email,
          photoURL: this.user.photoURL,
          displayName: this.user.displayName
        }
      }
      const id = history.actionTime.getTime().toString()
      const batch = this.$firebase.firestore().batch()
      // console.log(this.stockInOut)
      batch.set(this.ref.collection('samples').doc(this.item.id).collection('histories').doc(id), history)
      batch.update(this.ref.collection('samples').doc(this.item.id), { currentStock: this.$firebase.firestore.FieldValue.increment(this.stockInOut) })
      // await this.ref.collection('samples').doc(this.item.id).update({
      //   currentStock: this.$firebase.firestore.FieldValue.increment(this.stockInOut)
      // })
      await batch.commit()
      this.$emit('close')
    },
    async outcomming () {
      // type : in/out
      // amount : stockInOut
      // action Time : Date()
      // user
      // console.log(this.stockInOut)
      const out = this.currentStock - this.stockInOut
      if (out < 0) {
        // console.log('current', this.currentStock)
        // console.log('outcomming', this.stockInOut)
        this.$emit('close')
        return
      }
      const history = {
        actionTime: new Date(),
        type: 'in',
        amount: this.stockInOut,
        user: {
          email: this.user.email,
          photoURL: this.user.photoURL,
          displayName: this.user.displayName
        }
      }
      const id = history.actionTime.getTime().toString()
      const batch = this.$firebase.firestore().batch()

      batch.set(this.ref.collection('samples').doc(this.item.id).collection('histories').doc(id), history)
      batch.update(this.ref.collection('samples').doc(this.item.id), { currentStock: this.$firebase.firestore.FieldValue.increment(-this.stockInOut) })
      // await this.ref.collection('samples').doc(this.item.id).update({
      //   currentStock: this.$firebase.firestore.FieldValue.increment(-this.stockInOut)
      // })
      await batch.commit()
      this.$emit('close')
    }
  }
}
</script>
