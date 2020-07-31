<template lang="pug">
  div
    v-row
      v-col.pb-2(lg="12" cols="sm")
        h2 About
        p version 20.07.24
        p 본 서비스는 창고 관리를 위해 개발된 서비스 입니다.
    v-divider
    v-row
      v-col.pb-2(lg="12" cols="sm")
        h3.text-truncate.text-uppercase What's Next
        p 향후 추가될 기능 리스트입니다.
    v-divider
    v-row
      v-col.pb-2(lg="12" cols="sm")
        h3.text-truncate.text-uppercase Feedback
        p 버그 및 요청 사항은 아래의 게시판에 작성하거나 <a href="mailto:shockzinfinity@gmail.com">shockzinfinity@gmail.com</a> 으로 보내주시기 바랍니다.
        router-link(to="/board/feedback") feedback
</template>

<script>
// import { head } from 'lodash'
import DisplayComment from '@/components/display-comment'

export default {
  components: {
    DisplayComment,
  },
  data: () => ({
    feedbackRef: null,
    commentLength: 0,
  }),
  created() {
    // this.subscribe()
  },
  methods: {
    async subscribe() {},
  },
}
</script>

<style lang="sass" scoped></style>
