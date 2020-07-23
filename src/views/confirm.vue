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
      title: '',
      sampleId: ''
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
      if (this.type !== 'sp') {
        this.$router.replace(rt + this.title)
      } else {
        this.$router.replace({ path: '/box/' + this.title, query: { sampleId: this.sampleId } })
      }
    },
    async checkCode () {
      let ref
      let tempRef
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
          var boxId = this.code.substr(0, 10)
          console.log(boxId)
          this.sampleId = this.code.substr(10, this.code.length - 10)
          tempRef = this.$firebase.firestore().collection('boxes').where('boxId', '==', boxId)
          var box = await tempRef.get()
          if (!box.empty) {
            this.title = box.docs[0].id
            // console.log(boxTitle)
            console.log(this.sampleId)
            ref = this.$firebase.firestore().collection('boxes').doc(this.title).collection('samples').doc(this.sampleId)
          }
          break
        default: // 404
          // this.exists = false
          throw Error('Not exists.')
      }

      if (this.type === 'sp') {
        const temp = await ref.get()
        if (temp.exists) {
          this.sampleId = temp.id
        }
        this.routeCode()
      } else {
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
}
</script>
