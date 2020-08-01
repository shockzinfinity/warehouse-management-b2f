<template lang="pug">
.md-col-12
  .card.card-container
    img#profile-img.profile-img-card(
      ,
      src='//ssl.gstatic.com/accounts/ui/avatar_2x.png'
    )
    form(name='form', @submit.prevent='handleLogin')
      .form-group
        label(for='username') username
        input.form-control(
          v-model='user.username',
          type='text',
          name='username'
        )
        .v-alert(v-if='errors.has("username")', role='alert') Username is required

.col-md-12
  .card.card-container
    img#profile-img.profile-img-card(,
      src='//ssl.gstatic.com/accounts/ui/avatar_2x.png'
    )
      form(name='form', @submit.prevent='handleLogin')
        .form-group
          label(for='username') Username
          input.form-control(
            v-model='user.username',
            v-validate='\'required\'',
            type='text',
            name='username'
          )
            .alert.alert-danger(v-if(errors.has('username')), role='alert') Username is required
        .form-group
          label(for='password') Password
          input.form-control(
            v-model='user.password',
            v-validate='\'required\'',
            type='text',
            name='password'
          )
            .alert.alert-danger(v-if(errors.has('password')), role='alert') Password is required
        .form-group
          button.btn.btn-primary.btn-block(:disabled='loading')
            span.spinner-border.spinner-border-sm(v-show='loading')
            span Login
        .form-group
          .alert.alert-danger(v-if='message', role='alert') {{ message }}
</template>

<script>
import User from '@/models/user'

export default {
  name: 'Login',
  data() {
    return {
      user: new User('', ''),
      loading: false,
      message: '',
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/profile')
    }
  },
  methods: {
    handleLogin() {
      this.loading = true
      // TODO: validate
      // if(!valid)
      // this.loading = false
      // return

      if (this.user.username && this.user.password) {
        this.$store.dispatch('auth/login', this.user).then(
          () => {
            this.$router.push('/profile')
            // TODO: redirect previous path
          },
          error => {
            this.loading = false
            this.message =
              (error.response && error.response.data) ||
              error.message ||
              error.toString()
          }
        )
      }
    },
  },
}
</script>

<style lang="sass" scoped>
label
  display: block
  margin-top: 10px

.card-container.card
  max-width: 350px !important
  padding: 40px 40px

.card
  background-color: #f7f7f7
  padding: 20px 25px 30px
  margin: 0 auto 25px
  margin-top: 50px
  -moz-border-radius: 2px
  -webkit-border-radius: 2px
  border-radius: 2px
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3)
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3)
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3)

.profile-img-card
  width: 96px
  height: 96px
  margin: 0 auto 10px
  display: block
  -moz-border-radius: 50%
  -webkit-border-radius: 50%
  border-radius: 50%
</style>
