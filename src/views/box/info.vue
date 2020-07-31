<template lang="pug">
  box-info(v-if="!action" :boxId="info")
  box-form(v-else :boxId="info" :action="action")
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
    action() {
      return this.$route.query.action
    },
  },
}
</script>
