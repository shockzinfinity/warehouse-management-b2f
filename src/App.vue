<template lang="pug">
  v-app
    v-app-bar(app color="primary" dark)
      v-app-bar-nav-icon(@click="drawer = !drawer")
      site-title(:title="title")
      v-spacer
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
  }
}
</script>
