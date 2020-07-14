<template lang="pug">
  v-container(fluid)
    v-card
      v-toolbar(color="accent" dense flat dark)
        v-toolbar-title(v-text="info.title")
        v-spacer
        v-btn(icon @click="write") <v-icon>mdi-pencil</v-icon>
      v-card-text(v-if="info.createdAt")
        v-alert(color="info" outlined dismissible)
          div(style="white-space: pre-line") {{ info.description }}
          .text-right.font-italic.caption 작성일: {{ info.createdAt.toDate().toLocaleString() }}
          .text-right.font-italic.caption 수정일: {{ info.updatedAt.toDate().toLocaleString() }}
      v-card-text articles
</template>

<script>
export default {
  props: ['document'],
  data () {
    return {
      unsubscribe: null,
      info: {
        category: '',
        title: '',
        description: ''
      },
      loading: false
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
      const ref = this.$firebase.firestore().collection('boards').doc(this.document)
      this.unsubscribe = ref.onSnapshot(doc => {
        if (!doc.exists) return this.write()
        this.info = doc.data()
      })
    },
    async write () {
      this.$router.push(this.$route.path + '/write')
    }
  }
}
</script>
