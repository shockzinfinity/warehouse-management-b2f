<template lang="pug">
  v-container(fluid)
    v-card
      v-toolbar(color="accent" dense flat dark)
        v-toolbar-title(v-text="box.title")
        v-spacer
        template(v-if="user")
          v-btn(icon @click="write" :disabled="user.level > 0") <v-icon>mdi-pencil</v-icon>
          v-btn(icon @click="sampleWrite" :disabled="user.level > 4") <v-icon>mdi-plus</v-icon>
      v-card-text(v-if="box.createdAt")
        v-alert(color="info" outlined dismissible)
          v-row.no-gutters
            v-col.pb-2(lg="6" cols="sm")
              v-img.mx-auto(:src="box.coverUrl" max-width="200px")
            v-col.pb-2(lg="6" cols="sm")
              v-img.mx-auto(:src="box.qrCodeUrl" max-width="200px")
          v-row
            v-col
              div(style="white-space: pre-line") {{ box.description }}
              .text-right.font-italic.caption 작성일: {{ box.createdAt.toDate().toLocaleString() }}
              .text-right.font-italic.caption 수정일: {{ box.updatedAt.toDate().toLocaleString() }}
      box-sample(:boxId="boxId" :box="box")
</template>

<script>
import BoxSample from '@/components/sample/index'

export default {
  components: {
    BoxSample,
  },
  props: ['boxId'],
  data() {
    return {
      unsubscribe: null,
      box: {
        title: '',
        description: '',
      },
      loading: false,
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
        .collection('boxes')
        .doc(this.boxId)
      this.unsubscribe = ref.onSnapshot(
        doc => {
          if (!doc.exists) {
            return this.write()
          }
          this.box = doc.data()
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
    async sampleWrite() {
      this.$router.replace({
        path: this.$route.path + '/new',
        query: { action: 'write' },
      })
    },
  },
}
</script>
