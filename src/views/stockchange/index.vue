<template lang="pug">
  div stock change test
    v-text-field(
      type="number"
      v-model="stock"
      outlined
      flat
      dense
    )
    v-btn(icon @click="incomming") <v-icon>mdi-basket-fill</v-icon>
    v-btn(icon @click="outcomming") <v-icon>mdi-basket-unfill</v-icon>
</template>

<script>
export default {
  data () {
    return {
      stock: 0
    }
  },
  methods: {
    incomming () {
      console.log(this.stock)
    },
    outcomming () {
      console.log(this.stock)
    }
  }
}
</script>
