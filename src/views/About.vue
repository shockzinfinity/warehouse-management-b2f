<template lang="pug">
  v-container(fluid :class="$vuetify.breakpoint.xs ? 'pa-0' : ''")
    v-row
      v-col.pb-2(lg="12" cols="sm")
        h2 About
        p version 20.07.24
        p 본 서비스는 창고 관리를 위해 개발된 서비스 입니다.
        p 사용방법은 
          a(href="https://warehouse-management-b2f.firebaseapp.com/board/notice/1596446896289") Help
          | 를 참고하시기 바랍니다.
    v-divider
    v-row
      v-col.pb-2(lg="12" cols="sm")
        h3.text-truncate.text-uppercase What's Next
        p 향후 추가될 기능 리스트입니다.
        v-list
          v-list-item
            v-icon(left) mdi-source-commit
            | 모바일 앱 (PWA)
          v-list-item
            v-icon(left) mdi-source-commit
            | 실시간 메시징 적용
    v-divider
    v-row
      v-col(lg="12" cols="sm")
        h3.text-truncate.text-uppercase Feedback
        p 버그 및 요청 사항은 
          router-link(to="/board/feedback") Feedback
          | 에 작성하거나 <a href="mailto:shockzinfinity@gmail.com">shockzinfinity@gmail.com</a> 으로 보내주시기 바랍니다.
</template>

<script>
export default {
  components: {},
  data: () => ({}),
  created() {},
  methods: {},
}
</script>

<style lang="sass" scoped></style>
