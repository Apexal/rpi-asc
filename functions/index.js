const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'mail.rpi.edu',
  port: 465,
  secure: true,
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password
  }
})

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

exports.updateUser = functions.firestore
  .document('accepted/{email}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data()
    const previousValue = change.before.data()

    if (!previousValue.wantToBeContactedLater && newValue.wantToBeContactedLater) {
      console.log(`Emailing about ${context.params.email}...`)

      const info = await transporter.sendMail({
        from: '"RPI ASC Webapp" <matraf@rpi.edu>',
        to: functions.config().target.email + ', thefrankmatranga@gmail.com',
        subject: 'An Accepted Student wants to be Contacted!',
        html: `
          <b>EMAIL:</b> <a href="mailto:${context.params.email}">${context.params.email}</a>
          <br>
          <b>NAME:</b> <span>${newValue.name || 'Unnamed Student'}</span>
          <br>
          <b>TOPICS:</b> <span>${newValue.topics || 'No discussion topics given!'}</span>
          <br>
          <b>CONTACT:</b> <span>${newValue.contactPlatform || 'No platform given!'} <i>(${newValue.contactDetails})</i></span>
          <br>
          <b>PREFFERRED CONTACT TIME:</b> <span>${newValue.contactLaterDate} <i>(${newValue.contactLaterTime})</i></span>
        `
      })
    }
  })
