<template>
  <div id="app" class="app-layout bg-gray-100">
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
  padding-bottom: 6rem;
}
</style>

<script>
    import Footer from './components/Footer.vue';
    import Header from './components/Header.vue';

    export default {
      name: 'App',
      components: {
        Footer,
        Header
      },
    };
</script>