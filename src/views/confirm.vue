<template lang="pug">
  div
    span redirecting to {{ qrCode }} ...
</template>

<script>
export default {
  data() {
    return {
      routeType: '',
      routePathId: '',
    }
  },
  computed: {
    qrCode() {
      return this.$route.query.qc
    },
    type() {
      return this.qrCode.split('-')[0]
    },
    code() {
      return this.qrCode.split('-')[1]
    },
  },
  created() {},
  mounted() {
    this.goToItem()
  },
  methods: {
    async parseType() {
      // type check
      switch (this.type) {
        case 'rk':
          this.routeType = '/rack/'
          break
        case 'bx':
          this.routeType = '/box/'
          break
        case 'sp':
          this.routeType = '/sample/'
          break
        default:
          throw Error('unknown type')
      }
    },
    async goToItem() {
      this.parseType()

      let ref
      let tempRef
      let box
      let boxId
      switch (this.type) {
        case 'rk':
          ref = this.$firebase
            .firestore()
            .collection('racks')
            .where('rackId', '==', this.code)
          break
        case 'bx':
          ref = this.$firebase
            .firestore()
            .collection('boxes')
            .where('boxId', '==', this.code)
          break
        case 'sp':
          var boxCode = this.code.substr(0, 10)
          var sampleCode = this.code.substr(10, this.code.length - 10)

          tempRef = this.$firebase
            .firestore()
            .collection('boxes')
            .where('boxId', '==', boxCode)
          box = await tempRef.get()
          if (!box.empty) {
            boxId = box.docs[0].id
            ref = this.$firebase
              .firestore()
              .collection('boxes')
              .doc(boxId)
              .collection('samples')
              .doc(sampleCode)
          }
          break
        default:
          this.$router.replace('/404')
      }

      if (this.type === 'sp') {
        const temp = await ref.get()
        if (temp.exists) {
          const samplePathId = temp.id
          // sample
          this.$router.replace({
            path: `/box/${boxId}/${samplePathId}`,
          })
        }
      } else {
        const temp = await ref.get()
        if (!temp.empty) {
          // rack, box
          this.$router.replace({
            path: this.routeType + temp.docs[0].id,
          })
        }
      }
    },
  },
}
</script>
