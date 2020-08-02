<template lang="pug">
  v-container(fluid :class="$vuetify.breakpoint.xs ? 'pa-0' : ''")
    v-card(outlined)
      v-toolbar(color="transparent" dense flat)
        v-toolbar-title
          v-chip.mr-4(color="info" label outlined) {{ rack.position }}
        | {{ rack.title }}
        v-spacer
        v-btn(icon @click="like") <v-icon :color="liked ? 'success' : ''">mdi-thumb-up</v-icon> <span>{{ rack.likeCount }}</span>
        template(v-if="user")
          v-btn(icon @click="write" :disabled="user.level > 0") <v-icon>mdi-pencil</v-icon>
          v-btn(icon @click="boxDialog = true" :disabled="user.level > 4") <v-icon>mdi-plus</v-icon>
      v-divider
      v-card-text(v-if="rack.createdAt")
        v-alert(color="info" outlined dismissible)
          v-row.no-gutters
            v-col.pb-2(lg="6" cols="sm")
              v-img.mx-auto(:src="rack.coverUrl" max-width="200px")
            v-col.pb-2(lg="6" cols="sm")
              v-img.mx-auto(:src="rack.qrCodeUrl" max-width="200px")
          v-row
            v-col
              div(style="white-space: pre-line") {{ rack.description }}
              .text-right.font-italic.caption 작성일: {{ rack.createdAt.toDate().toLocaleString() }}
              .text-right.font-italic.caption 수정일: {{ rack.updatedAt.toDate().toLocaleString() }}
              .text-right.font-italic.caption 포함 박스 수: {{ rack.boxCount }}
              .text-right.font-italic.caption 등록자:
                display-user(:user="rack.user")
      rack-box(v-if="rack.rackId" :rackId="rackId" :rack="rack")
    v-dialog(v-model="boxDialog" max-width="400")
      v-card
        v-card-title 박스 추가
          v-spacer
          v-btn(icon @click="boxWrite") <v-icon>mdi-content-save</v-icon>
          v-btn(icon @click="boxDialog = false") <v-icon>mdi-close</v-icon>
        v-card-text
          v-text-field(v-model="toAddBoxTitle" outlined label="박스 이름" @keypress.enter="boxWrite" hide-details)
</template>

<script>
import RackBox from '@/components/box/index'
import DisplayUser from '@/components/display-user'

export default {
  components: {
    RackBox,
    DisplayUser,
  },
  props: ['rackId'],
  data() {
    return {
      unsubscribe: null,
      rack: {
        title: '',
        description: '',
        likeCount: 0,
        likeUids: [],
      },
      loading: false,
      boxDialog: false,
      toAddBoxTitle: '',
      ref: null,
    }
  },
  watch: {
    rackId() {
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
      return this.rack.likeUids.includes(this.fireUser.uid)
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
        .collection('racks')
        .doc(this.rackId)
      this.unsubscribe = this.ref.onSnapshot(
        doc => {
          if (!doc.exists) {
            return this.write()
          }
          this.rack = doc.data()
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
      this.$router.push({
        path: this.$route.path,
        query: { action: 'write' },
      })
    },
    async boxWrite() {
      // TODO: 박스 이름 중복 체크
      this.$router.push({
        path: '/box/' + this.toAddBoxTitle,
        query: {
          action: 'write',
          parentRackId: this.rack.rackId,
          parentRackPath: this.rackId,
        },
      })
    },
  },
}
</script>