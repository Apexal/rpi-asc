<template>
  <div id="app">
    <header>
      <Navbar />
    </header>
    <main class="container">
      <router-view />
    </main>

    <footer></footer>
  </div>
</template>
<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components: { Navbar }
}
</script>
<style lang="scss">
</style>
