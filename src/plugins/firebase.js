import Vue from 'vue'
import * as firebase from 'firebase/app'
import store from '@/store'

import 'firebase/auth'
import 'firebase/firebase-database'
import 'firebase/firebase-firestore'
import 'firebase/firebase-storage'

// for prod
// import firebaseConfig from '../../firebaseConfig.prod'

// for dev
import firebaseConfig from '../../firebaseConfig.dev'

firebase.initializeApp(firebaseConfig)

let unsubscribe = null
const subscribe = (fu) => {
  const ref = firebase.firestore().collection('users').doc(fu.uid)
  unsubscribe = ref.onSnapshot(doc => {
    if (doc.exists) store.commit('setUser', doc.data())
  }, console.error)
}

firebase.auth().onAuthStateChanged(fu => {
  // console.log('fire user: ', fu)
  store.commit('setFireUser', fu)
  if (!fu) {
    store.commit('setUser', null)
    if (unsubscribe) unsubscribe()
    return
  }
  subscribe(fu)
})
Vue.prototype.$firebase = firebase
