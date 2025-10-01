<template>
  <!-- Add Partner -->
  <div class="flex flex-col items-center justify-center p-8 m-4 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Add your Partner here</h2>
    <p class="text-gray-600 mb-6 text-center">Enter your partner's email address</p>
    <input
      v-model="partnerEmail"
      type="email"
      placeholder="Partner's Email"
      class="w-full max-w-md px-4 mb-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    <button
      @click="addPartner"
      class="w-full max-w-md py-3 bg-purple-500 text-white rounded-md font-semibold hover:bg-purple-600 transition disabled:opacity-50 mt-2">
      Add Partner
    </button>
  </div>

  <!-- Partner Requests -->
  <div class="flex flex-col gap-3 p-4">
    <div 
      v-for="request in partnerRequests" 
      :key="request.id" 
      class="flex items-center justify-between bg-white rounded-lg shadow p-3"
    >
      <!-- Username links -->
      <p class="text-gray-800 font-medium">{{ request.username }}</p>

      <!-- Buttons rechts -->
      <div class="flex gap-2">
        <!-- Accept -->
        <button
          class="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white"
          title="Accept"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <!-- Decline -->
        <button
          class="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white"
          title="Decline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const partnerEmail = ref('');
const partnerRequests = ref([
  { id: 1, username: 'alice' },
  { id: 2, username: 'bob' },
]);
</script>
