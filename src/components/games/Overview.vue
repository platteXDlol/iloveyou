<template>
    <!-- Overview Title -->
    <div class="m-5 mb-10 text-2xl font-bold text-gray-800 text-center">
        Overview here
    </div>
    <!-- Game Cards -->
    <div id="game-card" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="game in games" :key="game.id" class="bg-white rounded-lg shadow-md overflow-hidden">
            <RouterLink :to="{ path: `/games/${game.route}` }" class="block hover:shadow-lg transition">
                <img :src="game.img" :alt="game.title" class="w-full h-32 object-cover">
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-purple-600 mb-2">{{ game.title }}</h3>
                    <p class="text-gray-600 text-sm mb-4">{{ game.description }}</p>
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const games = ref([])


games.value = [
    { id: 1, title: 'Forplay', route: 'forplay', img: 'https://picsum.photos/200', description: 'Beschreibung des Spiels' },
    { id: 2, title: 'Truth or Dare', route: 'truth-or-dare', img: 'https://picsum.photos/200', description: 'Beschreibung des Spiels' },
    { id: 3, title: 'Couple Quiz', route: 'couple-quiz', img: 'https://picsum.photos/200', description: 'Beschreibung des Spiels' },
    { id: 4, title: 'Love Letters', route: 'love-letters', img: 'https://picsum.photos/200', description: 'Beschreibung des Spiels' },
]




</script>