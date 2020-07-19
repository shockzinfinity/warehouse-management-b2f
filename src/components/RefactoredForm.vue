<template lang="pug">
  validation-observer(ref="obs" v-slot="{ invalid, validated, passes, validate }")
    v-card.elevation-12
      v-toolbar(dark color="primary")
        v-toolbar-title VeeVadlidate Providers (Refactored)
      v-card-text
        v-form
          v-text-field-with-validation(rules="required|max:10" v-model="name" :counter="10" label="Name")
          v-text-field-with-validation(rules="required|email" v-model="email" label="E-mail")
          v-select-with-validation(rules="required" :items="items" v-model="select" label="Select")
          validation-provider(
            rules="required"
            name="checkbox"
            v-slot="{ errors, valid }"
          )
            v-checkbox(
              v-model="checkbox"
              :error-messages="errors"
              :success="valid"
              value="1"
              label="Option"
              type="checkbox"
              required
            )
      v-card-actions
        v-btn(@click="clear") Clear
        v-spacer
        v-btn(@click="validate") Validate
        v-btn(color="primary" @click="passes(submit)" :disabled="invalid || !validated") SignUp
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation'
import VSelectWithValidation from '@/components/inputs/VSelectWithValidation'

export default {
  data: () => ({
    items: ['', 'Foo', 'Bar'],
    name: '',
    email: '',
    select: '',
    checkbox: ''
  }),
  components: {
    ValidationObserver,
    ValidationProvider,
    VTextFieldWithValidation,
    VSelectWithValidation
  },
  methods: {
    async clear () {
      this.name = this.email = this.select = this.checkbox = ''
      requestAnimationFrame(() => {
        this.$refs.obs.reset()
      })
    },
    async submit () {
      console.log('submitted.')
    }
  }
}
</script>
