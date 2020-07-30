<template lang="pug">
  v-row(align="center")
    v-col(cols="12")
      v-card.mx-auto
        v-img.white--text.cover-full.align-end(
          :src="info.coverUrl"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          max-width="600"
          max-height="600"
        )
          v-card-title.pb-3.justify-end {{ info.title }}
        v-card-subtitle.pb-0 This site is a management system for warehouse.
        v-card-subtitle.pb-0 Address: {{ info.address }}
        v-card-subtitle.pb-0 Description: {{ info.description }}
        v-card-subtitle.pb-0 Current summary: 
        v-card-text.text--primary
        v-card-actions
          v-spacer
          v-btn(
            v-if="$store.state.isAdmin"
            color="orange"
            @click="$router.push($route.path + '/modify')"
          ) Modify Info
</template>

<script>
export default {
  data () {
    return {
      info: {
        title: '',
        description: '',
        address: '',
        coverUrl: ''
      }
    }
  },
  created () {
    this.subscribe()
  },
  methods: {
    subscribe () {
      this.$firebase.database().ref().child('warehouseInfo').on('value', sn => {
        const w = sn.val()
        if (!w) {
          this.$firebase.database().ref().child('warehouseInfo').set(this.info)
          return
        }
        this.info = w
      }, e => {
        console.log(e.message)
      })
    }
  }
}
</script>
