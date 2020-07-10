<template lang="pug">
  div
    v-list-item
      v-list-item-content
        v-list-item-title.title Application
        v-list-item-subtitle subtext
    v-divider
    v-list
      v-list-group(
        v-for="(item, i) in items"
        :key="i"
        v-model="item.active"
        :prepend-icon="item.icon"
        no-action
      )
        template(v-slot:activator)
          v-list-item-content
            v-list-item-title(v-text="item.title")

        v-list-item(
          v-for="subItem in item.subItems"
          :key="subItem.title"
          :to="subItem.to"
        )
          v-list-item-content
            v-list-item-title(v-text="subItem.title")
</template>

<script>
export default {
  props: ['items'],
  data () {
    return {
    }
  }
}
</script>
