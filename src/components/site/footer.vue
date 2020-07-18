<template lang="pug">
  v-footer(app color="primary" dark absolute :footer="footer")
    v-spacer
    div &copy; {{ new Date().getFullYear() + ' ' + footer }}
    template(v-if="user")
      v-btn(icon @click="openDialog" :disabled="user.level > 0") <v-icon>mdi-grease-pencil</v-icon>
    v-dialog(v-model="dialog" max-width="400")
      v-card
        v-card-title 푸터수정
          v-spacer
          v-btn(icon @click="save") <v-icon>mdi-content-save</v-icon>
          v-btn(icon @click="dialog = false") <v-icon>mdi-close</v-icon>
        v-card-text
          v-text-field(v-model="text" outlined label="푸터" @keypress.enter="save" hide-details)
</template>

<script>
export default {
  props: ['footer'],
  data () {
    return {
      dialog: false,
      text: ''
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    openDialog () {
      this.dialog = true
      this.text = this.footer
    },
    async save () {
      try {
        await this.$firebase.database().ref().child('site').update({
          footer: this.text
        })
      } finally {
        this.dialog = false
      }
    }
  }
}
</script>
