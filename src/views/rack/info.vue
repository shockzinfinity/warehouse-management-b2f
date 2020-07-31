<template lang="pug">
  rack-info(v-if="!action" :rackId="info")
  rack-form(v-else :rackId="info" :action="action")
</template>

<script>
import RackInfo from '@/components/rack/info'
import RackForm from '@/components/rack/form'

export default {
  components: { RackInfo, RackForm },
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
