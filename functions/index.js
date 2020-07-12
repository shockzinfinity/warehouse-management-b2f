const functions = require('firebase-functions')
var admin = require('firebase-admin')

// var serviceAccount = require('./ctk-warehouse-management-firebase-adminsdk-saiw3-72dc70832f.json')
var serviceAccount = require('./warehouse-management-b2f-firebase-adminsdk-agjta-51bbbde243.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: 'https://ctk-warehouse-management.firebaseio.com'
  databaseURL: 'https://warehouse-management-b2f.firebaseio.com'
})

const db = admin.database()

exports.createUser = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user
  const u = {
    email,
    displayName,
    photoURL,
    createdAt: new Date()
  }
  db.ref('users').child(uid).set(u)
})

exports.deleteUser = functions.auth.user().onDelete(async (user) => {
  const { uid } = user
  db.ref('users').child(uid).remove()
})
