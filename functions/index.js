const functions = require('firebase-functions')
var admin = require('firebase-admin')

// for prod
// var serviceAccount = require('./ctk-warehouse-management-firebase-adminsdk-saiw3-72dc70832f.json')

// for dev
var serviceAccount = require('./warehouse-management-b2f-firebase-adminsdk-agjta-51bbbde243.json')

// for prod
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: functions.config().admin.prod.db_url
// })

// for dev
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: functions.config().admin.dev.db_url
})

const db = admin.database()
const fdb = admin.firestore()

exports.createUser = functions.auth.user().onCreate(async user => {
  const { uid, email, displayName, photoURL } = user
  const time = new Date()
  const u = {
    email,
    displayName,
    photoURL,
    createdAt: time,
    // level: email === functions.config().admin.prod.email ? 0 : 5
    level: email === functions.config().admin.dev.email ? 0 : 5
  }
  await fdb.collection('users').doc(uid).set(u)
  u.createdAt = time.getTime()
  await db.ref('users').child(uid).set(u)
})

exports.deleteUser = functions.auth.user().onDelete(async user => {
  const { uid } = user
  await fdb.collection('users').doc(uid).delete()
  await db.ref('users').child(uid).remove()
})

exports.incrementBoardCount = functions.firestore
  .document('boards/{bid}')
  .onCreate(async (snap, context) => {
    try {
      await fdb
        .collection('meta')
        .doc('boards')
        .update('count', admin.firestore.FieldValue.increment(1))
    } catch (e) {
      await fdb
        .collection('meta')
        .doc('boards')
        .set({ count: 1 })
    }
  })

exports.decrementBoardCount = functions.firestore
  .document('boards/{bid}')
  .onDelete(async (snap, context) => {
    await fdb
      .collection('meta')
      .doc('boards')
      .update('count', admin.firestore.FieldValue.increment(-1))
  })
