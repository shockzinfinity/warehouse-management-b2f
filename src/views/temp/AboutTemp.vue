<template lang="pug">
  div
    v-row
      v-col.pb-2(lg="4" cols="sm")
        v-card
          v-row.no-gutters
            .cyan.fill-height &nbsp;
            .col.pa-3.py-4.cyan--text
              h5.text-truncate.text-uppercase Sales
              h1 53
      v-col.pb-2(lg="4" cols="sm")
        v-card
          v-row.no-gutters
            .col-auto
              .primary.fill-height &nbsp;
            .col.pa-3.py-4.text--primary
              h5.text-truncate.text-uppercase Growth
              h1 23%
      v-col.pb-2(lg="4" cols="sm")
        v-card
          v-row.no-gutters
            .col-auto
              .success.fill-height &nbsp;
            .col.pa-3.py-4.success
              h5.text-truncate.text-uppercase Calls
              h1 213
    v-row
      v-col
        v-card.overflow-y-auto(height="170" scrollable elevation="4")
          v-card-text
            p Codeply Kickstarter PBR 
              | asymmetrical lo-fi. Dreamcatcher street art Carles, stumptown gluten-free Kickstarter artisan 
              | Wes Anderson wolf pug. Godard sustainable you probably haven't heard of them, vegan farm-to-table Williamsburg slow-carb 
              | readymade disrupt deep v. Meggings seitan Wes Anderson semiotics, cliche American Apparel whatever. Helvetica cray plaid, vegan brunch Banksy 
              | leggings +1 direct trade. Wayfarers codeply PBR selfies. Banh mi McSweeney's Shoreditch selfies, 
              | forage fingerstache food truck occupy YOLO Pitchfork fixie iPhone fanny pack art party Portland.
              a(href="//www.codeply.com" target="_new") Codeply
            p Codeply Kickstarter PBR 
              | asymmetrical lo-fi. Dreamcatcher street art Carles, stumptown gluten-free Kickstarter artisan 
              | Wes Anderson wolf pug. Godard sustainable you probably haven't heard of them, vegan farm-to-table Williamsburg slow-carb 
              | readymade disrupt deep v. Meggings seitan Wes Anderson semiotics, cliche American Apparel whatever. Helvetica cray plaid, vegan brunch Banksy 
              | leggings +1 direct trade. Wayfarers codeply PBR selfies. Banh mi McSweeney's Shoreditch selfies, 
              | forage fingerstache food truck occupy YOLO Pitchfork fixie iPhone fanny pack art party Portland.
    v-row
      v-col
        v-card.mx-auto.text-center
          v-card-title.text--primary Sales
          v-sparkline(
            :value="sparklineData"
            padding="18"
            label-size="4"
            color="cyan"
            :gradient="['#007bff', 'cyan']"
            :line-width="2"
            :storke-linecap="'round'"
          )
          v-card-actions.py-4.justify-center
            v-btn(color="primary" to="/reports") View Report
</template>

<script>
export default {
  props: {
    // items: []
  },
  data: () => ({
    sidebarMenu: true,
    toggleMini: false,
    items: [
      { title: 'Home', href: '/', icon: 'mdi-home-outline' },
      { title: 'Detections', href: '/detections', icon: 'mdi-shield-account' },
      { title: 'Components', href: '/comp', icon: 'mdi-palette-swatch' },
      {
        title: 'Customers',
        href: '/customers',
        icon: 'mdi-account-search-outline',
      },
      { title: 'Orders', href: '/orders', icon: 'mdi-bus-clock' },
      { title: 'Settings', href: '/settings', icon: 'mdi-settings-outline' },
    ],
    sparklineData: [423, 446, 675, 510, 590, 610, 423],
  }),
  computed: {
    mini() {
      return this.$vuetify.breakpoint.smAndDown || this.toggleMini
    },
    buttonText() {
      return !this.$vuetify.theme.dark ? 'Go Dark' : 'Go Light'
    },
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
  },
}
</script>

<style lang="sass" scoped>
.fade-enter-active, .fade-leave-active
  transition-property: opacity
  transition-duration: .25s

.fade-enter-active
  transition-delay: .25s

.fade-enter, .fade-leave-active
  opacity: 0

.theme--light.v-application ::-webkit-scrollbar
  width: 13px

.theme--light.v-application ::-webkit-scrollbar-track
  background: #e6e6e6
  border-left: 1px solid #dadada

.theme--light.v-application ::-webkit-scrollbar-thumb
  background: #b0b0b0
  border: solid 3px #e6e6e6
  border-radius: 7px

.theme--light.v-application ::-webkit-scrollbar-thumb:hover
  background: black

.theme--dark.v-application ::-webkit-scrollbar
  width: 13px

.theme--dark.v-application ::-webkit-scrollbar-track
  background: #202020
  border-left: 1px solid #2c2c2c

.theme--dark.v-application ::-webkit-scrollbar-thumb
  background: #3e3e3e
  border: solid 3px #202020
  border-radius: 7px

.theme--dark.v-application ::-webkit-scrollbar-thumb:hover
  background: white
</style>
