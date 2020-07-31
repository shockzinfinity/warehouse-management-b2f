<template lang="pug">
  v-container(fluid)
    v-card
      v-toolbar(color="accent" dense flat dark)
        v-toolbar-title(v-text="rack.title")
        v-spacer
        template(v-if="user")
          v-btn(icon @click="write" :disabled="user.level > 0") <v-icon>mdi-pencil</v-icon>
          v-btn(icon @click="boxDialog = true" :disabled="user.level > 4") <v-icon>mdi-plus</v-icon>
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
      rack-box(:rackId="rackId" :rack="rack")
    v-dialog(v-model="boxDialog" max-width="400")
      v-card
        v-card-title 박스 추가
          v-spacer
          v-btn(icon @click="boxWrite") <v-icon>mdi-content-save</v-icon>
          v-btn(icon @click="boxDialog = false") <v-icon>mdi-close</v-icon>
        v-card-text
          v-text-field(v-model="boxTitle" outlined label="박스 이름" @keypress.enter="boxWrite" hide-details)

</template>

<script>
import RackBox from '@/components/box/index'

export default {
  components: {
    RackBox,
  },
  props: ['rackId'],
  data() {
    return {
      unsubscribe: null,
      rack: {
        title: '',
        description: '',
      },
      loading: false,
      boxDialog: false,
      boxTitle: '',
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
        .collection('racks')
        .doc(this.rackId)
      this.unsubscribe = ref.onSnapshot(doc => {
        if (!doc.exists) {
          return this.write()
        }
        this.rack = doc.data()
      }, console.error)
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
        path: '/box/' + this.boxTitle,
        query: { action: 'write' },
      })
    },
  },
}
</script>
