<template lang="pug">
  v-app
    v-app-bar(app color="primary" dark)
      v-app-bar-nav-icon(@click="drawer = !drawer")
      v-toolbar-title Page title
      v-spacer
      v-btn(icon to="/about") <v-icon>mdi-magnify</v-icon>
    v-navigation-drawer(app v-model="drawer")
      v-list-item
        v-list-item-content
          v-list-item-title.title Application
          v-list-item-subtitle subtext
    v-main
      router-view
    v-footer(app color="primary" dark absolute)
      v-spacer
        div &copy; {{ new Date().getFullYear() }}
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data: () => ({
    drawer: false,
    items: []
  })
}
</script>
