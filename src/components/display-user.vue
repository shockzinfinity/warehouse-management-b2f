<template lang="pug">
  v-tooltip(bottom)
    template(v-slot:activator="{on}")
      //- span(v-on="on") {{ user.displayName }}
      v-chip(v-on="on" color="accent")
        v-avatar(left)
          v-img(:src="user.photoURL")
        | {{ user.displayName }}
    span {{ user.email }}
</template>

<script>
export default {
  props: ['user'],
}
</script>
