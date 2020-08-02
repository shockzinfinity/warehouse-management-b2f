<template lang="pug">
  v-container(fluid :class="$vuetify.breakpoint.xs ? 'pa-0' : ''")
    v-card(outlined :tile="$vuetify.breakpoint.xs" v-if="board")
      v-toolbar(color="transparent" dense flat)
        v-chip.mr-4(color="primary" label) {{ board.category }}
        v-toolbar-title(v-text="board.title")
        v-spacer
        v-btn(icon @click="dialog = true") <v-icon>mdi-information-outline</v-icon>
        template(v-if="user")
          v-btn(icon @click="articleWrite" :disabled="user.level > 4") <v-icon>mdi-plus</v-icon>
      v-divider
      board-article(:boardId="boardId" :board="board")
      v-dialog(v-model="dialog" max-width="500")
        v-card
          v-toolbar(color="transparent" dense flat)
            v-toolbar-title 게시판 정보
            v-spacer
            v-btn(icon @click="write" :disabled="user.level > 0") <v-icon>mdi-pencil</v-icon>
            v-btn(icon @click="dialog = false") <v-icon>mdi-close</v-icon>
          v-divider
          v-list-item
            v-list-item-content
              v-list-item-title 작성자
              v-list-item-subtitle
                display-user(:user="board.user")
          v-list-item
            v-list-item-content
              v-list-item-title 작성일
              v-list-item-subtitle.font-italic
                display-time(:time="board.createdAt")
          v-list-item
            v-list-item-content
              v-list-item-title 수정일
              v-list-item-subtitle.font-italic
                display-time(:time="board.updatedAt")
          v-list-item
            v-list-item-content
              v-list-item-title 게시물 수
              v-list-item-subtitle.font-italic {{ board.count }}
          v-list-item
            v-list-item-content
              v-list-item-title 등록된 종류
              v-list-item-subtitle
                v-chip.mt-2.mr-2(color="info" label small v-for="item in board.categories" :key="item" v-text="item")
          v-list-item
            v-list-item-content
              v-list-item-title 등록된 태그
              v-list-item-subtitle.comment
                v-chip.mt-2.mr-2(color="info" outlined label small v-for="item in board.tags" :key="item" v-text="item")
          v-list-item
            v-list-item-content
              v-list-item-title 설명
              v-list-item-subtitle.comment(v-text="board.description")
          v-divider
          v-card-actions
            v-spacer
            v-btn(text @click="dialog = false") <v-icon left>mdi-close</v-icon>닫기
    v-skeleton-loader(type="card" v-else)
</template>

<script>
import BoardArticle from '@/components/board/article/index'
import DisplayTime from '@/components/display-time'
import DisplayUser from '@/components/display-user'

export default {
  components: {
    BoardArticle,
    DisplayTime,
    DisplayUser,
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
      dialog: false,
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
          const item = doc.data()
          item.createdAt = item.createdAt.toDate()
          item.updatedAt = item.updatedAt.toDate()
          this.board = item
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

<style lang="sass" scoped>
.comment
  white-space: pre-wrap
</style>
