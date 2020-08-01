<template lang="pug">
  box-info(v-if="!action" :rackId="info" :boxId="box")
  box-form(v-else :rackId="info" :boxId="box" :action="action")
</template>

<script>
import BoxInfo from '@/components/box/info'
import BoxForm from '@/components/box/form'

export default {
  components: { BoxInfo, BoxForm },
  computed: {
    info() {
      return this.$route.params.info
    },
    box() {
      return this.$route.params.box
    },
    action() {
      return this.$route.query.action
    },
  },
}
</script>
