<template lang="pug">
  v-app
    v-app-bar(app color="primary" dark elevation="0")
      v-app-bar-nav-icon(@click="drawer = !drawer")
      site-title(:title="site.title")
      v-spacer
      site-sign
      //- v-btn(@click="test") test
    v-navigation-drawer(app v-model="drawer" floating width="400")
      site-menu(:items="site.menu")
    v-main
      v-container.px-4.py-0.fill-height(fluid)
        v-row.fill-height
          v-col
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
      title: '',
      footer: '',
      menu: [
        {
          title: 'home',
          icon: 'mdi-home',
          level: 9,
          subItems: [
            { title: 'Dashboard', to: '/', level: 9 },
            { title: 'About', to: '/about', level: 9 }
          ]
        }
      ]
    }
  }),
  created () {
    console.log('site started')
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
        // console.log(this.site.title)
        // console.log(this.site.footer)
      }, e => {
        console.log(e.message)
      })
    },
    // save () {
    //   console.log('save')
    //   this.$firebase.database().ref().child('abcd').set({
    //     title: 'abcd', text: 'ttttttt'
    //   })
    // },
    // read () {
    //   this.$firebase.database().ref().child('abcd').on('value', (sn) => {
    //     console.log(sn)
    //     console.log(sn.val())
    //   })
    // },
    // async readOne () {
    //   const sn = await this.$firebase.database().ref().child('abcd').once('value')
    //   console.log(sn.val())
    // }
    async test () {
      // await this.$firebase.firestore().collection('users').doc(this.$store.state.fireUser.uid)
      //   .update({ level: 0, visitedAt: new Date(), visitCount: 0 })
      await this.$firebase.firestore().collection('users').doc(this.$store.state.fireUser.uid)
        .update({ visitedAt: new Date(), visitCount: 0 })
    }
  }
}
</script>
