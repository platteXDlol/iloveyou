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

    import { supabase } from './supabase';

    export default {
      name: 'App',
      components: {
        Header,
        Footer
      },
      data() {
        return {
          session: null
        }
      },
      mounted() {
        supabase.auth.getSession().then(({ data }) => {
          this.session = data.session;
        });
      supabase.auth.onAuthStateChange((_event, session) => {
        this.session = session;
      });
    }
  };
</script>