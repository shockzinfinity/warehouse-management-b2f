<template lang="pug">
  v-container(fluid fill-height)
    v-layout(align-center justify-center)
      v-flex(xs12 sm8 md4)
        //- test-form
        refactored-form
</template>

<script>
import TestForm from '@/components/TestForm'
import RefactoredForm from '@/components/RefactoredForm'

export default {
  components: {
    TestForm,
    RefactoredForm
  }
}
</script>
