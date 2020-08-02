<template lang="pug">
  v-container(fluid :class="$vuetify.breakpoint.xs ? 'pa-0' : ''")
    v-card(v-if="sample" outlined)
      v-toolbar(color="transparent" dense flat)
        v-toolbar-title
          v-chip.mr-4(color="info" label) 포함박스
        | {{ sample.title }}
        v-spacer
        template(v-if="(fireUser && fireUser.uid === sample.uid) || (user && user.level === 0)")
          v-btn(@click="sampleWrite" icon) <v-icon>mdi-pencil</v-icon>
          v-btn(@click="remove" icon) <v-icon>mdi-delete</v-icon>
        v-btn(@click="back" icon) <v-icon>mdi-close</v-icon>
      v-divider
      v-card-actions
        v-row.no-gutters(justify="center" align="center")
          v-col.pb-2(lg="6" cols="sm")
            v-img.mx-auto(:src="sample.qrCodeUrl" max-width="200px")
          v-col.pb-2(lg="6" cols="sm")
            v-row.no-gutters
              v-text-field(type="number" v-model="stockInOut" flat dense outlined label="Current stock")
              v-btn(icon @click="incomming") <v-icon>mdi-basket-fill</v-icon>
              v-btn(icon @click="outcomming") <v-icon>mdi-basket-unfill</v-icon>
      v-divider
      v-card-text Description
        viewer(v-if="content" :initialValue="content")
        v-container(v-else)
          v-row(justify="center" align="center")
            v-progress-circular(indeterminate)
      v-card-actions
        v-spacer
        span.font-italic.caption 등록일: <display-time :time="sample.createdAt"></display-time>
      v-card-actions
        v-spacer
        span.font-italic.caption 수정일: <display-time :time="sample.updatedAt"></display-time>
      v-card-actions
        v-spacer
        span.font-italic.caption.mr-2 등록자:
        display-user(:user="sample.user")
      v-card-actions
        v-spacer
        v-sheet.mr-4
          v-icon(left) mdi-eye
          span.body-2 {{ sample.readCount }}
        v-sheet.mr-0
          v-icon(left) mdi-comment
          span.body-2 {{ sample.commentCount }}
        v-btn(text @click="like") <v-icon :color="liked ? 'success' : ''">mdi-thumb-up</v-icon> <span>{{ sample.likeCount }}</span>
      v-divider
      v-card-actions.py-0
        v-row.no-gutters
          v-col(cols="4")
            v-btn(text block color="primary" @click="go(-1)") <v-icon left>mdi-arrow-left-bold-circle-outline</v-icon> 이전
          v-col.d-flex(cols="4")
            v-divider(vertical)
            v-btn(text block color="primary" @click="back") <v-icon>mdi-format-list-bulleted-square</v-icon> 목록
            v-divider(vertical)
          v-col(cols="4")
            v-btn(text block color="primary" @click="go(1)") 다음 <v-icon right>mdi-arrow-right-bold-circle-outline</v-icon>
      v-divider
      display-history(:docRef="ref")
      v-divider
      display-comment(:article="sample" :docRef="ref")
    v-card(v-else)
      v-container
        v-row(justify="center" align="center")
          v-progress-circular(indeterminate)
</template>

<script>
import axios from 'axios'
import DisplayTime from '@/components/display-time'
import DisplayComment from '@/components/display-comment'
import DisplayHistory from '@/components/display-history'
import DisplayUser from '@/components/display-user'

export default {
  components: {
    DisplayTime,
    DisplayComment,
    DisplayHistory,
    DisplayUser,
  },
  props: ['boxId', 'sampleId'],
  data() {
    return {
      content: '',
      ref: null,
      unsubscribe: null,
      sample: null,
      stockInOut: 0,
      doc: null,
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    fireUser() {
      return this.$store.state.fireUser
    },
    liked() {
      if (!this.fireUser) return false
      return this.sample.likeUids.includes(this.fireUser.uid)
    },
  },
  watch: {
    sampleId() {
      this.subscribe()
    },
  },
  created() {
    this.subscribe()
  },
  destroyed() {
    if (this.unsubscribe) this.unsubscribe()
  },
  methods: {
    subscribe() {
      if (this.unsubscribe) this.unsubscribe()
      this.ref = this.$firebase
        .firestore()
        .collection('boxes')
        .doc(this.boxId)
        .collection('samples')
        .doc(this.sampleId)

      this.ref.update({
        readCount: this.$firebase.firestore.FieldValue.increment(1),
      })

      this.unsubscribe = this.ref.onSnapshot(
        doc => {
          if (!doc.exists) {
            this.back()
            return
          }
          this.doc = doc
          const item = doc.data()
          item.createdAt = item.createdAt.toDate()
          item.updatedAt = item.updatedAt.toDate()
          if (!this.sample || this.sample.url !== item.url) this.fetch(item.url)
          this.sample = item
          this.stockInOut = this.sample.currentStock
        },
        e => {
          throw Error(e.message)
        }
      )
    },
    async fetch(url) {
      this.content = ''
      const r = await axios.get(url)
      this.content = typeof r.data === 'string' ? r.data : r.data.toString()
    },
    async sampleWrite() {
      this.$router.push({ path: this.$route.path, query: { action: 'write' } })
    },
    async remove() {
      await this.ref.delete()
    },
    back() {
      const us = this.$route.path.split('/')
      us.pop()
      this.$router.push({ path: us.join('/') })
    },
    async incomming() {
      if (this.stockInOut <= 0) {
        return
      }
      const history = {
        actionTime: new Date(),
        type: 'in',
        amount: this.stockInOut,
        user: {
          email: this.user.email,
          photoURL: this.user.photoURL,
          displayName: this.user.displayName,
        },
      }
      const id = history.actionTime.getTime().toString()
      const batch = this.$firebase.firestore().batch()
      batch.set(this.ref.collection('histories').doc(id), history)
      batch.update(this.ref, {
        currentStock: this.$firebase.firestore.FieldValue.increment(
          parseInt(this.stockInOut)
        ),
      })
      await batch.commit()
    },
    async outcomming() {
      if (this.stockInOut <= 0) {
        return
      }
      const out = this.currentStock - this.stockInOut
      if (out < 0) {
        throw Error('insufficient stock')
      }
      const history = {
        actionTime: new Date(),
        type: 'out',
        amount: this.stockInOut,
        user: {
          email: this.user.email,
          photoURL: this.user.photoURL,
          displayName: this.user.displayName,
        },
      }
      const id = history.actionTime.getTime().toString()
      const batch = this.$firebase.firestore().batch()

      batch.set(this.ref.collection('histories').doc(id), history)
      batch.update(this.ref, {
        currentStock: this.$firebase.firestore.FieldValue.increment(
          -parseInt(this.stockInOut)
        ),
      })
      await batch.commit()
    },
    async like() {
      if (!this.fireUser) throw Error('로그인이 필요합니다')
      if (this.liked) {
        await this.ref.update({
          likeCount: this.$firebase.firestore.FieldValue.increment(-1),
          likeUids: this.$firebase.firestore.FieldValue.arrayRemove(
            this.fireUser.uid
          ),
        })
      } else {
        await this.ref.update({
          likeCount: this.$firebase.firestore.FieldValue.increment(1),
          likeUids: this.$firebase.firestore.FieldValue.arrayUnion(
            this.fireUser.uid
          ),
        })
      }
    },
    async go(arrow) {
      if (!this.doc) throw Error('데이터를 가져올 수 없습니다')
      const ref = this.$firebase
        .firestore()
        .collection('boxes')
        .doc(this.boxId)
        .collection('samples')
        .orderBy('createdAt', 'desc')

      let sn
      if (arrow < 0) {
        sn = await ref
          .endBefore(this.doc)
          .limitToLast(1)
          .get()
      } else {
        sn = await ref
          .startAfter(this.doc)
          .limit(1)
          .get()
      }

      if (sn.empty) throw Error('더 이상 없습니다')
      const doc = sn.docs[0]

      const us = this.$route.path.split('/')
      us.pop()
      us.push(doc.id)
      this.$router.push({ path: us.join('/') })
    },
  },
}
</script>
