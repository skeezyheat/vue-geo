<template>
  <div id="app">
    <Navbar />
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';
export default {
  name: 'App',
  components: {
    Navbar
  }
};
</script>

<style lang="scss">
body {
  background-color: #f1f1f1;
}
</style>
