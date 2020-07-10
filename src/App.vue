<template lang="pug">
  v-app
    v-app-bar(app color="primary" dark)
      v-app-bar-nav-icon(@click="drawer = !drawer")
      site-title(:title="title")
      v-spacer
      v-btn(icon @click="save") <v-icon>mdi-check</v-icon>
      v-btn(icon @click="read") <v-icon>mdi-numeric</v-icon>
      v-btn(icon @click="readOne") <v-icon>mdi-numeric-0-box-multiple</v-icon>
    v-navigation-drawer(app v-model="drawer")
      site-menu
    v-main
      router-view
    site-footer(:footer="footer")
</template>

<script>
import SiteTitle from '@/components/site/title'
import SiteFooter from '@/components/site/footer'
import SiteMenu from '@/components/site/menu'

export default {
  name: 'App',
  components: {
    SiteTitle,
    SiteFooter,
    SiteMenu
  },
  data: () => ({
    title: '나의 타이틀입니다.',
    footer: '푸터입니다.',
    drawer: false,
    items: []
  }),
  mounted () {
    // console.log('$firebase', this.$firebase)
  },
  methods: {
    save () {
      console.log('save')
      this.$firebase.database().ref().child('abcd').set({
        title: 'abcd', text: 'ttttttt'
      })
    },
    read () {
      this.$firebase.database().ref().child('abcd').on('value', (sn) => {
        console.log(sn)
        console.log(sn.val())
      })
    },
    async readOne () {
      const sn = await this.$firebase.database().ref().child('abcd').once('value')
      console.log(sn.val())
    }
  }
}
</script>
