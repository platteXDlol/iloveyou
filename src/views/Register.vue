<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-pink-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
      <h2 class="text-2xl font-bold text-center text-purple-700 mb-2">Registrierung</h2>
      
      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
        {{ successMessage }}
      </div>
      
      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
        {{ errorMessage }}
      </div>
      
      <!-- Registrierung -->
      <form @submit.prevent="handleSignUp" class="flex flex-col gap-4">
        <div>
          <input 
            type="text" 
            placeholder="Vorname" 
            v-model="first_name" 
            :class="[
              'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400',
              fieldErrors.first_name ? 'border-red-400' : 'border-gray-300'
            ]"
          />
          <p v-if="fieldErrors.first_name" class="text-red-500 text-xs mt-1">{{ fieldErrors.first_name }}</p>
        </div>
        
        <div>
          <input 
            type="text" 
            placeholder="Nachname" 
            v-model="last_name" 
            :class="[
              'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400',
              fieldErrors.last_name ? 'border-red-400' : 'border-gray-300'
            ]"
          />
          <p v-if="fieldErrors.last_name" class="text-red-500 text-xs mt-1">{{ fieldErrors.last_name }}</p>
        </div>
        
        <div>
          <input 
            type="text" 
            placeholder="Benutzername" 
            v-model="username" 
            :class="[
              'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400',
              fieldErrors.username ? 'border-red-400' : 'border-gray-300'
            ]"
          />
          <p v-if="fieldErrors.username" class="text-red-500 text-xs mt-1">{{ fieldErrors.username }}</p>
        </div>
        
        <div>
          <input 
            type="email" 
            placeholder="E-Mail" 
            v-model="email" 
            :class="[
              'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400',
              fieldErrors.email ? 'border-red-400' : 'border-gray-300'
            ]"
          />
          <p v-if="fieldErrors.email" class="text-red-500 text-xs mt-1">{{ fieldErrors.email }}</p>
        </div>
        
        <div>
          <input 
            type="password" 
            placeholder="Passwort (min. 6 Zeichen)" 
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
            class="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span v-if="!loading">Registrieren</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Wird registriert...
            </span>
          </button>
        </div>
      </form>

      <!-- bereits registriert?  -->
      <div class="text-center">
        <p class="text-gray-600 text-sm">
          Bereits registriert? 
          <router-link to="/login" class="text-purple-600 hover:text-purple-800 font-semibold">Hier anmelden</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const email = ref('')
const password = ref('')
const first_name = ref('')
const last_name = ref('')
const username = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const fieldErrors = ref({})

function validateForm() {
  errorMessage.value = ''
  successMessage.value = ''
  fieldErrors.value = {}

  if (!first_name.value) fieldErrors.value.first_name = 'Vorname ist erforderlich.'
  if (!last_name.value) fieldErrors.value.last_name = 'Nachname ist erforderlich.'
  if (!username.value) fieldErrors.value.username = 'Benutzername ist erforderlich.'
  if (!email.value) fieldErrors.value.email = 'E-Mail ist erforderlich.'
  if (!password.value || password.value.length < 6) fieldErrors.value.password = 'Passwort muss mindestens 6 Zeichen lang sein.'

  return Object.keys(fieldErrors.value).length === 0
}

async function handleSignUp() {
  if (!validateForm()) return

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
  
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          first_name: first_name.value,
          last_name: last_name.value,
          username: username.value
        }
      }
    })

    if (error) throw error

      if (data.user && data.user.identities && data.user.identities.length === 0) {
      errorMessage.value = 'Diese E-Mail-Adresse ist bereits registriert. Bitte melde dich an.';
      return; 
    }

    successMessage.value = 'Registrierung erfolgreich! Bitte überprüfe deine E-Mails zur Bestätigung.'

    // Formular zurücksetzen
    email.value = ''
    password.value = ''
    first_name.value = ''
    last_name.value = ''
    username.value = ''
}
  catch (error) {
    console.error('Registrierungsfehler:', error)
    
    // Fehlerbehandlung basierend auf Supabase-Fehlermeldungen
    switch (error.code) {
      case '23505': // PostgreSQL unique_violation
        errorMessage.value = 'Dieser Benutzername oder diese E-Mail ist bereits vergeben.';
        break;
      case 'invalid_email':
        errorMessage.value = 'Bitte gib eine gültige E-Mail-Adresse ein.';
        break;
      case 'invalid_password':
        errorMessage.value = 'Das Passwort muss mindestens 6 Zeichen lang sein.';
        break;
      default:
        errorMessage.value = 'Registrierung fehlgeschlagen. Bitte versuche es erneut.';
}
  } 
  finally {
    loading.value = false
  }
}


</script>