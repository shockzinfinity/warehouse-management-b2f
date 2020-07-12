<template lang="pug">
  v-app
    v-app-bar(app color="primary" dark)
      v-app-bar-nav-icon(@click="drawer = !drawer")
      site-title(:title="site.title")
      v-spacer
      site-sign
    v-navigation-drawer(app v-model="drawer" width="400")
      site-menu(:items="site.menu")
    v-main
      router-view
    site-footer(:footer="site.footer")
</template>

<script>
import SiteTitle from '@/components/site/title'
import SiteFooter from '@/components/site/footer'
import SiteMenu from '@/components/site/menu'
import SiteSign from '@/components/site/sign'

export default {
  name: 'App',
  components: {
    SiteTitle,
    SiteFooter,
    SiteMenu,
    SiteSign
  },
  data: () => ({
    drawer: false,
    site: {
      title: '나의 타이틀입니다.',
      footer: '푸터입니다.',
      menu: [
        {
          title: 'home',
          icon: 'mdi-home',
          subItems: [
            { title: 'Dashboard', to: '/' },
            { title: 'About', to: '/about' }
          ]
        },
        {
          title: 'xxx',
          active: true,
          icon: 'mdi-badge-account-alert',
          subItems: [
            {
              title: 'xxx',
              to: '/xxx'
            }
          ]
        }
      ]
    }
  }),
  created () {
    console.log('subscribe on create method')
    this.subscribe()
  },
  mounted () {
    // console.log('$firebase', this.$firebase)
  },
  methods: {
    subscribe () {
      this.$firebase.database().ref().child('site').on('value', (sn) => {
        const v = sn.val()
        if (!v) {
          this.$firebase.database().ref().child('site').set(this.site)
          return
        }
        this.site = v
      }, e => {
        console.log(e.message)
      })
    },
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
