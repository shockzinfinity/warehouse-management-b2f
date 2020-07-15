<template lang="pug">
  v-container(fluid)
    v-card
      v-toolbar(color="accent" dense flat dark)
        v-toolbar-title(v-text="rackInfo.title")
        v-spacer
        template(v-if="user")
          v-btn(icon @click="rackWrite" :disabled="user.level > 0") <v-icon>mdi-pencil</v-icon>
      v-card-text(v-if="rackInfo.createdAt")
        v-alert(color="info" outlined dismissible)
          div(style="white-space: pre-line") {{ rackInfo.description }}
          .text-right.font-italic.caption 정보 작성일: {{ rackInfo.createdAt.toDate().toLocaleString() }}
          .text-right.font-italic.caption 정보 수정일: {{ rackInfo.updatedAt.toDate().toLocaleString() }}
          .text-right.font-italic.caption 박스 수: {{ rackInfo.boxCount }}
      v-card-text Box list
</template>

<script>
export default {
  props: ['document'],
  data () {
    return {
      unsubscribe: null,
      rackInfo: {
        position: '',
        description: '',
        title: '',
        boxCount: 0
      },
      loading: false
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
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe () {
      if (this.unsubscribe) this.unsubscribe()
      const ref = this.$firebase.firestore().collection('racks').doc(this.document)
      this.unsubscribe = ref.onSnapshot(doc => {
        if (!doc.exists) return this.rackWrite()
        this.rackInfo = doc.data()
      })
    },
    async rackWrite () {
      this.$router.push({ path: this.$route.path + '/rack-write' })
    }
  }
}
</script>
