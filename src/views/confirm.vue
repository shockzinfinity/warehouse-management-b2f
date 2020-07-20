<template lang="pug">
  div
    | qr code confirm
</template>

<script>
export default {
  computed: {
    qrCode () {
      return this.$route.query.qc
    },
    type () {
      return this.qrCode.split('-')[0]
    },
    code () {
      return this.qrCode.split('-')[1]
    }
  },
  created () {
    // console.log(this.qrcode)
    this.checkCode()
  },
  data () {
    return {
      title: ''
    }
  },
  methods: {
    routeCode () {
      let rt
      if (this.title) {
        switch (this.type) {
          case 'rk':
            rt = '/rack/'
            break
          case 'bx':
            rt = '/box/'
            break
          case 'sp':
            rt = '/sample/'
            break
          default:
            break
        }
      }
      this.$router.replace(rt + this.title)
    },
    async checkCode () {
      let ref
      // TODO: regex 이용
      // bx-1364ab1e82
      switch (this.type) {
        case 'rk':
          ref = this.$firebase.firestore().collection('racks').where('rackId', '==', this.code)
          break
        case 'bx':
          ref = this.$firebase.firestore().collection('boxes').where('boxId', '==', this.code)
          break
        case 'sp':
          ref = this.$firebase.firestore().collection('samples').where('sampleId', '==', this.code)
          break
        default: // 404
          // this.exists = false
          throw Error('Not exists.')
      }

      const temp = await ref.get()

      if (!temp.empty) {
        this.title = temp.docs[0].id
        // console.log('id', temp.docs[0].id)
        // console.log('tempt', temp.docs[0].data())
        // console.log(this.title)
      }

      this.routeCode()
    }
  }
}
</script>
