<template lang="pug">
  v-container(fluid)  
    v-form
      v-card(:loading="loading")
        v-toolbar(color="accent" dense flat dark)
          v-toolbar-title 랙 정보 작성
          v-spacer
          v-btn(icon @click="$router.push('/box/' + document)") <v-icon>mdi-arrow-left</v-icon>
          v-btn(icon @click="save") <v-icon>mdi-content-save</v-icon>
        v-card-text
          v-text-field(v-model="form.parentRack" outlined label="포함되어 있는 랙")
          v-text-field(v-model="form.title" outlined label="이름")
          v-textarea(v-model="form.description" outlined label="설명")
</template>

<script>
export default {
  props: ['document', 'action'],
  data () {
    return {
      unsubscribe: null,
      form: {
        parentRack: '',
        description: '',
        title: '',
        sampleCount: 0
      },
      loading: false,
      exists: false,
      ref: null
    }
  },
  watch: {
    rack () {
      this.subscribe()
    }
  },
  created () {
    this.subscribe()
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe () {
      if (this.unsubscribe) this.unsubscribe()
      this.ref = this.$firebase.firestore().collection('boxes').doc(this.document)
      this.unsubscribe = this.ref.onSnapshot(doc => {
        this.exists = doc.exists
        if (this.exists) {
          const item = doc.data()
          this.form.parentRack = item.parentRack
          this.form.title = item.title
          this.form.description = item.description
        }
      })
    },
    async save () {
      const form = {
        parentRack: this.form.parentRack,
        title: this.form.title,
        description: this.form.description,
        updatedAt: new Date()
      }
      this.loading = true

      try {
        if (!this.exists) {
          form.createdAt = new Date()
          form.sampleCount = 0
          await this.ref.set(form)
        } else {
          this.ref.update(form)
        }
        this.$router.push('/box/' + this.document)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
