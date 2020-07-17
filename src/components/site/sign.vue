<template lang="pug">
  v-progress-circular(indeterminate v-if="loading")
  v-menu(offset-y v-else-if="!$store.state.fireUser")
    template(v-slot:activator="{ on }")
      v-btn(icon v-on="on") <v-icon>mdi-account</v-icon>
    v-card
      v-card-title 로그인
      v-divider
      v-card-actions
        v-btn(color="red" dark @click="signInWithGoogle" block) <v-icon left>mdi-google</v-icon>구글로 로그인
      v-card-actions
        v-btn(color="blue" dark @click="signInWithFacebook" block) <v-icon left>mdi-facebook</v-icon>Facebook 로그인
  v-menu(offset-y v-else)
    template(v-slot:activator="{ on }")
      v-btn(icon v-on="on")
        v-avatar(size="32")
          v-img(:src="$store.state.fireUser.photoURL")
    v-card
      v-card-title 정보
      v-card-actions
        v-btn(color="" dark @click="signOut" block) 로그아웃
</template>

<script>
export default {
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async signInWithGoogle () {
      const provider = new this.$firebase.auth.GoogleAuthProvider()
      this.$firebase.auth().languageCode = 'ko'
      this.loading = true
      try {
        // const sn = await this.$firebase.auth().signInWithPopup(provider)
        // console.log('user info: ', sn.user)
        await this.$firebase.auth().signInWithPopup(provider)
        // console.log('store user info', this.$store.state.fireUser)
      } finally {
        this.loading = false
      }
    },
    signOut () {
      this.$firebase.auth().signOut()
    },
    signInWithFacebook () {
      throw Error('TODO')
    }
  }
}
</script>
