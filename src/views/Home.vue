<template lang="pug">
  v-container.home(fluid)
    v-row
      v-col(cols="12")
        v-row(align="center" style="height: 400px;")
          v-card.mx-auto
            v-img.white--text.grey.darken-2.align-end(
              src="@/assets/images/intro.bg.jpg"
            )
              //- v-card-title.pb-3.justify-end Cosmetic Sample Repository (B2F)
            v-card-subtitle.pb-0 This site is a management system for warehouse.
            v-card-subtitle.pb-0 Address: 
            v-card-subtitle.pb-0 Current summary: 
            v-card-text.text--primary
            v-card-actions
              v-spacer
              v-btn(
                v-if="$store.state.isAdmin"
                color="orange"
                @click="$router.push('/warehouse')"
              ) Modify Info
</template>

<script>
export default {
  name: 'Home',
  components: {
  }
}
</script>
