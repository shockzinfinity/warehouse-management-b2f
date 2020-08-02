<template lang="pug">
  v-app
    v-app-bar(app color='primary' dark)
      v-app-bar-nav-icon(@click='drawer = !drawer')
      site-title(:title='site.title')
      v-spacer
      site-sign
    v-navigation-drawer(app v-model='drawer' floating width='400')
      site-menu(:items='site.menu')
    v-main
      v-container.fill-height(fluid :class="$vuetify.breakpoint.xs ? 'pa-0' : ''")
        v-row.fill-height
          v-col
            router-view
    site-footer(:footer='site.footer')
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
    SiteSign,
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
            { title: 'About', to: '/about', level: 9 },
          ],
        },
      ],
    },
  }),
  created() {
    this.subscribe()
  },
  mounted() {},
  methods: {
    subscribe() {
      this.$firebase
        .database()
        .ref()
        .child('site')
        .on(
          'value',
          sn => {
            const v = sn.val()
            if (!v) {
              this.$firebase
                .database()
                .ref()
                .child('site')
                .set(this.site)
              return
            }
            this.site = v
          },
          e => {
            throw Error(e.message)
            // console.log(e.message)
          }
        )
    },
    async test() {
      await this.$firebase
        .firestore()
        .collection('users')
        .doc(this.$store.state.fireUser.uid)
        .update({ visitedAt: new Date(), visitCount: 0 })
    },
    async test2() {
      // const sn = await this.$firebase
      //   .storage()
      //   .ref()
      //   .child('boards')
      //   .child('tt')
      //   .child('12345678901234567890123')
      //   .putString('hihi')
      // console.log(sn)
    },
  },
}
</script>
