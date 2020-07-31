<template lang="pug">
  validation-provider(
    :name="$attrs.label"
    :rules="rules"
    v-slot="{ errors, valid }"
  )
    v-select(
      v-model="innerValue"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
    )
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  components: {
    ValidationProvider,
  },
  props: {
    rules: {
      type: [Object, String],
      default: '',
    },
    value: {
      type: null,
    },
  },
  data: () => ({
    innerValue: '',
  }),
  watch: {
    // handle internal mode change
    innerValue(newVal) {
      this.$emit('input', newVal)
    },
    // handle external mode change
    value(newVal) {
      this.innerValue = newVal
    },
  },
  created() {
    if (this.value) {
      this.innerValue = this.value
    }
  },
}
</script>
