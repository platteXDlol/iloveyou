<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-pink-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
      <h2 class="text-2xl font-bold text-center text-purple-700 mb-2">Login</h2>
      
      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
        {{ errorMessage }}
      </div>
      

      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div>
          <input 
            type="text" 
            placeholder="Benutzername oder E-Mail" 
            v-model="loginInput" 
            :class="[
              'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400',
              fieldErrors.loginInput ? 'border-red-400' : 'border-gray-300'
            ]"
          />
          <p v-if="fieldErrors.loginInput" class="text-red-500 text-xs mt-1">{{ fieldErrors.loginInput }}</p>
        </div>
        
        <div>
          <input 
            type="password" 
            placeholder="Dein Passwort" 
            v-model="password" 
            :class="[
              'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400',
              fieldErrors.password ? 'border-red-400' : 'border-gray-300'
            ]"
          />
          <p v-if="fieldErrors.password" class="text-red-500 text-xs mt-1">{{ fieldErrors.password }}</p>
        </div>
        
        <div class="flex gap-3 mt-2">
          <button 
            type="submit" 
            :disabled="loading" 
            class="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span v-if="!loading">Anmelden</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Anmeldung...
            </span>
          </button>
        </div>
      </form>
      
      <div class="text-center">
        <p class="text-gray-600 text-sm">
          Noch kein Konto? 
          <router-link to="/register" class="text-purple-600 hover:text-purple-800 font-semibold">Hier registrieren</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const router = useRouter()

const loginInput = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const fieldErrors = ref({})

function validateForm() {
  const errors = {}
  
  if (!loginInput.value.trim()) {
    errors.loginInput = 'Benutzername oder E-Mail ist erforderlich'
  }
  
  if (!password.value) {
    errors.password = 'Passwort ist erforderlich'
  }
  
  fieldErrors.value = errors
  return Object.keys(errors).length === 0
}

function isEmail(input) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
}

async function getEmailFromUsername(username) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      user_id,
      users:auth.users!inner(email)
    `)
    .eq('user_name', username)
    .single()
  
  if (error) {
    throw new Error('Benutzername nicht gefunden')
  }
  
  return data.users.email
}

async function handleLogin() {
  errorMessage.value = ''
  
  if (!validateForm()) {
    return
  }
  
  try {
    loading.value = true
    
    let email = loginInput.value
    
    // If input is not an email, look up the email by username
    if (!isEmail(loginInput.value)) {
      email = await getEmailFromUsername(loginInput.value)
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password.value,
    })
    
    if (error) throw error
    
    // Successful login - redirect to dashboard or home
    router.push('/dashboard') // Change this to your desired route
    
  } catch (error) {
    console.error('Login error:', error)
    
    // Handle specific errors
    if (error.message.includes('Invalid login credentials')) {
      errorMessage.value = 'Ungültige Anmeldedaten'
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage.value = 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse'
    } else if (error.message.includes('Benutzername nicht gefunden')) {
      errorMessage.value = 'Benutzername oder E-Mail nicht gefunden'
    } else {
      errorMessage.value = error.error_description || error.message || 'Ein Fehler ist aufgetreten'
    }
  } finally {
    loading.value = false
  }
}
</script>