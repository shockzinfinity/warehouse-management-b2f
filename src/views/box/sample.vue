<template lang="pug">
  sample-content(v-if="!action" :boxId="info" :sampleId="box")
  sample-form(v-else :boxId="info" :sampleId="box" :action="action")
</template>

<script>
import SampleContent from '@/components/sample/content'
import SampleForm from '@/components/sample/form'

export default {
  components: { SampleContent, SampleForm },
  computed: {
    info() {
      return this.$route.params.info
    },
    sample() {
      return this.$route.params.sample
    },
    action() {
      return this.$route.params.action
    },
  },
}
</script>
