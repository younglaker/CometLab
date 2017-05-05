
<style src="./assets/sass/main.sass" lang="sass"></style>

<template>
  <div id="app" class="container">
    <headers></headers>
    <index></index>
  </div>
</template>

<script>
import Headers from './components/headers'
import Index from './components/index'


export default {
  name: 'app',
  components: {
    Index, Headers
  }
}
</script>

<style>
</style>
