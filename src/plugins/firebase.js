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
// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

let unsubscribe = null
const subscribe = (fu) => {
  const ref = firebase.firestore().collection('users').doc(fu.uid)
  unsubscribe = ref.onSnapshot(doc => {
    if (doc.exists) {
      const user = doc.data()
      store.commit('setUser', user)
      store.commit('setLevel', user.level)
      if (user.level === 0) store.commit('setIsAdmin', user.level === 0)
    }
  }, console.error)
}

firebase.auth().onAuthStateChanged(fu => {
  store.commit('setFireUser', fu)
  // console.log('fire user: ', fu)
  if (!fu) {
    store.commit('setUser', null)
    store.commit('setIsAdmin', false)
    store.commit('setEdit', false)
    store.commit('setLevel', 9)
    if (unsubscribe) unsubscribe()
    return
  }
  subscribe(fu)
})

Vue.prototype.$firebase = firebase
