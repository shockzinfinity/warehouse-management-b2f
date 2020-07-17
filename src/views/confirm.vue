<template lang="pug">
  div
    | qr code confirm
</template>

<script>
import ErrorPage from './404'

export default {
  components: {
    ErrorPage
  },
  computed: {
    qrCode () {
      return this.$route.query.qc
    }
  },
  created () {
    // TODO: 인증, code === null 체크
    // console.log(this.qrcode)
    this.checkCode()
  },
  data () {
    return {
      // qrCode: '',
      // type: '' // rk => 랙, bx => 박스, sp => 샘플
      type: '',
      title: ''
    }
  },
  methods: {
    routeCode () {
      // TODO: type, code 체크 후 라우팅
      this.$router.push(this.type + '/' + this.title)
    },
    async checkCode () {
      //     await this.$firebase
      // .firestore()
      // .collection('racks')
      // .where('rackId', '==', this.form.parentRackId)
      // .get()
      // .then(docs => {
      //   if (!docs.empty) {
      //     docs.forEach(d => {
      //       // console.log(d.id, '=>', d.data())
      //       parentRackTitle = d.id
      //     })
      //   }
      // })
      let ref
      // TODO: regex 이용
      // bx-1364ab1e82
      const type = 'bx'
      const code = '1364ab1e82'
      switch (type) {
        case 'rk':
          this.type = 'rack'
          ref = this.$firebase.firestore().collection('racks').where('rackId', '==', code)
          break
        case 'bx':
          this.type = 'box'
          ref = this.$firebase.firestore().collection('boxes').where('boxId', '==', code)
          break
        case 'sp':
          this.type = 'sample'
          ref = this.$firebase.firestore().collection('samples').where('sampleId', '==', code)
          break
        default: // 404
          // this.exists = false
          throw Error('Not exists.')
      }

      await ref.get().then(docs => {
        if (!docs.empty) {
          docs.forEach(d => {
            // console.log(d.id)
            // console.log(d.data())
            this.title = d.id
          })
        }
      })
      this.routeCode()
    }
  }
}
</script>
