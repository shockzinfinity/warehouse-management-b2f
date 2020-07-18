<template lang="pug">
  div
    qrcode(
      :value="testVal"
      ref="qr"
      :type="'image/png'"
      :errorCorrectionLevel="'M'"
      :margin="1"
      :scale="4")
    v-btn(@click="save") save
    v-btn(@click="goRoute") routing
    v-btn(@click="generate") generate
</template>

<script>
export default {
  data () {
    return {
      prefix: 'bx',
      qrValue: 'f360a13660',
      testVal: 'https://warehouse-management-b2f.firebaseapp.com/confirm?qc=bx-f360a13660'
    }
  },
  methods: {
    async save () {
      const qr = this.$refs.qr.dataUrl
      const sn = await this.$firebase.storage().ref().child('qrcode').child('temp.png').putString(qr, 'data_url')
      console.log('url', await sn.ref.getDownloadURL())
    },
    codeGeneration () {
      return 'https://warehouse-management-b2f.firebaseapp.com/confirm?qc=' + this.prefix + '-' + this.qrValue
    },
    async goRoute () {
      // this.$router.push(this.prefix + this.qrValue)
      // console.log(this.$route)
      // console.log(`${window.location.origin}/confirm/${this.prefix}-${this.qrValue}`)
      // const path = `${window.location.origin}/confirm/${this.prefix}-${this.qrValue}`
      this.$router.push({ path: '/confirm', query: { qc: this.prefix + '-' + this.qrValue } })
    },
    async generate () {
      this.$refs.qr.toDataURL('temp')
        .then(url => {
          console.log(url)
        })
    }
  }
}
</script>
