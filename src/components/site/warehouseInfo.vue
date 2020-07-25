<template lang="pug">
  v-row.text-center
    v-col(cols="12")
      v-img.my-3(
        :src="require('../../assets/logo.svg')"
        contain
        height="200"
      )
    v-col.mb-4(cols="12")
      p.subheading.font-weight-regular Welcom to
      h2.headline.font-weight-bold.mb-3 warehouse management system (B2F)
      p.subheading.font-weight-regular
        | with <a href="https://community.vuetifyjs.com">Vuetify</a>
    v-col.mb-5(cols="12")
      h2.headline.font-weight-bold.mb-3
        router-link(to="/about") What's next
</template>
