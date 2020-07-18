<template lang="pug">
  v-container(fluid)
    v-form
      v-card(:loading="loading")
        v-toolbar(color="accent" dense flat dark)
          v-toolbar-title modify warehouse informations
          v-spacer
          v-btn(icon @click="$router.push('/')") <v-icon>mdi-arrow-left</v-icon>
          v-btn(icon @click="save" :disabled="!$store.state.isAdmin") <v-icon>mdi-content-save</v-icon>
        v-card-text
          v-text-field(outlined label="창고명")
          v-text-field(outlined label="설명")
          v-text-field(outlined label="주소")
        hr
        v-card-subtitle.pb-0 cover image
        v-card-text.text-center {{ fileName }}
        v-card-actions.justify-center
          v-spacer
          v-btn(
            color="primary"
            @click.native="selectFiles"
            v-if="!uploadEnd && !uploading"
            :disabled="!$store.state.isAdmin"
          ) change
          v-btn.ma-0(dark small color="error" @click="deleteImage" v-if="uploadEnd") Delete
        v-form(ref="form")
          input(id="files" type="file" name="file" ref="uploadInput" accept="image/*" :multiple="false" @change="detectFiles($event)")
        v-progress-circular(
          v-if="uploading && !uploadEnd"
          :size="80" :width="15" :rotate="360" :value="progressUpload" color="primary"
        ) {{ progressUpload }}%
        img(v-if="uploadEnd" :src="downloadURL" width="80%")
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: ''
    }
  },
  methods: {
    selectFiles () {
      this.$refs.uploadInput.click()
    },
    detectFiles (e) {
      const fileList = e.target.files || e.dataTransfer.files
      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x])
      })
    },
    upload (file) {
      this.fileName = file.name
      this.uploading = true
      this.uploadTask = this.$firebase.storage().ref().child('warehouseInfo').child(file.name).put(file)
    },
    deleteImage () {
      this.$firebase.storage().ref().child('warehouseInfo').child(this.fileName).delete()
        .then(() => {
          this.uploading = false
          this.uploadEnd = false
          this.downloadURL = ''
        })
        .catch(e => {
          throw Error(e)
        })
      this.$refs.form.reset()
    },
    save () {
      console.log('save')
    }
  },
  watch: {
    uploadTask () {
      this.uploadTask.on('state_changed', sp => {
        this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
      }, null, () => {
        this.uploadTask.snapshot.ref.getDownloadURL().then(url => {
          this.uploadEnd = true
          this.downloadURL = url
          this.$emit('downloadURL', url)
        })
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.progress-bar
  margin: 10px 0

input[type="file"]
  position: absolute
  clip: rect(0,0,0,0)
</style>
