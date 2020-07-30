<template lang="pug">
  v-container(fluid fill-height)
    v-layout(align-center justify-center)
      validation-observer(ref="obs" v-slot="{ invalid, validated, passes, validate }")
        v-form
          v-card.elevation-12(:loading="loading")
            v-toolbar(color="accent" dense flat dark)
              v-toolbar-title modify warehouse informations
              v-spacer
              //- v-btn(icon @click="test") <v-icon>mdi-test-tube</v-icon>
              v-btn(icon @click="$router.push('/warehouse')") <v-icon>mdi-arrow-left</v-icon>
              v-btn(icon @click="save" :disabled="!$store.state.isAdmin") <v-icon>mdi-content-save</v-icon>
            v-card-subtitle.pb-0 cover image
            v-row
              v-col(cols="12")
                v-img.mx-auto(v-if="!uploading && !uploadEnd && !downloadURL" :src="info.coverUrl" max-width="600px")
                v-card-text.text-center {{ fileName }}
                v-progress-circular.mx-auto(
                  v-if="uploading && !uploadEnd"
                  :size="80" :width="15" :rotate="360" :value="progressUpload" color="primary"
                ) {{ progressUpload }}%
                v-img.mx-auto(v-if="uploadEnd" :src="downloadURL" max-width="600px")
                v-card-actions
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
            v-card-text
              v-text-field-with-validation(rules="required|max:50" v-model="info.title" :counter="50" outlined label="창고명")
              v-textarea(v-model="info.description" outlined label="설명")
              v-text-field-with-validation(rules="required|max:100" v-model="info.address" :counter="100" outlined label="주소")
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import VTextFieldWithValidation from '@/components/inputs/VTextFieldWithValidation'
import VSelectWithValidation from '@/components/inputs/VSelectWithValidation'

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    VTextFieldWithValidation,
    VSelectWithValidation
  },
  data () {
    return {
      loading: false,
      progressUpload: 0,
      fileName: '',
      uploadTask: '',
      uploading: false,
      uploadEnd: false,
      downloadURL: '',
      info: {
        title: '',
        description: '',
        address: '',
        fileName: '',
        coverUrl: ''
      }
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
          this.fileName = ''
          this.downloadURL = ''
        })
        .catch(e => {
          throw Error(e)
        })
      this.$refs.form.reset()
    },
    subscribe () {
      this.$firebase.database().ref().child('warehouseInfo').on('value', sn => {
        const w = sn.val()
        if (!w) {
          this.$firebase.database().ref().child('warehouseInfo').set(this.info)
          return
        }
        this.info = w
      }, e => {
        console.log(e.message)
      })
    },
    async save () {
      // console.log('save')
      try {
        this.loading = true

        if (this.info.fileName) {
          this.$firebase.storage().ref().child('warehouseInfo').child(this.info.fileName).delete()
            .then(() => {
            })
            .catch(e => {
              throw Error(e)
            })
        }
        this.info.coverUrl = this.downloadURL
        this.info.fileName = this.fileName
        
        await this.$firebase.database().ref().child('warehouseInfo').set(this.info)
      } finally {
        this.loading = false
        this.$router.push('/warehouse')
      }
    },
    async test () {
      const result = await this.$refs.obs.validate()
      console.log(result)
    }
  },
  created () {
    this.subscribe()
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
