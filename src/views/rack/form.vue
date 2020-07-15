<template lang="pug">
  v-container(fluid)  
    v-form
      v-card(:loading="loading")
        v-toolbar(color="accent" dense flat dark)
          v-toolbar-title 랙 정보 작성
          v-spacer
          v-btn(icon @click="$router.push('/rack/' + document)") <v-icon>mdi-arrow-left</v-icon>
          v-btn(icon @click="save") <v-icon>mdi-content-save</v-icon>
        v-card-text
          v-text-field(v-model="form.position" outlined label="위치")
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
        position: '',
        description: '',
        title: ''
      },
      loading: false,
      exists: false,
      ref: null
    }
  },
  watch: {
    document () {
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
      this.ref = this.$firebase.firestore().collection('racks').doc(this.document)
      this.unsubscribe = this.ref.onSnapshot(doc => {
        this.exists = doc.exists
        if (this.exists) {
          const item = doc.data()
          this.form.position = item.position
          this.form.title = item.title
          this.form.description = item.description
        }
      })
    },
    async save () {
      const form = {
        position: this.form.position,
        title: this.form.title,
        description: this.form.description,
        updatedAt: new Date()
      }
      this.loading = true

      try {
        if (!this.exists) {
          form.createdAt = new Date()
          form.boxCount = 0
          await this.ref.set(form)
        } else {
          this.ref.update(form)
        }
        this.$router.push('/rack/' + this.document)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
