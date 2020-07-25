<template lang="pug">
  div
    v-row
      v-col.pb-2(lg="12" cols="sm")
        h2 About
        p version 20.07.24
        p 본 사이트는 창고 관리를 위해 개발된 사이트 입니다.
    v-divider
    v-row
      v-col.pb-2(lg="12" cols="sm")
        h3.text-truncate.text-uppercase What's Next
        p 향후 추가될 기능 리스트입니다.
    v-divider
    v-row
      v-col.pb-2(lg="12" cols="sm")
        h3.text-truncate.text-uppercase Feedback
        p 버그 및 요청 사항을 아래에 작성해주십시오.
        display-comment(:docRef="this.$firebase.firestore().collection('boards').doc('feedback')")
</template>

<script>
import DisplayComment from '@/components/display-comment'

export default {
  components: {
    DisplayComment
  },
  data: () => ({
  }),
  created () {
    const temp = this.$firebase.firestore().collection('boards').doc('feedback').get()
    if (!temp.exists) {
      this.$firebase.firestore().collection('boards').doc('feedback').set({})
    }
  },
  methods: {
  }
}
</script>

<style lang="sass" scoped>

</style>
