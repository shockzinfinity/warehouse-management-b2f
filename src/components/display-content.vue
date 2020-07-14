<template lang="pug">
  v-card
    v-toolbar(color="primary" dark)
      v-toolbar-title {{ item.title }}
      v-spacer
      v-btn(icon @click="articleWrite") <v-icon>mdi-pencil</v-icon>
      v-btn(icon @click="remove") <v-icon>mdi-delete</v-icon>
      v-btn(icon @click="$emit('close')") <v-icon>mdi-close</v-icon>
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
</template>

<script>
import axios from 'axios'
import DisplayTime from '@/components/display-time'

export default {
  components: {
    DisplayTime
  },
  props: ['document', 'item'],
  data () {
    return {
      content: '',
      ref: this.$firebase.firestore().collection('boards').doc(this.document)
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
      await this.ref.collection('articles').doc(this.item.id).update({
        readCount: this.$firebase.firestore.FieldValue.increment(1)
      })
    },
    async articleWrite () {
      this.$router.push({ path: this.$route.path + '/article-write', query: { articleId: this.item.id } })
    },
    async remove () {
      const batch = this.$firebase.firestore().batch()
      batch.update(this.ref, { count: this.$firebase.firestore.FieldValue.increment(-1) })
      batch.delete(this.ref.collection('articles').doc(this.item.id))
      await batch.commit()

      // REF delete step
      // 1. count
      // 2. firestore
      // 3. storage
      // await this.ref.update({ count: this.$firebase.firestore.FieldValue.increment(-1) })
      // await this.ref.collection('articles').doc(this.item.id).delete()
      await this.$firebase.storage().ref().child('boards').child(this.document).child(this.item.id + '.md').delete()

      this.$emit('close')
    }
  }
}
</script>
