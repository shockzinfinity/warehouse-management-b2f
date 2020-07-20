<template lang="pug">
  v-container(fluid)  
    v-form
      v-card(:loading="loading")
        v-toolbar(color="accent" dense flat dark)
          v-toolbar-title 샘플 정보 작성
          v-spacer
          v-btn(icon @click="$router.push('/box/' + document)") <v-icon>mdi-arrow-left</v-icon>
          v-btn(icon @click="save") <v-icon>mdi-content-save</v-icon>
        v-card-text
          .display-1 포함되어 있는 박스 : 
            v-chip.ma-4(large color="accent") {{ document }} ( {{ form.parentBoxId }} )
          v-text-field(v-model="form.title" outlined label="이름")
          editor(v-if="!sampleId" :initialValue="form.content" ref="editor" initialEditType="wysiwyg" :options="{ hideModeSwitch: true }")
          template(v-else)
            editor(v-if="form.content" :initialValue="form.content" initialEditType="wysiwyg" :options="{ hideModeSwitch: true }")
            v-container(v-else)
              v-row(justify="center" align="center")
                v-progress-circular(indeterminate)
</template>

<script>
import axios from 'axios'

export default {
  props: ['document', 'action'],
  data () {
    return {
      unsubscribe: null,
      form: {
        parentBoxId: '',
        title: '',
        content: '',
        currentStock: 0
      },
      loading: false,
      exists: false,
      ref: null,
      parentRackId: ''
    }
  },
  computed: {
    sampleId () {
      return this.$route.query.sampleId
    },
    boxId () {
      return this.$route.query.boxId
    },
    user () {
      return this.$store.state.user
    }
  },
  mounted () {
    this.form.parentBoxId = this.boxId
  },
  watch: {
    document () {
      this.subscribe()
    }
  },
  created () {
    this.fetch()
  },
  destroyed () {
  },
  methods: {
    async fetch () {
      this.ref = this.$firebase.firestore().collection('boxes').doc(this.document)

      this.ref.get().then(doc => {
        if (!doc.empty) {
          // console.log('box', doc.data())
          const item = doc.data()
          this.form.parentBoxId = item.boxId
          this.parentRackId = item.parentRackId
        }
      })

      if (!this.sampleId) return
      const doc = await this.ref.collection('samples').doc(this.sampleId).get()
      this.exists = doc.exists
      if (!this.exists) return
      const item = doc.data()
      this.form.title = item.title
      this.parentRackId = item.parentRackId
      const { data } = await axios.get(item.url)
      this.form.content = data
    },
    async save () {
      this.loading = true
      try {
        const createdAt = new Date()
        const id = createdAt.getTime().toString()
        const md = this.$refs.editor.invoke('getMarkdown')
        const sn = await this.$firebase.storage().ref().child('boxes').child(this.document).child(id + '.md').putString(md)
        const url = await sn.ref.getDownloadURL()
        const doc = {
          title: this.form.title,
          updatedAt: createdAt,
          url
        }

        let rackTitle
        if (this.parentRackId) {
          const temp = await this.$firebase.firestore().collection('racks').where('rackId', '==', this.parentRackId).get()

          if (!temp.empty) {
            rackTitle = temp.docs[0].data().title
          }
        }

        const batch = await this.$firebase.firestore().batch()

        if (!this.sampleId) {
          doc.createdAt = createdAt
          doc.commentCount = 0
          doc.readCount = 0
          doc.uid = this.$store.state.fireUser.uid
          doc.user = {
            email: this.user.email,
            photoURL: this.user.photoURL,
            displayName: this.user.displayName
          }
          batch.set(this.ref.collection('samples').doc(id), doc)
          batch.update(this.ref, { sampleCount: this.$firebase.firestore.FieldValue.increment(1) })

          // console.log('racktitle', rackTitle)
          if (rackTitle && this.parentRackId) {
            batch.update(this.$firebase.firestore().collection('racks').doc(rackTitle), { sampleSKU: this.$firebase.firestore.FieldValue.increment(1) })
          }
        } else {
          batch.update(this.ref.collection('samples').doc(this.sampleId), doc)
        }

        await batch.commit()
      } finally {
        this.loading = false
        this.$router.push('/box/' + this.document)
      }
    }
  }
}
</script>
