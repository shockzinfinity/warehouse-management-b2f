<template lang="pug">
  v-container(fluid)
    v-card
      v-toolbar(color="accent" dense flat dark)
        v-toolbar-title(v-text="info.title")
        v-spacer
        template(v-if="user")
          v-btn(icon @click="write" :disabled="user.level > 0") <v-icon>mdi-pencil</v-icon>
          v-btn(icon @click="articleWrite" :disabled="user.level > 6") <v-icon>mdi-plus</v-icon>
      v-card-text(v-if="info.createdAt")
        v-alert(color="info" outlined dismissible)
          div(style="white-space: pre-line") {{ info.description }}
          .text-right.font-italic.caption 작성일: {{ info.createdAt.toDate().toLocaleString() }}
          .text-right.font-italic.caption 수정일: {{ info.updatedAt.toDate().toLocaleString() }}
          .text-right.font-italic.caption 게시물 수: {{ info.count }}
      board-article(:info="info" :document="document")
</template>

<script>
import BoardArticle from './article/index'

export default {
  components: {
    BoardArticle,
  },
  props: ['document'],
  data() {
    return {
      unsubscribe: null,
      info: {
        category: '',
        title: '',
        description: '',
        count: 0,
      },
      loading: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  watch: {
    document() {
      this.subscribe()
    },
  },
  created() {
    this.subscribe()
  },
  destroyed() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  methods: {
    subscribe() {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
      const ref = this.$firebase
        .firestore()
        .collection('boards')
        .doc(this.document)
      this.unsubscribe = ref.onSnapshot(doc => {
        if (!doc.exists) {
          return this.write()
        }
        this.info = doc.data()
      })
    },
    async write() {
      this.$router.push(this.$route.path + '/board-write')
    },
    async articleWrite() {
      this.$router.push({
        path: this.$route.path + '/article-write',
        query: { articleId: '' },
      })
    },
  },
}
</script>
