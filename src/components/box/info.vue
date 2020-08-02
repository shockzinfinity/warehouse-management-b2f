<template lang="pug">
  v-container(fluid :class="$vuetify.breakpoint.xs ? 'pa-0' : ''")
    v-card(outlined)
      v-toolbar(color="transparent" dense flat)
        v-toolbar-title
          v-chip.mr-4(color="info" outlined label) 포함 랙
        | {{ box.title }}
        v-spacer
        v-btn(icon @click="like") <v-icon :color="liked ? 'success' : ''">mdi-thumb-up</v-icon> <span>{{ box.likeCount }}</span>
        template(v-if="user")
          v-btn(icon @click="write" :disabled="user.level > 0") <v-icon>mdi-pencil</v-icon>
          v-btn(icon @click="sampleWrite" :disabled="user.level > 4") <v-icon>mdi-plus</v-icon>
      v-card-text(v-if="box.createdAt")
        v-alert(color="info" outlined dismissible)
          v-row.no-gutters(justify="center" align="center")
            v-col(lg="6" cols="sm")
              v-img.mx-auto(:src="box.coverUrl" max-width="200px")
            v-col(lg="6" cols="sm")
              v-img.mx-auto(:src="box.qrCodeUrl" max-width="200px")
          v-row.no-gutters
            v-col
              div(style="white-space: pre-line") {{ box.description }}
                .text-right.font-italic.caption 작성일: {{ box.createdAt.toDate().toLocaleString() }}
                .text-right.font-italic.caption 수정일: {{ box.updatedAt.toDate().toLocaleString() }}
                .text-right.font-italic.caption 포함샘플수: {{ box.sampleCount }}
                .text-right.font-italic.caption 등록자:
                  display-user(:user="box.user")
      box-sample(:boxId="boxId" :box="box")
</template>

<script>
import BoxSample from '@/components/sample/index'
import DisplayUser from '@/components/display-user'

export default {
  components: {
    BoxSample,
    DisplayUser,
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
      doc: null,
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
      this.ref = this.$firebase
        .firestore()
        .collection('boxes')
        .doc(this.boxId)
      this.unsubscribe = this.ref.onSnapshot(
        doc => {
          if (!doc.exists) {
            return this.write()
          }
          this.doc = doc
          this.box = doc.data()
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