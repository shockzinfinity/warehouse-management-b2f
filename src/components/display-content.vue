<template lang="pug">
  v-card
    v-toolbar(color="primary" dark)
      v-toolbar-title {{ item.title }}
      v-spacer
      v-btn(icon @click="articleWrite") <v-icon>mdi-pencil</v-icon>
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
  props: ['item'],
  data () {
    return {
      content: ''
    }
  },
  mounted () {
    console.log('mounted')
    this.fetch()
  },
  methods: {
    async fetch () {
      const r = await axios.get(this.item.url)
      this.content = r.data
    },
    async articleWrite () {
      this.$router.push({ path: this.$route.path + '/article-write', query: { articleId: this.item.id } })
    }
  }
}
</script>
