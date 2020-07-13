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

firebase.auth().onAuthStateChanged(fu => {
  // console.log('fire user: ', fu)
  store.commit('setFireUser', fu)
})
Vue.prototype.$firebase = firebase
