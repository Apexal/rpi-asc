const functions = require('firebase-functions')

/**
 * On user creation, add data for the user in the 'users' collection.
 */
exports.createUserData = functions.auth.user().onCreate(userProfile => {
  // Determine whether the new user is a current student or accepted student
  // If they are a faculty member, they will need this property to be manually assigned to 'faculty'
  const data = {
    role: userProfile.email.endsWith('@rpi.edu') ? 'current' : 'accepted'
  }

  // If they are an accepted students, set some defaults
  if (data.role === 'accepted') {
    data.wantToTalk = true
    data.currentlyClaimedBy = null
    data.claimedBy = []
  }

  return db
    .collection('users')
    .doc(userProfile.email)
    .set(data)
})
