<template>
  <div id="app">
    <header>
      <Navbar />
    </header>
    <main class="container mt-5">
      <Alerts />
      <router-view />
    </main>

    <footer></footer>
  </div>
</template>
<script>
import Navbar from '@/components/Navbar'
import Alerts from '@/components/Alerts'

export default {
  name: 'App',
  components: { Navbar, Alerts }
}
</script>
<style lang="scss">
</style>
