<template lang="pug">
  v-container(fluid :class="$vuetify.breakpoint.xs ? 'pa-0' : ''")
    v-card(outlined :tile="$vuetify.breakpoint.xs" v-if="box")
      v-toolbar(color="transparent" dense flat)
        v-toolbar-title
          v-chip.mr-4(color="info" outlined label) 포함랙: {{ box.parentRackName }}
        | {{ box.title }}
        v-spacer
        v-btn(text @click="like") <v-icon :color="liked ? 'success' : ''">mdi-thumb-up</v-icon> <span>{{ box.likeCount }}</span>
        v-btn(icon @click="dialog = true") <v-icon>mdi-information-outline</v-icon>
        template(v-if="user")
          v-btn(icon @click="sampleWrite" :disabled="user.level > 4") <v-icon>mdi-plus</v-icon>
      v-divider
      box-sample(:boxId="boxId" :box="box")
      v-dialog(v-model="dialog" max-width="500")
        v-card
          v-toolbar(color="transparent" dense flat)
            v-toolbar-title 박스 정보
            v-spacer
            v-btn(icon @click="write" :disabled="user.level > 0") <v-icon>mdi-pencil</v-icon>
            v-btn(icon @click="dialog = false") <v-icon>mdi-close</v-icon>
          v-divider
          v-list-item
            v-list-item-content
              v-list-item-title 등록자
              v-list-item-subtitle
                display-user(:user="box.user")
          v-list-item
            v-list-item-content
              v-list-item-title 작성일
              v-list-item-subtitle.font-italic
                display-time(:time="box.createdAt")
          v-list-item
            v-list-item-content
              v-list-item-title 수정일
              v-list-item-subtitle.font-italic
                display-time(:time="box.updatedAt")
          v-list-item
            v-list-item-content
              v-list-item-title 포함 샘플 수
              v-list-item-subtitle.font-italic {{ box.sampleCount }}
          v-list-item
            v-list-item-content
              v-list-item-title 등록된 종류
              v-list-item-subtitle
                v-chip.mt-2.mr-2(color="info" label small v-for="item in box.categories" :key="item" v-text="item")
          v-list-item
            v-list-item-content
              v-list-item-title 등록된 태그
              v-list-item-subtitle.comment
                v-chip.mt-2.mr-2(color="info" outlined label small v-for="item in box.tags" :key="item" v-text="item")
          v-list-item
            v-list-item-content
              v-list-item-title 커버 이미지
              v-list-item-subtitle
                v-img.mx-auto(:src="box.coverUrl" max-width="200px")
          v-list-item
            v-list-item-content
              v-list-item-title QR code
              v-list-item-subtitle
                v-img.mx-auto(:src="box.qrCodeUrl" max-width="200px")
          v-list-item
            v-list-item-content
              v-list-item-title 설명
              v-list-item-subtitle.comment(v-text="box.description")
</template>

<script>
import BoxSample from '@/components/sample/index'
import DisplayUser from '@/components/display-user'
import DisplayTime from '@/components/display-time'

export default {
  components: {
    BoxSample,
    DisplayUser,
    DisplayTime,
  },
  props: ['boxId'],
  data() {
    return {
      unsubscribe: null,
      ref: null,
      box: {
        title: '',
        description: '',
        likeUids: [],
      },
      loading: false,
      dialog: false,
      parentRackName: '',
    }
  },
  watch: {
    boxId() {
      this.subscribe()
    },
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    fireUser() {
      return this.$store.state.fireUser
    },
    liked() {
      if (!this.fireUser) return false
      return this.box.likeUids.includes(this.fireUser.uid)
    },
    rackTitle() {
      return this.$route.query.rackTitle
    },
  },
  created() {
    this.subscribe()
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  mounted() {},
  methods: {
    async subscribe() {
      if (this.unsubscribe) this.unsubscribe()
      this.ref = this.$firebase
        .firestore()
        .collection('boxes')
        .doc(this.boxId)
      this.unsubscribe = await this.ref.onSnapshot(
        doc => {
          if (!doc.exists) {
            return this.write()
          }
          const item = doc.data()
          item.createdAt = item.createdAt.toDate()
          item.updatedAt = item.updatedAt.toDate()
          this.box = item
        },
        e => {
          throw Error(e.message)
        }
      )
    },
    async like() {
      if (!this.fireUser) throw Error('로그인이 필요합니다')
      if (this.liked) {
        await this.ref.update({
          likeCount: this.$firebase.firestore.FieldValue.increment(-1),
          likeUids: this.$firebase.firestore.FieldValue.arrayRemove(
            this.fireUser.uid
          ),
        })
      } else {
        await this.ref.update({
          likeCount: this.$firebase.firestore.FieldValue.increment(1),
          likeUids: this.$firebase.firestore.FieldValue.arrayUnion(
            this.fireUser.uid
          ),
        })
      }
    },
    async write() {
      this.$router.replace({
        path: this.$route.path,
        query: { action: 'write' },
      })
    },
    async sampleWrite() {
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
