<template lang="pug">
  v-container(fluid)
    v-card
      v-toolbar(color="accent" dense flat dark)
        v-toolbar-title(v-text="boxInfo.title")
        v-spacer
        template(v-if="user")
          v-btn(icon @click="boxWrite" :disabled="user.level > 0") <v-icon>mdi-pencil</v-icon>
          v-btn(icon @click="sampleWrite" :disabled="user.level > 4") <v-icon>mdi-plus</v-icon>
      v-card-text(v-if="boxInfo.createdAt")
        v-alert(color="info" outlined dismissible)
          div(style="white-space: pre-line") {{ boxInfo.description }}
          .text-right.font-italic.caption 정보 작성일: {{ boxInfo.createdAt.toDate().toLocaleString() }}
          .text-right.font-italic.caption 정보 수정일: {{ boxInfo.updatedAt.toDate().toLocaleString() }}
          .text-right.font-italic.caption 포함 샘플 수: {{ boxInfo.sampleCount }}
      box-sample(:info="boxInfo" :document="document")
</template>

<script>
import BoxSample from './sample/index'

export default {
  components: {
    BoxSample
  },
  props: ['document'],
  data () {
    return {
      unsubscribe: null,
      boxInfo: {
        parentRackId: '',
        description: '',
        title: '',
        sampleCount: 0
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
      const ref = this.$firebase.firestore().collection('boxes').doc(this.document)
      this.unsubscribe = ref.onSnapshot(doc => {
        if (!doc.exists) return this.boxWrite()
        this.boxInfo = doc.data()
        this.boxInfo.id = doc.id
      })
    },
    async boxWrite () {
      this.$router.push({ path: this.$route.path + '/box-write' })
    },
    async sampleWrite () {
      this.$router.push({ path: this.$route.path + '/sample-write', query: { sampleId: '' } })
    }
  }
}
</script>
