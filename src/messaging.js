import firebase from './firebase'

const messaging = firebase.messaging()
messaging.usePublicVapidKey('BJ93TkmJQH9U02Ge5r84TCfA-m2dwWbFttxbPo_mP481N4FJzx7Xyq3-fZ-LLXnsqPFaPHIXx76SgYbNt8oZirw')

messaging.onMessage((payload) => {
  alert(JSON.stringify(payload))
})

export default messaging
