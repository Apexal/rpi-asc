<template>
  <div class="home">
    <div class="jumbotron">
      <h1 class="display-4">Welcome, students!</h1>
      <p class="lead">You will be able to chat 1-on-1 with current RPI students on this site.</p>
    </div>
    <div class="row">
      <div class="col">
        <AcceptedLogin @rpi-login="rpiEmail = arguments[0]" />
      </div>
      <div class="col">
        <RPILogin :email="rpiEmail" />
      </div>
    </div>
  </div>
</template>

<script>
import RPILogin from '@/components/RPILogin'
import AcceptedLogin from '@/components/AcceptedLogin'

export default {
  name: 'Home',
  components: { RPILogin, AcceptedLogin },
  data () {
    return {
      rpiEmail: ''
    }
  }
}
</script>
