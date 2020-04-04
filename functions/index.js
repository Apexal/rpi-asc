const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const db = admin.firestore()

/**
 * On user creation, add data for the user in the 'users' collection.
 */
exports.createUserData = functions.auth.user().onCreate(userProfile => {
  // Determine whether the new user is a current student or accepted student
  // If they are a faculty member, they will need this property to be manually assigned to 'faculty'
  const role = userProfile.email.endsWith('@rpi.edu') ? 'current' : 'accepted'

  const data = {
    name: ''
  }

  if (role === 'accepted') {
    // Accepted student
    data.wantToBeContacted = false
    data.inQueue = false
    // data.queueEnterTime = admin.firestore.Timestamp.fromDate(new Date())
    data.currentlyClaimedBy = null
    data.previouslyClaimedBy = []
    data.wantToBeContactedLater = false
    data.contactPlatform = 'none'
    data.contactDetails = ''
    data.topics = ''
    data.contactLaterDate = ''
    data.contactLaterTime = ''
  } else if (role === 'current') {
    data.isAdmin = false
    data.contactPlatforms = {
      phone: false,
      text: false,
      discord: false,
      skype: false,
      zoom: false,
      webex: false,
      wechat: false
    }
  }

  return db
    .collection(role)
    .doc(userProfile.email)
    .set(data)
})

exports.queueCount = functions.https.onRequest((req, res) => {
  return db.collection('accepted')
    .where('inQueue', '==', true)
    .get()
    .then(snap => {
      return res.status(200).send({ length: snap.size })
    })
})
