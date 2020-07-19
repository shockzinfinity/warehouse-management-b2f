<template lang="pug">
  validation-observer(ref="obs" v-slot="{ invalid, validated, passes, validate }")
    v-card.elevation-12
      v-toolbar(dark color="primary")
        v-toolbar-title VeeVadlidate Providers
      v-card-text
        v-form
          validation-provider(name="Name" rules="required|max:10" v-slot="{ errors, valid }")
            v-text-field(
              v-model="name"
              :counter="10"
              :error-messages="errors"
              :success="valid"
              label="Name"
              required
            )
          validation-provider(name="email" rules="required|email"  v-slot="{ errors, valid }")
            v-text-field(
              v-model="email"
              :success="valid"
              :error-messages="errors"
              label="E-mail"
              required
            )
          validation-provider(name="select" rules="required"  v-slot="{ errors, valid }")
            v-select(
              :items="items"
              v-model="select"
              :success="valid"
              :error-messages="errors"
              label="Select"
              required
            )
          validation-provider(name="checkbox" rules="required"  v-slot="{ errors, valid }")
            v-checkbox(
              v-model="checkbox"
              :success="valid"
              :error-messages="errors"
              type="checkbox"
              label="Option"
              value="1"
              required
            )
      v-card-actions
        v-btn(@click="clear") Clear
        v-spacer
        v-btn(@click="validate()") Validate
        v-btn(color="primary" @click="passes(submit)" :disabled="invalid || !validated") SignUp
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'

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
    ValidationProvider
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
