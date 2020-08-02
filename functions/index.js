const functions = require('firebase-functions')
var admin = require('firebase-admin')

// for prod
// var serviceAccount = require('./ctk-warehouse-management-firebase-adminsdk-saiw3-72dc70832f.json')

// for dev
var serviceAccount = require('./warehouse-management-b2f-firebase-adminsdk-agjta-51bbbde243.json')

// for prod
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: functions.config().admin.prod.db_url,
//   storageBucket: functions.config().admin.prod.bucket_url
// })

// for dev
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: functions.config().admin.dev.db_url,
  storageBucket: functions.config().admin.dev.bucket_url,
})

// region
const region = functions.config().admin.region || 'us-central1'

const rdb = admin.database()
const fdb = admin.firestore()

exports.createUser = functions
  .region(region)
  .auth.user()
  .onCreate(async user => {
    const { uid, email, displayName, photoURL } = user
    const time = new Date()
    const u = {
      email,
      displayName,
      photoURL,
      createdAt: time,
      // level: email === functions.config().admin.prod.email ? 0 : 5
      level: email === functions.config().admin.dev.email ? 0 : 5,
      visitedAt: time,
      visitCount: 0,
    }
    await fdb
      .collection('users')
      .doc(uid)
      .set(u)
    u.createdAt = time.getTime()
    await rdb
      .ref('users')
      .child(uid)
      .set(u)

    try {
      await fdb
        .collection('meta')
        .doc('users')
        .update({ count: admin.firestore.FieldValue.increment(1) })
    } catch (e) {
      await fdb
        .collection('meta')
        .doc('users')
        .set({ count: 1 })
    }
  })

exports.deleteUser = functions
  .region(region)
  .auth.user()
  .onDelete(async user => {
    const { uid } = user
    await fdb
      .collection('users')
      .doc(uid)
      .delete()
    await rdb
      .ref('users')
      .child(uid)
      .remove()
    await fdb
      .collection('meta')
      .doc('users')
      .update({ count: admin.firestore.FieldValue.increment(-1) })
  })

exports.onCreateBoard = functions
  .region(region)
  .firestore.document('boards/{bid}')
  .onCreate(async (snap, context) => {
    try {
      await fdb
        .collection('meta')
        .doc('boards')
        .update({ count: admin.firestore.FieldValue.increment(1) })
    } catch (e) {
      await fdb
        .collection('meta')
        .doc('boards')
        .set({ count: 1 })
    }
  })

exports.onDeleteBoard = functions
  .region(region)
  .firestore.document('boards/{bid}')
  .onDelete(async (snap, context) => {
    await fdb
      .collection('meta')
      .doc('boards')
      .update({ count: admin.firestore.FieldValue.increment(-1) })
    const batch = fdb.batch()
    const sn = await fdb
      .collection('boards')
      .doc(context.params.bid)
      .collection('articles')
      .get()
    sn.docs.forEach(doc => batch.delete(doc.ref))
    await batch.commit()
  })

exports.onCreateBoardArticle = functions
  .region(region)
  .firestore.document('boards/{bid}/articles/{aid}')
  .onCreate((snap, context) => {
    const set = {
      count: admin.firestore.FieldValue.increment(1),
    }
    const doc = snap.data()
    if (doc.category)
      set.categories = admin.firestore.FieldValue.arrayUnion(doc.category)

    if (doc.tags.length)
      set.tags = admin.firestore.FieldValue.arrayUnion(...doc.tags)

    return fdb
      .collection('boards')
      .doc(context.params.bid)
      .update(set)
  })

exports.onUpdateBoardArticle = functions
  .region(region)
  .firestore.document('/boards/{bid}/articles/{aid}')
  .onUpdate((change, context) => {
    const set = {}
    const doc = change.after.data()
    if (doc.category)
      set.categories = admin.firestore.FieldValue.arrayUnion(doc.category)
    if (doc.tags.length)
      set.tags = admin.firestore.FieldValue.arrayUnion(...doc.tags)
    if (!Object.keys(set).length) return false
    return fdb
      .collection('boards')
      .doc(context.params.bid)
      .update(set)
  })

exports.onDeleteBoardArticle = functions
  .region(region)
  .firestore.document('boards/{bid}/articles/{aid}')
  .onDelete(async (snap, context) => {
    await fdb
      .collection('boards')
      .doc(context.params.bid)
      .update({ count: admin.firestore.FieldValue.increment(-1) })
      .catch(e => console.error('boards update error: ' + e.message))

    try {
      // remove comment
      const batch = fdb.batch()
      const sn = await fdb
        .collection('boards')
        .doc(context.params.bid)
        .collection('articles')
        .doc(context.params.aid)
        .collection('comments')
        .get()
      sn.docs.forEach(doc => batch.delete(doc.ref))
      await batch.commit()
    } catch (e) {
      console.error('comment remove error: ' + e.message)
    }

    // remove storage
    const ps = []
    ps.push('boards')
    ps.push(context.params.bid)
    ps.push(context.params.aid + '-' + snap.data().uid + '.md')

    await admin
      .storage()
      .bucket()
      .file(ps.join('/'))
      .delete()
      .catch(e => console.error('storage remove error: ' + e.message))
  })

exports.onCreateBoardComment = functions
  .region(region)
  .firestore.document('boards/{bid}/articles/{aid}/comments/{cid}')
  .onCreate((snap, context) => {
    return fdb
      .collection('boards')
      .doc(context.params.bid)
      .collection('articles')
      .doc(context.params.aid)
      .update({ commentCount: admin.firestore.FieldValue.increment(1) })
  })

exports.onDeleteBoardComment = functions
  .region(region)
  .firestore.document('boards/{bid}/articles/{aid}/comments/{cid}')
  .onDelete((snap, context) => {
    return fdb
      .collection('boards')
      .doc(context.params.bid)
      .collection('articles')
      .doc(context.params.aid)
      .update({ commentCount: admin.firestore.FieldValue.increment(-1) })
  })

// racks
exports.onCreateRack = functions
  .region(region)
  .firestore.document('racks/{rid}')
  .onCreate(async (snap, context) => {
    try {
      await fdb
        .collection('meta')
        .doc('racks')
        .update({ count: admin.firestore.FieldValue.increment(1) })
    } catch (e) {
      await fdb
        .collection('meta')
        .doc('racks')
        .set({ count: 1 })
    }
  })

exports.onDeleteRack = functions
  .region(region)
  .firestore.document('racks/{rid}')
  .onDelete(async (snap, context) => {
    await fdb
      .collection('meta')
      .doc('racks')
      .update({ count: admin.firestore.FieldValue.increment(-1) })

    // cover image, qr code 삭제
    await admin
      .storage()
      .bucket()
      .deleteFiles({ prefix: `racks/${context.params.rid}` })
      .catch(e => console.error('storage remove error: ' + e.message))
  })

// box
exports.onCreateBox = functions
  .region(region)
  .firestore.document('boxes/{bid}')
  .onCreate(async (snap, context) => {
    try {
      await fdb
        .collection('meta')
        .doc('boxes')
        .update({ count: admin.firestore.FieldValue.increment(1) })
    } catch (e) {
      await fdb
        .collection('meta')
        .doc('boxes')
        .set({ count: 1 })
    }

    // 상위 랙 box count 증가
    const box = await fdb
      .collection('boxes')
      .doc(context.params.bid)
      .get()
    const parentRackId = await box.data().parentRackId
    const sn = await fdb
      .collection('racks')
      .where('rackId', '==', parentRackId)
      .get()
    if (!sn.empty) {
      const rack = sn.docs[0].id
      try {
        await fdb
          .collection('racks')
          .doc(rack)
          .update({ boxCount: admin.firestore.FieldValue.increment(1) })
      } catch (e) {
        await fdb
          .collection('racks')
          .doc(rack)
          .set({ boxCount: 1 })
      }
    }
  })

exports.onDeleteBox = functions
  .region(region)
  .firestore.document('boxes/{bid}')
  .onDelete(async (snap, context) => {
    await fdb
      .collection('meta')
      .doc('boxes')
      .update({ count: admin.firestore.FieldValue.increment(-1) })

    await admin
      .storage()
      .bucket()
      .deleteFiles({ prefix: `boxes/${context.params.bid}` })
      .catch(e => console.error('storage remove error: ' + e.message))

    const batch = fdb.batch()

    const deletedValue = snap.data()
    const rackSn = await fdb
      .collection('racks')
      .where('rackId', '==', deletedValue.parentRackId)
      .get()
    if (!rackSn.empty) {
      const rack = rackSn.docs[0].id
      batch.update(fdb.collection('racks').doc(rack), {
        boxCount: admin.firestore.FieldValue.increment(-1),
      })
    }
    const sn = await fdb
      .collection('boxes')
      .doc(context.params.bid)
      .collection('samples')
      .get()
    sn.docs.forEach(doc => batch.delete(doc.ref))
    await batch.commit()

    // remove storage (context, cover, qr)
    await admin
      .storage()
      .bucket()
      .deleteFiles({ prefix: `boxes/${context.params.bid}` })
      .catch(e => console.error('storage remove error: ' + e.message))
  })

exports.onCreateBoxSample = functions
  .region(region)
  .firestore.document('boxes/{bid}/samples/{sid}')
  .onCreate(async (snap, context) => {
    try {
      await fdb
        .collection('meta')
        .doc('samples')
        .update({ count: admin.firestore.FieldValue.increment(1) })
    } catch (e) {
      await fdb
        .collection('meta')
        .doc('samples')
        .set({ count: 1 })
    }

    // 상위 랙 sample SKU 증가
    const box = await fdb
      .collection('boxes')
      .doc(context.params.bid)
      .get()
    const parentRackId = await box.data().parentRackId
    const sn = await fdb
      .collection('racks')
      .where('rackId', '==', parentRackId)
      .get()
    if (!sn.empty) {
      const rack = sn.docs[0].id
      try {
        await fdb
          .collection('racks')
          .doc(rack)
          .update({ sampleSKU: admin.firestore.FieldValue.increment(1) })
      } catch (e) {
        await fdb
          .collection('racks')
          .doc(rack)
          .set({ sampleSKU: 1 })
      }
    }

    const set = {
      sampleCount: admin.firestore.FieldValue.increment(1),
    }

    const doc = snap.data()
    if (doc.category)
      set.categories = admin.firestore.FieldValue.arrayUnion(doc.category)
    if (doc.tags) set.tags = admin.firestore.FieldValue.arrayUnion(...doc.tags)

    return fdb
      .collection('boxes')
      .doc(context.params.bid)
      .update(set)
  })

exports.onUpdateBoardArticle = functions
  .region(region)
  .firestore.document('boxes/{bid}/samples/{sid}')
  .onUpdate((change, context) => {
    const set = {}
    const doc = change.after.data()
    if (doc.category)
      set.categories = admin.firestore.FieldValue.arrayUnion(doc.category)
    if (doc.tags.length)
      set.tags = admin.firestore.FieldValue.arrayUnion(...doc.tags)
    if (!Object.keys(set).length) return false
    return fdb
      .collection('boxes')
      .doc(context.params.bid)
      .update(set)
  })

exports.onDeleteBoxSample = functions
  .region(region)
  .firestore.document('boxes/{bid}/samples/{sid}')
  .onDelete(async (snap, context) => {
    await fdb
      .collection('boxes')
      .doc(context.params.bid)
      .update({ sampleCount: admin.firestore.FieldValue.increment(-1) })
      .catch(e => console.error('box update error: ' + e.message))

    await fdb
      .collection('meta')
      .doc('samples')
      .update({ count: admin.firestore.FieldValue.increment(-1) })

    try {
      // remove comment
      const batch = fdb.batch()
      const sn = await fdb
        .collection('boxes')
        .doc(context.params.bid)
        .collection('samples')
        .doc(context.params.sid)
        .collection('comments')
        .get()
      sn.docs.forEach(doc => batch.delete(doc.ref))
      await batch.commit()
    } catch (e) {
      console.error('comment remove error: ' + e.message)
    }

    try {
      // remove history
      const batch = fdb.batch()
      const sn = await fdb
        .collection('boxes')
        .doc(context.params.bid)
        .collection('samples')
        .doc(context.params.sid)
        .collection('histories')
        .get()
      sn.docs.forEach(doc => batch.delete(doc.ref))
      await batch.commit()
    } catch (e) {
      console.error('history remove error: ' + e.message)
    }

    // rack update
    // TODO: 이 시점에 box 가 이미 사라져있을수 있음
    // 고로, onDeleteBox 단에서 sampleCount 만큼 상위 랙에 (-) 업데이트
    const box = await fdb
      .collection('boxes')
      .doc(context.params.bid)
      .get()
    const parentRackId = await box.data().parentRackId
    const rackSn = await fdb
      .collection('racks')
      .where('rackId', '==', parentRackId)
      .get()
    if (!rackSn.empty) {
      const rack = rackSn.docs[0].id
      fdb
        .collection('racks')
        .doc(rack)
        .update({ sampleSKU: admin.firestore.FieldValue.increment(-1) })
    }

    // remove sample context
    // const ps1 = []
    // ps1.push('boxes')
    // ps1.push(context.params.bid)
    // ps1.push(context.params.sid + '-' + snap.data().uid + '.md')
    // await admin
    //   .storage()
    //   .bucket()
    //   .file(ps1.join('/'))
    //   .delete()
    //   .catch(e => console.error('storage remove error: ' + e.message))

    // remove sample qr
    // const ps2 = []
    // ps2.push('samples')
    // ps2.push(context.params.sid)
    // ps2.push(context.params.sid + '.qr.png')
    // await admin
    //   .storage()
    //   .bucket()
    //   .file(ps2.join('/'))
    //   .delete()
    //   .catch(e => console.error('storage remove error: ' + e.message))

    // remove sample cover
    // const ps3 = []
    // ps3.push('samples')
    // ps3.push(context.params.bid)
    // ps3.push(context.params.sid + '-' + snap.data().uid + '.md')
    // await admin
    //   .storage()
    //   .bucket()
    //   .file(ps3.join('/'))
    //   .delete()
    //   .catch(e => console.error('storage remove error: ' + e.message))

    // remove storage (context, cover, qr)
    await admin
      .storage()
      .bucket()
      .deleteFiles({ prefix: `samples/${context.params.sid}` })
      .catch(e => console.error('storage remove error: ' + e.message))
  })

exports.onCreateSampleComment = functions
  .region(region)
  .firestore.document('boxes/{bid}/samples/{sid}/comments/{cid}')
  .onCreate((snap, context) => {
    return fdb
      .collection('boxes')
      .doc(context.params.bid)
      .collection('samples')
      .doc(context.params.sid)
      .update({ commentCount: admin.firestore.FieldValue.increment(1) })
  })

exports.onDeleteSampleComment = functions
  .region(region)
  .firestore.document('boxes/{bid}/samples/{sid}/comments/{cid}')
  .onDelete(async (snap, context) => {
    const doc = await fdb
      .collection('boxes')
      .doc(context.params.bid)
      .collection('samples')
      .doc(context.params.sid)
      .get()
    if (doc.exists) {
      await fdb
        .collection('boxes')
        .doc(context.params.bid)
        .collection('samples')
        .doc(context.params.sid)
        .update({ commentCount: admin.firestore.FieldValue.increment(-1) })
    }
  })
