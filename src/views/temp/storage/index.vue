<template lang="pug">
  v-sheet sss
    v-textarea(v-model="text")
    v-btn(@click="read") read
    v-btn(@click="write") write
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      text: '',
      url: '',
    }
  },
  methods: {
    async write() {
      const sn = await this.$firebase
        .storage()
        .ref()
        .child('xxx.text')
        .putString('about')
      const url = await sn.ref.getDownloadURL()
      // console.log(url)
      this.url = url
    },
    async read() {
      const r = await axios.get(this.url)
      console.log(r)
      this.text = r.data
    },
  },
}
</script>
