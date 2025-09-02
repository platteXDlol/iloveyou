<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-pink-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
      <h2 class="text-2xl font-bold text-center text-purple-700 mb-2">Login</h2>
      <p v-if="message" class="text-center text-red-500 text-sm">{{ message }}</p>
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <input type="email" placeholder="Deine E-Mail" v-model="email" class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
        <input type="password" placeholder="Dein Passwort" v-model="password" class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" />
        <div class="flex gap-3 mt-2">
          <button type="submit" :disabled="loading" class="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-60">Anmelden</button>
        </div>
      </form>
    </div>
  </div>
</template>



<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const email = ref('')
const password = ref('')
const loading = ref(false)
const message = ref('')


async function handleLogin() {
   try {
     loading.value = true
     message.value = ''
     const { error } = await supabase.auth.signInWithPassword({
       email: email.value,
       password: password.value,
     })
     if (error) throw error
   } catch (error) {
     message.value = error.error_description || error.message
   } finally {
     loading.value = false
   }
}
</script>

