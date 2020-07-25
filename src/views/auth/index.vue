<template lang="pug">
  div 로그인이 필요합니다.
</template>

<script>
export default {
  // TODO: 로그인 완료 후에 redirect this.$router.replace('')
  // TODO: 로그인
  computed: {
    redirect () {
      return this.$route.query.redirect
    },
    changedLoggin () {
      return this.$store.state.fireUser
    }
  },
  created () {
    if (this.$store.state.isLogged) {
      if (this.redirect) this.$router.replace(this.redirect)
      else this.$router.replace('/')
    }
  },
  watch: {
    changedLoggin (n, o) {
      // console.log('changed (old): ', o)
      // console.log('changed (new): ', n)
      if (this.$store.getters.isLogged) {
        // console.log(this.redirect)
        if (this.redirect) this.$router.replace(this.redirect)
        else this.$router.replace('/')
      }
    }
  }
}
</script>
