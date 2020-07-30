<template lang="pug">
  v-container(fluid)
    v-layout(align-center justify-center)
    validation-observer(ref="obs" v-slot="{ invalid, validated, passes, validate }")
      v-form
        v-card.elevation-12(:loading="loading")
          v-toolbar(color="accent" dense flat dark)
            v-toolbar-title 박스 정보 작성
            v-spacer
            v-btn(icon @click="goBack") <v-icon>mdi-arrow-left</v-icon>
            v-btn(icon @click="save") <v-icon>mdi-content-save</v-icon>
          v-row
            v-col(cols="12")
              cover-upload(ref="cover" type="rack" @downloadURL="getDownloadURL" :currentSrc="form.coverUrl" :positionId="form.boxId")
          v-card-text
            .display-1 포함되어 있는 랙 : 
              v-chip.ma-4(large color="accent") {{ form.parentRackId }} ( {{ form.parentRackId }} )
            v-text-field-with-validation(v-model="form.title" rules="required|max:50" :counter="50" outlined label="이름")
            v-textarea(v-model="form.description" outlined label="설명")
</template>

<script>
import cryptoRandomString from 'crypto-random-string'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation'
import VSelectWithValidation from '@/components/inputs/VSelectWithValidation'
import QRCode from 'qrcode'
import CoverUpload from '@/components/CoverUpload'

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    VTextFieldWithValidation,
    VSelectWithValidation,
    QRCode,
    CoverUpload
  },
  props: {
    document: String,
    action: String
  },
  data () {
    return {
      unsubscribe: null,
      form: {
        parentRackId: '',
        description: '',
        title: '',
        sampleCount: 0,
        coverUrl: ''
      },
      loading: false,
      exists: false,
      ref: null,
      boxCoverUrl: '',
      storageRef: null
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  watch: {
    document () {
      this.subscribe()
    }
  },
  created () {
    this.subscribe()
    // console.log(this.parentRackId)
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe () {
      if (this.unsubscribe) this.unsubscribe()

      this.ref = this.$firebase
        .firestore()
        .collection('boxes')
        .doc(this.document)
      this.storageRef = this.$firebase.storage().ref().child('boxes').child(this.document)
      this.unsubscribe = this.ref.onSnapshot(doc => {
        this.exists = doc.exists
        if (this.exists) {
          const item = doc.data()
          this.form.boxId = item.boxId
          this.form.parentRackId = item.parentRackId
          this.form.title = item.title
          this.form.description = item.description
          this.form.coverUrl = item.coverUrl
          this.form.qrcodeUrl = item.qrcodeUrl
        }
      })
    },
    goBack () {
      this.$router.push('/box/' + this.document)
    },
    async save () {
      if (!this.$store.state.fireUser) throw Error('로그인이 필요합니다.')
      const form = {
        parentRackId: this.form.parentRackId,
        boxId: this.form.boxId,
        title: this.form.title,
        description: this.form.description,
        updatedAt: new Date(),
        coverUrl: this.form.coverUrl !== this.boxCoverUrl && this.boxCoverUrl ? this.boxCoverUrl : this.form.coverUrl,
        qrcodeUrl: this.form.qrcodeUrl
      }
      this.loading = true

      try {
        if (!this.form.parentRackId) return
        // const batch = await this.$firebase.firestore().batch()
        // let parentRackTitle
        // await this.$firebase
        //   .firestore()
        //   .collection('racks')
        //   .where('rackId', '==', this.form.parentRackId)
        //   .get()
        //   .then(docs => {
        //     if (!docs.empty) {
        //       docs.forEach(d => {
        //         // console.log(d.id, '=>', d.data())
        //         parentRackTitle = d.id
        //       })
        //     }
        //   })

        if (!this.exists) {
          // if (this.document === 'newBox') {
          this.ref = this.$firebase
            .firestore()
            .collection('boxes')
            .doc(form.title)
          // }

          form.boxId = cryptoRandomString({ length: 10 })
          form.createdAt = new Date()
          form.sampleCount = 0
          form.user = {
            uid: this.$store.state.fireUser.uid,
            email: this.user.email,
            photoURL: this.user.photoURL,
            displayName: this.user.displayName
          }

          if (!form.qrcodeUrl) {
            const qr = await this.codeGenration(form.boxId)
            const qrSn = await this.storageRef.child(this.document + '.qr.png').putString(qr, 'data_url')
            form.qrcodeUrl = await qrSn.ref.getDownloadURL()
          }

          this.ref.set(form)
          // batch.set(this.ref, form)
          // batch.update(
          //   this.$firebase
          //     .firestore()
          //     .collection('racks')
          //     .doc(parentRackTitle),
          //   { boxCount: this.$firebase.firestore.FieldValue.increment(1) }
          // )
        } else {
          if (!form.qrcodeUrl) {
            const qr = await this.codeGenration(form.boxId)
            const qrSn = await this.storageRef.child(this.document + '.qr.png').putString(qr, 'data_url')
            form.qrcodeUrl = await qrSn.ref.getDownloadURL()
          }

          this.ref.update(form)
          // batch.update(this.ref, form)
        }
        // await batch.commit()
      } finally {
        this.loading = false
        this.goBack()
      }
    },
    getDownloadURL (url) {
      this.boxCoverUrl = url
    },
    async codeGenration (boxId) {
      const qrCodeAddress = 'https://warehouse-management-b2f.firebaseapp.com/confirm?qc=bx-' + boxId
      return await QRCode.toDataURL(qrCodeAddress)
    }
  }
}
</script>

<style lang="sass" scoped>
.progress-bar
  margin: 10px 0

input[type="file"]
  position: absolute
  clip: rect(0,0,0,0)
</style>
