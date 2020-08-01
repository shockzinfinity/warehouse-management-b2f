<template lang="pug">
  v-container(fluid)
    v-card
      v-toolbar(color="accent" dense flat dark)
        v-toolbar-title(v-text="board.title")
        v-spacer
        template(v-if="user")
          v-btn(icon @click="write" :disabled="user.level > 0") <v-icon>mdi-pencil</v-icon>
          v-btn(icon @click="articleWrite" :disabled="user.level > 4") <v-icon>mdi-plus</v-icon>
      v-card-text(v-if="board.createdAt")
        v-alert(color="info" outlined dismissible)
          div(style="white-space: pre-line") {{ board.description }}
          .text-right.font-italic.caption 작성일: {{ board.createdAt.toDate().toLocaleString() }}
          .text-right.font-italic.caption 수정일: {{ board.updatedAt.toDate().toLocaleString() }}
      board-article(:boardId="boardId" :board="board")
</template>

<script>
import BoardArticle from '@/components/board/article/index'

export default {
  components: {
    BoardArticle,
  },
  props: ['boardId'],
  data() {
    return {
      unsubscribe: null,
      board: {
        category: '',
        title: '',
        description: '',
      },
      loading: false,
    }
  },
  watch: {
    boardId() {
      this.subscribe()
    },
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  created() {
    this.subscribe()
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe() {
      if (this.unsubscribe) this.unsubscribe()
      const ref = this.$firebase
        .firestore()
        .collection('boards')
        .doc(this.boardId)
      this.unsubscribe = ref.onSnapshot(
        doc => {
          if (!doc.exists) {
            return this.write()
          }
          this.board = doc.data()
        },
        e => {
          throw Error(e.message)
        }
      )
    },
    async write() {
      this.$router.replace({
        path: this.$route.path,
        query: { action: 'write' },
      })
    },
    async articleWrite() {
      this.$router.replace({
        path: this.$route.path + '/new',
        query: { action: 'write' },
      })
    },
  },
}
</script>
