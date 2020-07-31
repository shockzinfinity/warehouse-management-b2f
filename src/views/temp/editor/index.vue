<template lang="pug">
  v-sheet
    v-subheader editor
      v-spacer
      v-btn(@click="toggle = !toggle") toggle
      v-btn(@click="read") read
    editor(:options="options" :initialValue="text" ref="editor")
    viewer(:initialValue="text" v-if="toggle")
</template>

<script>
export default {
  data() {
    return {
      options: {
        language: 'ko',
      },
      text: '# abcdefg',
      toggle: false,
    }
  },
  methods: {
    read() {
      // alert(this.text)
      this.text = this.$refs.editor.invoke('getMarkdown')
      alert(this.text)
    },
  },
}
</script>
