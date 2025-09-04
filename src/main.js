import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router'
import { supabase } from './supabase'
import './style.css'

// Create a reactive session object
const session = reactive({
  user: null,
  loading: true,
})

// Set up the auth state change listener
supabase.auth.onAuthStateChange((_event, newSession) => {
  session.user = newSession?.user || null
  session.loading = false
})

// Create and mount the app
const app = createApp(App)

// Provide the session object to all components
app.provide('session', session)

app.use(router)
app.mount('#app')