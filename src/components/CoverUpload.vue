<template lang="pug">
  v-card
    v-card-subtitle.pb-0 cover image
    v-card-actions.justify-center
      v-spacer
      v-btn(
        color="primary"
        @click.native="selectFiles"
        v-if="!uploadEnd && !uploading"
        :disabled="!$store.state.isAdmin"
      ) change
      v-btn.ma-0(dark small color="error" @click="deleteImage" v-if="uploadEnd") Delete
    v-card-text(v-if="!uploading && !uploadEnd && !downloadURL")
      v-img.mx-auto(:src="originSrc")
    v-card-text.text-center {{ fileName }}
      v-progress-circular(
        v-if="uploading && !uploadEnd"
        :size="100"
        :width="15"
        :rotate="360"
        :value="progressUpload"
        color="primary"
      ) {{ progressUpload }} %
    v-img(
      v-if="uploadEnd"
      :src="downloadURL"
      width="50%"
    )
    v-form(ref="form")
      input(id="files" type="file" name="file" ref="uploadInput" accept="image/*" :multiple="false" @change="detectFiles($event)")
</template>

<script>
export default {
  props: {
    originSrc: { type: String, default: '' },
    storeRef: { default: null },
  },
  data() {
    return {
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
    }
  },
  computed: {},
  watch: {
    uploadTask() {
      this.uploadTask.on(
        'state_changed',
        sp => {
          this.progressUpload = Math.floor(
            (sp.bytesTransferred / sp.totalBytes) * 100
          )
        },
        null,
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then(url => {
            this.uploadEnd = true
            this.downloadURL = url
            this.$emit('downloadURL', url)
          })
        }
      )
    },
    pathId() {
      this.uploading = false
      this.uploadEnd = false
      this.downloadURL = ''
      this.fileName = ''
    },
  },
  created() {},
  methods: {
    selectFiles() {
      this.$refs.uploadInput.click()
    },
    detectFiles(e) {
      const fileList = e.target.files || e.dataTransfer.files
      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x])
      })
    },
    upload(file) {
      this.fileName = file.name
      this.uploading = true
      this.uploadTask = this.storeRef.child(file.name).put(file)
    },
    deleteImage() {
      this.storeRef
        .child(this.fileName)
        .delete()
        .then(() => {
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
        })
        .catch(e => {
          throw Error(e.message)
          // console.error(e)
        })
      this.$refs.form.reset()
    },
  },
}
</script>

<style lang="sass" scoped>
.progress-bar
  margin: 10px 0

input[type="file"]
  position: absolute
  clip: rect(0,0,0,0)
</style>
