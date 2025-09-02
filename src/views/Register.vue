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
            v-model="user_name" 
            :class="[
              'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400',
              fieldErrors.user_name ? 'border-red-400' : 'border-gray-300'
            ]"
          />
          <p v-if="fieldErrors.user_name" class="text-red-500 text-xs mt-1">{{ fieldErrors.user_name }}</p>
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
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const router = useRouter()

const email = ref('')
const password = ref('')
const first_name = ref('')
const last_name = ref('')
const user_name = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const fieldErrors = ref({})

function validateForm() {
  const errors = {}
  
  if (!first_name.value.trim()) {
    errors.first_name = 'Vorname ist erforderlich'
  }
  
  if (!last_name.value.trim()) {
    errors.last_name = 'Nachname ist erforderlich'
  }
  
  if (!user_name.value.trim()) {
    errors.user_name = 'Benutzername ist erforderlich'
  } else if (user_name.value.length < 3) {
    errors.user_name = 'Benutzername muss mindestens 3 Zeichen haben'
  }
  
  if (!email.value.trim()) {
    errors.email = 'E-Mail ist erforderlich'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Ungültige E-Mail-Adresse'
  }
  
  if (!password.value) {
    errors.password = 'Passwort ist erforderlich'
  } else if (password.value.length < 6) {
    errors.password = 'Passwort muss mindestens 6 Zeichen haben'
  }
  
  fieldErrors.value = errors
  return Object.keys(errors).length === 0
}

async function handleSignUp() {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''
  
  // Validate form
  if (!validateForm()) {
    return
  }
  
  try {
    loading.value = true
    
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          first_name: first_name.value.trim(),
          last_name: last_name.value.trim(),
          user_name: user_name.value.trim(),
        }
      }
    })
    
    if (error) throw error
    
    successMessage.value = "Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mails zur Bestätigung."
    
    // Clear form
    email.value = ''
    password.value = ''
    first_name.value = ''
    last_name.value = ''
    user_name.value = ''
    
    // Optional: Redirect to login after a delay
    setTimeout(() => {
      router.push('/login')
    }, 3000)
    
  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle specific errors
    if (error.message.includes('User already registered')) {
      errorMessage.value = 'Ein Benutzer mit dieser E-Mail existiert bereits'
    } else if (error.message.includes('Password should be at least')) {
      errorMessage.value = 'Das Passwort muss mindestens 6 Zeichen lang sein'
    } else if (error.message.includes('duplicate key value violates unique constraint')) {
      errorMessage.value = 'Dieser Benutzername ist bereits vergeben'
    } else {
      errorMessage.value = error.error_description || error.message || 'Ein Fehler ist aufgetreten'
    }
  } finally {
    loading.value = false
  }
}
</script>