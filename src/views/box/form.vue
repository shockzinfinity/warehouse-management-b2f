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
  props: ['document', 'action'],
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
    rackId () {
      return this.$route.query.rackId
    },
    rackTitle () {
      return this.$route.query.rackTitle
    }
  },
  watch: {
    document () {
      this.subscribe()
    }
  },
  created () {
    this.subscribe()
    console.log(this.rackId)
  },
  mounted () {
    if (this.rackId) this.form.parentRackId = this.rackId
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe () {
      if (this.unsubscribe) this.unsubscribe()

      if (this.document === 'newBox') {
        this.exists = false
        return
      }

      this.ref = this.$firebase.firestore().collection('boxes').doc(this.document)
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
      if (this.document === 'newBox') {
        this.$router.push('/rack/' + this.rackTitle)
        return
      }
      this.$router.push('/box/' + this.document)
    },
    async save () {
      const form = {
        // parentRackId: this.form.parentRackId,
        title: this.form.title,
        description: this.form.description,
        updatedAt: new Date()
      }
      this.loading = true

      try {
        if (!this.exists) {
          if (this.document === 'newBox') {
            this.ref = this.$firebase.firestore().collection('boxes').doc(form.title)
          }
          form.parentRackId = this.rackId
          form.id = cryptoRandomString({ length: 10 })
          form.createdAt = new Date()
          form.sampleCount = 0
          await this.ref.set(form)
          this.$router.push('/rack/' + this.rackTitle)
        } else {
          this.ref.update(form)
          this.$router.push('/box/' + form.title)
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
