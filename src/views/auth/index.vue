<template lang="pug">
div 로그인이 필요합니다.
</template>

<script>
export default {
  computed: {
    redirect() {
      return this.$route.query.redirect
    },
    changedLoggin() {
      return this.$store.state.fireUser
    },
  },
  watch: {
    changedLoggin(n, o) {
      if (this.$store.getters.isLogged) {
        if (this.redirect) {
          this.$router.replace(this.redirect)
        } else {
          this.$router.replace('/')
        }
      }
    },
  },
  created() {
    if (this.$store.state.isLogged) {
      if (this.redirect) {
        this.$router.replace(this.redirect)
      } else {
        this.$router.replace('/')
      }
    }
  },
}
</script>
