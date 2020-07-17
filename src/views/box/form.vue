<template lang="pug">
  v-container(fluid)  
    v-form
      v-card(:loading="loading")
        v-toolbar(color="accent" dense flat dark)
          v-toolbar-title 박스 정보 작성
          v-spacer
          v-btn(icon @click="goBack") <v-icon>mdi-arrow-left</v-icon>
          v-btn(icon @click="save") <v-icon>mdi-content-save</v-icon>
        v-card-text
          v-text-field(v-model="form.parentRackId" outlined label="포함되어 있는 랙")
          v-text-field(v-model="form.title" outlined label="이름")
          v-textarea(v-model="form.description" outlined label="설명")
</template>

<script>
import cryptoRandomString from 'crypto-random-string'

export default {
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
        sampleCount: 0
      },
      loading: false,
      exists: false,
      ref: null
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
      this.unsubscribe = this.ref.onSnapshot(doc => {
        this.exists = doc.exists
        if (this.exists) {
          const item = doc.data()
          this.form.parentRackId = item.parentRackId
          this.form.title = item.title
          this.form.description = item.description
        }
      })
    },
    goBack () {
      this.$router.push('/box/' + this.document)
    },
    async save () {
      const form = {
        parentRackId: this.form.parentRackId,
        title: this.form.title,
        description: this.form.description,
        updatedAt: new Date()
      }
      this.loading = true

      try {
        if (!this.form.parentRackId) return
        const batch = await this.$firebase.firestore().batch()
        let parentRackTitle
        await this.$firebase
          .firestore()
          .collection('racks')
          .where('rackId', '==', this.form.parentRackId)
          .get()
          .then(docs => {
            if (!docs.empty) {
              docs.forEach(d => {
                // console.log(d.id, '=>', d.data())
                parentRackTitle = d.id
              })
            }
          })

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
            email: this.user.email,
            photoURL: this.user.photoURL,
            displayName: this.user.displayName
          }
          batch.set(this.ref, form)
          batch.update(
            this.$firebase
              .firestore()
              .collection('racks')
              .doc(parentRackTitle),
            { boxCount: this.$firebase.firestore.FieldValue.increment(1) }
          )
        } else {
          // this.ref.update(form)
          batch.update(this.ref, form)
        }
        await batch.commit()
      } finally {
        this.loading = false
        this.goBack()
      }
    }
  }
}
</script>
