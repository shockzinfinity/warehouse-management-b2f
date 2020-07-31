<template lang="pug">
  v-container(fluid)
    v-card
      v-toolbar(color="accent" dense flat dark)
        v-toolbar-title(v-text="rackInfo.title")
        v-spacer
        template(v-if="user")
          v-btn(icon @click="rackWrite" :disabled="user.level > 0") <v-icon>mdi-pencil</v-icon>
          v-btn(icon @click="openDialog" :disabled="user.level > 0") <v-icon>mdi-shape-plus</v-icon>
      v-card-text(v-if="rackInfo.createdAt")
        v-layout
          v-flex
            v-row.no-gutters
              v-col.pb-2(lg="6" cols="sm")
                v-img.mx-auto(:src="rackInfo.coverUrl" max-width="200px")
              v-col.pb-2(lg="6" cols="sm")
                v-img.mx-auto(:src="rackInfo.qrcodeUrl" max-width="200px")
            v-row
              v-col
                v-card-subtitle {{ rackInfo.description }}
                  .text-right.font-italic.caption 정보 작성일: {{ rackInfo.createdAt.toDate().toLocaleString() }}
                  .text-right.font-italic.caption 정보 수정일: {{ rackInfo.updatedAt.toDate().toLocaleString() }}
                  .text-right.font-italic.caption 박스 수: {{ rackInfo.boxCount }}
      box-list(ref="boxList" :info="rackInfo" :document="document")
    v-dialog(v-model="dialog")
      v-card(:loading="loading")
        validation-observer(ref="obs" v-slot="{ invalid, validated, passes, validate }")
          v-form
            v-toolbar(color="accent" dense flat dark)
              v-toolbar-title 박스 추가
              v-spacer
              v-btn(icon @click="boxSaveDialog") <v-icon>mdi-content-save</v-icon>
              v-btn(icon @click="dialog = false") <v-icon>mdi-close</v-icon>
            cover-upload(ref="cover" type="box" @downloadURL="getDownloadURL" :positionId="boxToAdd.boxId")
            v-card-text
              //- v-text-field(v-model="rackInfo.rackId" outlined label="포함되어 있는 랙")
              .display-1 포함되어 있는 랙 : 
                v-chip.ma-4(large color="accent") {{ rackInfo.title }} ( {{ rackInfo.rackId }} )
              v-text-field-with-validation(v-model="boxToAdd.title" rules="required|max:50" :counter="50" outlined label="이름")
              v-textarea(v-model="boxToAdd.description" outlined label="설명")
</template>

<script>
import BoxList from '@/components/BoxList'
import cryptoRandomString from 'crypto-random-string'
import CoverUpload from '@/components/CoverUpload'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation'
import VSelectWithValidation from '@/components/inputs/VSelectWithValidation'
import QRCode from 'qrcode'

export default {
  components: {
    BoxList,
    ValidationObserver,
    ValidationProvider,
    VTextFieldWithValidation,
    VSelectWithValidation,
    CoverUpload,
    QRCode,
  },
  props: ['document'],
  data() {
    return {
      unsubscribe: null,
      rackCollection: null,
      rackInfo: {
        rackId: '',
        position: '',
        description: '',
        title: '',
        boxCount: 0,
      },
      loading: false,
      dialog: false,
      boxToAdd: {
        title: '',
        description: '',
        parentRackId: '',
      },
      comboModel: 'rack-1', // 초기 모델인듯
      rackItems: [],
      search: null,
      storageRef: null,
      boxCoverUrl: '',
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  watch: {
    document() {
      this.subscribe()
    },
  },
  created() {
    this.subscribe()
    // console.log(this.$route.params.collection)
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
    if (this.rackCollection) {
      this.rackCollection()
    }
  },
  methods: {
    subscribe() {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
      const ref = this.$firebase
        .firestore()
        .collection('racks')
        .doc(this.document)
      this.storageRef = this.$firebase
        .storage()
        .ref()
        .child('boxes')
      this.unsubscribe = ref.onSnapshot(doc => {
        if (!doc.exists) {
          return this.rackWrite()
        }
        this.rackInfo = doc.data()
        // console.log(this.rackInfo)
      })

      this.rackCollection = this.$firebase
        .firestore()
        .collection('racks')
        .onSnapshot(sn => {
          if (sn.empty) {
            this.rackItems = []
            return
          }
          this.rackItems = sn.docs.map(doc => {
            const item = doc.data()
            return item.title
          })
        })
    },
    async rackWrite() {
      this.$router.push({ path: this.$route.path + '/rack-write' })
    },
    openDialog() {
      this.dialog = true
      // console.log('before', this.boxToAdd.boxId)
      this.boxToAdd.boxId = cryptoRandomString({ length: 10 })
      // console.log('after', this.boxToAdd.boxId)
    },
    async boxSaveDialog() {
      this.loading = true
      const validation = await this.$refs.obs.validate()
      if (!validation) {
        this.loading = false
        this.boxToAdd.boxId = ''
        this.dialog = false
        this.boxToAdd = {}
        return
      }

      const box = { ...this.boxToAdd }
      box.updatedAt = new Date()
      box.createdAt = new Date()
      box.user = this.user
      box.parentRackId = this.rackInfo.rackId
      box.sampleCount = 0
      box.coverUrl = this.boxCoverUrl

      const boxRef = this.$firebase
        .firestore()
        .collection('boxes')
        .doc(this.boxToAdd.title)
      // const rackRef = this.$firebase.firestore().collection('racks').doc(this.document)
      // const batch = await this.$firebase.firestore().batch()

      try {
        if (!this.boxToAdd.qrcodeUrl) {
          const qr = await this.codeGenration(box.boxId)
          const qrSn = await this.storageRef
            .child('qrCodes')
            .child(this.boxToAdd.boxId)
            .child(box.title + '.qr.png')
            .putString(qr, 'data_url')
          box.qrcodeUrl = await qrSn.ref.getDownloadURL()
        }
        boxRef.set(box)
        // batch.set(boxRef, box)
        // batch.update(rackRef, { boxCount: this.$firebase.firestore.FieldValue.increment(1) })
        // await batch.commit()
      } finally {
        this.dialog = false
        this.loading = false
        this.boxToAdd = {}
        this.$refs.boxList.subscribe(0)
      }
    },
    getDownloadURL(url) {
      this.boxCoverUrl = url
    },
    async codeGenration(boxId) {
      const qrCodeAddress =
        'https://warehouse-management-b2f.firebaseapp.com/confirm?qc=bx-' +
        boxId
      return await QRCode.toDataURL(qrCodeAddress)
    },
  },
}
</script>
