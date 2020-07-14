<template lang="pug">
  v-card {{ rackId }} - {{ boxId }} - {{ sampleId }} - {{ action }}
</template>

<script>
export default {
  computed: {
    rackId () {
      return this.$route.params.rackId
    },
    boxId () {
      return this.$route.params.boxId
    },
    sampleId () {
      return this.$route.params.sampleId
    },
    action () {
      return this.$route.params.action
    }
  }
}
</script>
