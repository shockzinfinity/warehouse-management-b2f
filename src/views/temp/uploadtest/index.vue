<template lang="pug">
  div
    v-btn(
      @click.native="selectFiles"
      v-if="!uploadEnd && !uploading"
    ) Upload image
    form(ref="form")
      input(
        id="files"
        type="file"
        name="file"
        ref="uploadInput"
        accept="image/*"
        :multiple="false"
        @change="detectFiles($event)"
      )
    v-progress-circular(
      v-if="uploading && !uploadEnd"
      :size="100"
      :width="15"
      :rotate="360"
      :value="progressUpload"
      color="primary"
    ) {{ progressUpload }} %
    img(
      v-if="uploadEnd"
      :src="downloadURL"
      width="50%"
    )
    div(v-if="uploadEnd")
      v-btn.ma-0(dark small color="error" @click="deleteImage") Delete
</template>

<script>
export default {
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
  watch: {
    uploadTask() {
      this.uploadTask.on(
        'state_changed',
        sp => {
          this.progressUpload = Math.floor(
            (sp.bytesTransferred / sp.totalBytes) * 100,
          )
        },
        null,
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then(url => {
            this.uploadEnd = true
            this.downloadURL = url
            this.$emit('downloadURL', url)
          })
        },
      )
    },
  },
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
      this.uploadTask = this.$firebase
        .storage()
        .ref()
        .child('uploadTest')
        .child(file.name)
        .put(file)
    },
    deleteImage() {
      this.$firebase
        .storage()
        .ref()
        .child('uploadTest')
        .child(this.fileName)
        .delete()
        .then(() => {
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
        })
        .catch(e => {
          console.error(e)
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
