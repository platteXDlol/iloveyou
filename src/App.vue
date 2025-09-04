<template>
  <div id="app" class="app-layout">
    <Header />
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
}
</style>



<script>
    import Header from './components/Header.vue';
    import Footer from './components/Footer.vue';

    export default {
      name: 'App',
      components: {
        Header,
        Footer
      },
    };
</script>