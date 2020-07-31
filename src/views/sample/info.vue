<template lang="pug">
  sample-info(v-if="!action" :sampleId="info")
  sample-form(v-else :sampleId="info" :action="action")
</template>

<script>
import SampleInfo from '@/components/sample/info'
import SampleForm from '@/components/sample/form'

export default {
  components: { SampleInfo, SampleForm },
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
