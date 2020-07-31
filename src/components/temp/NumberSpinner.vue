<template lang="pug">
  v-container
    v-text-field.centered-input(
      v-model="myValue"
      type="number"
      :label="myLabel"
      append-outer-icon="add"
      @click:append-outer="increment"
      prepend-icon="remove"
      @click:prepend="decrement"
      @keypress="verifyKeyStrokes"
      @change="updateModel"
    )
</template>

<script>
export default {
  name: 'NumericSpinner',
  props: {
    value: Number,
    label: String,
    minimum: {
      type: Number,
      required: false,
      default: 0,
    },
    maximum: {
      type: Number,
      required: false,
      default: Number.MAX_SAFE_INTEGER,
    },
    step: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  data() {
    return {
      myValue: this.value,
      myLabel: this.label,
    }
  },
  mounted() {
    this.verifyRange()
  },
  methods: {
    increment() {
      this.myValue = parseInt(this.myValue, 10) + this.step
      this.updateModel()
    },
    decrement() {
      this.myValue = parseInt(this.myValue, 10) - this.step
      this.updateModel()
    },
    updateModel() {
      if (this.verifyRange()) {
        this.$emit('input', this.myValue)
      }
    },
    verifyKeyStrokes(evt) {
      // Only allow numbers and the decimal
      evt = evt || window.event
      const charCode = evt.which ? evt.which : evt.keyCode
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    verifyRange() {
      // Fit the number to the range
      // Doesn't emit a v-model 'input' event itself
      if (this.myValue < this.minimum) {
        this.myValue = this.minimum
        this.$emit('input', this.myValue)
        return false
      } else if (this.myValue > this.maximum) {
        this.myValue = this.maximum
        this.$emit('input', this.myValue)
        return false
      } else {
        return true
      }
    },
  },
}
</script>

<style>
/* Override the default 'start' text alignment of input */
.centered-input input {
  text-align: center;
}
</style>
