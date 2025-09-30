<template>
  <div id="app" class="app-layout bg-gray-100">
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
 </template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 6rem; /* Add padding to avoid footer overlap */
}
</style>

<script>
    import Footer from './components/Footer.vue';

    export default {
      name: 'App',
      components: {
        Footer
      },
    };
</script>