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
        v-alert(color="info" outlined dismissible)
          div(style="white-space: pre-line") {{ rackInfo.description }}
          .text-right.font-italic.caption 정보 작성일: {{ rackInfo.createdAt.toDate().toLocaleString() }}
          .text-right.font-italic.caption 정보 수정일: {{ rackInfo.updatedAt.toDate().toLocaleString() }}
          .text-right.font-italic.caption 박스 수: {{ rackInfo.boxCount }}
      box-list(:info="rackInfo" :document="document")
    v-dialog(v-model="dialog")
      v-card(:loading="loading")
        v-form
          v-toolbar(color="accent" dense flat dark)
            v-toolbar-title 박스 추가
            v-spacer
            v-btn(icon @click="boxSaveDialog") <v-icon>mdi-content-save</v-icon>
            v-btn(icon @click="dialog = false") <v-icon>mdi-close</v-icon>
          v-card-text
            //- v-text-field(v-model="rackInfo.rackId" outlined label="포함되어 있는 랙")
            .display-1 포함되어 있는 랙 : 
              v-chip.ma-4(large color="accent") {{ rackInfo.title }} ( {{ rackInfo.rackId }} )
            v-text-field(v-model="boxToAdd.title" outlined label="이름")
            v-textarea(v-model="boxToAdd.description" outlined label="설명")
</template>

<script>
import BoxList from '@/components/box-list'
import cryptoRandomString from 'crypto-random-string'

export default {
  components: {
    BoxList
  },
  props: ['document'],
  data () {
    return {
      unsubscribe: null,
      rackCollection: null,
      rackInfo: {
        rackId: '',
        position: '',
        description: '',
        title: '',
        boxCount: 0
      },
      loading: false,
      dialog: false,
      boxToAdd: {
        title: '',
        description: '',
        parentRackId: ''
      },
      comboModel: 'rack-1', // 초기 모델인듯
      rackItems: [],
      search: null
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
    // console.log(this.$route.params.collection)
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
    if (this.rackCollection) this.rackCollection()
  },
  methods: {
    subscribe () {
      if (this.unsubscribe) this.unsubscribe()
      const ref = this.$firebase.firestore().collection('racks').doc(this.document)
      this.unsubscribe = ref.onSnapshot(doc => {
        if (!doc.exists) return this.rackWrite()
        this.rackInfo = doc.data()
        // console.log(this.rackInfo)
      })

      this.rackCollection = this.$firebase.firestore().collection('racks').onSnapshot(sn => {
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
    async rackWrite () {
      this.$router.push({ path: this.$route.path + '/rack-write' })
    },
    openDialog () {
      this.dialog = true
    },
    async boxSaveDialog () {
      this.loading = true
      const box = { ...this.boxToAdd }
      box.updatedAt = new Date()
      box.createdAt = new Date()
      box.user = this.user
      box.boxId = cryptoRandomString({ length: 10 })
      box.parentRackId = this.rackInfo.rackId

      const boxRef = this.$firebase.firestore().collection('boxes').doc(this.boxToAdd.title)
      const rackRef = this.$firebase.firestore().collection('racks').doc(this.document)
      const batch = await this.$firebase.firestore().batch()

      try {
        batch.set(boxRef, box)
        batch.update(rackRef, { boxCount: this.$firebase.firestore.FieldValue.increment(1) })
        await batch.commit()
      } finally {
        this.dialog = false
        this.loading = false
        this.boxToAdd = {}
      }
    }
  }
}
</script>
