<template lang="pug">
  v-toolbar-title {{ title }}
    v-btn(icon @click="openDialog") <v-icon>mdi-grease-pencil</v-icon>
    v-dialog(v-model="dialog" max-width="400")
      v-card
        v-card-title 제목수정
          v-spacer
          v-btn(icon @click="save") <v-icon>mdi-content-save</v-icon>
          v-btn(icon @click="dialog = false") <v-icon>mdi-close</v-icon>
        v-card-text
          v-text-field(v-model="text" outlined label="제목" @keypress.enter="save" hide-details)
</template>

<script>
export default {
  props: ['title'],
  data () {
    return {
      dialog: false,
      text: this.title
    }
  },
  methods: {
    openDialog () {
      this.dialog = true
    },
    async save () {
      try {
        await this.$firebase.database().ref().child('site').update({
          title: this.text
        })
      } catch (e) {
        console.log(e.message)
      } finally {
        this.dialog = false
      }
    }
  }
}
</script>
