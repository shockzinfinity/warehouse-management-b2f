<template lang="pug">
  div
    vue-qrcode(value="https://naver.com" ref="qr")
    v-btn(@click="save") save
</template>

<script>
import VueQrcode from 'vue-qrcode'

export default {
  components: {
    VueQrcode
  },
  methods: {
    async save () {
      const qr = this.$refs.qr.dataUrl
      const sn = await this.$firebase.storage().ref().child('qrcode').child('temp.png').putString(qr, 'data_url')
      console.log('url', await sn.ref.getDownloadURL())
    }
  }
}
</script>
