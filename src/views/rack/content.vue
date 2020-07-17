<template lang="pug">
  v-container(fluid)
    v-card
      v-toolbar(color="accent" dense flat dark)
        v-toolbar-title(v-text="rackInfo.title")
        v-spacer
        template(v-if="user")
          v-btn(icon @click="rackWrite" :disabled="user.level > 0") <v-icon>mdi-pencil</v-icon>
          v-btn(icon @click="boxWrite" :disabled="user.level > 0") <v-icon>mdi-shape-plus</v-icon>
      v-card-text(v-if="rackInfo.createdAt")
        v-alert(color="info" outlined dismissible)
          div(style="white-space: pre-line") {{ rackInfo.description }}
          .text-right.font-italic.caption 정보 작성일: {{ rackInfo.createdAt.toDate().toLocaleString() }}
          .text-right.font-italic.caption 정보 수정일: {{ rackInfo.updatedAt.toDate().toLocaleString() }}
          .text-right.font-italic.caption 박스 수: {{ rackInfo.boxCount }}
      box-list(:info="rackInfo" :document="document")
</template>

<script>
import BoxList from '@/components/box-list'

export default {
  components: {
    BoxList
  },
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
    // console.log(this.$route.params.collection)
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
        console.log(this.rackInfo)
      })
    },
    async rackWrite () {
      this.$router.push({ path: this.$route.path + '/rack-write' })
    },
    async boxWrite () {
      this.$router.push({ path: '/box/newBox', query: { rackId: this.rackInfo.rackId, rackTitle: this.rackInfo.title } })
    }
  }
}
</script>
