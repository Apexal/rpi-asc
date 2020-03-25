<template>
  <div class="home">
    <div class="jumbotron">
      <h1 class="display-4">Welcome, students!</h1>
      <p class="lead">You will be able to chat 1-on-1 with current RPI students on this site.</p>
    </div>
    <Login />
  </div>
</template>

<script>
import Login from '@/components/Login'

export default {
  name: 'Home',
  components: { Login }
}
</script>
