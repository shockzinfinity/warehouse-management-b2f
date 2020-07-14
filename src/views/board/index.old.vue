<template lang="pug">
  v-card board
    v-card-title board test
    v-data-table(
      :headers="headers"
      :items="items"
      :items-per-page="5"
      :options.sync="options"
      :server-items-length="serverItemsLength"
      must-sort
    )
      template(v-slot:item.id="{ item }")
        v-btn(icon @click="openDialog(item)") <v-icon>mdi-pencil</v-icon>
        v-btn(icon @click="remove(item)") <v-icon>mdi-delete</v-icon>
      template(v-slot:item.createdAt="{ item }") {{ item.createdAt.toLocaleString() }}
    v-card-actions
      //- v-btn(@click="read") <v-icon>mdi-page-next-outline</v-icon>
      v-btn(@click="openDialog(null)") <v-icon>mdi-pencil</v-icon>
    v-dialog(max-width="500" v-model="dialog")
      v-card
        v-form
          v-card-text
            v-text-field(v-model="form.title")
            v-text-field(v-model="form.content")
          v-card-actions
            v-spacer
            v-btn(@click="update" v-if="selectedItem") update
            v-btn(@click="add" v-else) save
</template>

<script>
import { head, last } from 'lodash'

export default {
  data () {
    return {
      headers: [
        { value: 'createdAt', text: '작성일' },
        { value: 'title', text: '제목' },
        { value: 'content', text: '내용' },
        { value: 'id', text: 'Id', sortable: false }
      ],
      items: [],
      form: {
        title: '',
        content: ''
      },
      dialog: false,
      selectedItem: null,
      unsubscribe: null,
      unsubscribeCount: null,
      serverItemsLength: 0,
      options: {
        sortBy: ['createdAt'],
        sortDesc: [true]
      },
      docs: []
    }
  },
  created () {
    // this.read()
  },
  destroyed () {
    if (this.unsubscribe) this.unsubscribe()
    if (this.unsubscribeCount) this.unsubscribeCount()
  },
  watch: {
    options: {
      handler (n, o) {
        // console.log('old', o)
        // console.log('new', n)
        const arrow = n.page - o.page
        this.subscribe(arrow)
      },
      deep: true
    }
  },
  methods: {
    subscribe (arrow) {
      this.unsubscribeCount = this.$firebase.firestore().collection('meta').doc('boards').onSnapshot(doc => {
        if (!doc.exists) return
        this.serverItemsLength = doc.data().count
      })
      const order = head(this.options.sortBy)
      const sort = head(this.options.sortDesc) ? 'desc' : 'asc'
      const limit = this.options.itemsPerPage

      const ref = this.$firebase.firestore().collection('boards').orderBy(order, sort)

      let query
      switch (arrow) {
        case -1: query = ref.endBefore(head(this.docs))
          break
        case 1: query = ref.startAfter(last(this.docs))
          break
        default: query = ref
          break
      }

      if (limit >= 0) {
        query = query.limit(limit)
      } else {
        if (arrow < 0) {
          query = query.limitToLast(limit)
        }
      }

      this.unsubscribe = query
        .onSnapshot(sn => {
          if (sn.empty) {
            this.items = []
            return
          }
          this.docs = sn.docs
          // console.log(head(sn.docs).data())
          // console.log(last(sn.docs).data())
          this.items = sn.docs.map(v => {
            const item = v.data()
            return {
              id: v.id,
              title: item.title,
              content: item.content,
              createdAt: item.createdAt.toDate()
            }
          })
        })
    },
    openDialog (item) {
      this.selectedItem = item
      this.dialog = true
      if (!item) {
        this.form.title = ''
        this.form.content = ''
      } else {
        this.form.title = item.title
        this.form.content = item.content
      }
    },
    add () {
      const item = { ...this.form }
      item.createdAt = new Date()

      this.$firebase
        .firestore()
        .collection('boards')
        .add(item)
      this.dialog = false
    },
    update () {
      this.$firebase
        .firestore()
        .collection('boards')
        .doc(this.selectedItem.id)
        .update(this.form)
      this.dialog = false
    },
    remove (item) {
      this.$firebase
        .firestore()
        .collection('boards')
        .doc(item.id)
        .delete()
    }
  }
}
</script>
