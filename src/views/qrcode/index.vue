<template lang="pug">
  div
    qrcode(
      :value="qrValue"
      ref="qr"
      :type="'image/png'"
      :errorCorrectionLevel="'M'"
      :margin="1"
      :scale="4")
    v-btn(@click="save") save
</template>

<script>
export default {
  data () {
    return {
      qrValue: 'https://naver.com'
    }
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
