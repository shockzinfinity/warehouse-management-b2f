<template lang="pug">
  v-footer(app color="primary" dark absolute :footer="footer")
    v-spacer
    div &copy; {{ new Date().getFullYear() + ' ' + footer }}
</template>

<script>
export default {
  props: ['footer']
}
</script>
