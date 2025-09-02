<template>
    <div class="flex flex-col items-center min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100">
        <!-- Game Start Screen -->
        <div v-if="gameState === 'not_started'" class="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-purple-100 flex flex-col items-center gap-6">
            <h1 class="text-3xl font-bold text-purple-500">Love Game</h1>
            <div class="w-full flex flex-col gap-2">
                <label for="person_one_name" class="text-purple-500 font-medium">Player 1 Name</label>
                <input type="text" id="person_one_name" v-model="players[0].name" placeholder="Enter name" class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors" />
            </div>
            <div class="w-full flex flex-col gap-2">
                <label for="person_two_name" class="text-purple-500 font-medium">Player 2 Name</label>
                <input type="text" id="person_two_name" v-model="players[1].name" placeholder="Enter name" class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors" />
            </div>
            <button @click="startGame" class="w-full py-3 bg-gradient-to-r from-purple-500 to-sky-500 text-white rounded-xl text-lg font-bold hover:from-sky-500 hover:to-purple-500 transition-all shadow-md hover:shadow-lg">Start Game</button>
        </div>

        <!-- Game In Progress Screen -->
        <div v-if="gameState === 'in_progress'" class="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl border border-purple-100 flex flex-col items-center gap-6">
            
            <!-- Loading and Error States -->
            <div v-if="loading" class="text-purple-500">Loading tasks...</div>
            <div v-if="error" class="text-red-500">Error: {{ error }}</div>

            <template v-if="!loading && !error">
                <!-- Player Turn -->
                <h2 class="text-2xl font-bold text-purple-500">It's <span class="text-sky-500">{{ currentPlayer.name }}'s</span> turn!</h2>

                <!-- Task View -->
                <div v-if="activeLevel" class="w-full flex flex-col items-center gap-4">
                    <h3 class="text-xl font-semibold text-gray-700">Level {{ activeLevel }} - Task {{ tasksCompletedThisLevel + 1 }} of 4</h3>
                    <div class="w-full p-6 bg-gray-100 rounded-lg text-center">
                        <p class="text-lg text-gray-800">{{ currentTask }}</p>
                    </div>
                    <div class="flex gap-4">
                        <button @click="handleDone" class="py-2 px-6 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">Done</button>
                        <button @click="handleDifferentTask" class="py-2 px-6 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors">Different Task</button>
                    </div>
                    <button @click="backToLevels" class="text-sm text-gray-500 hover:text-purple-500 mt-4">Back to Levels</button>
                </div>

                <!-- Level Selection View -->
                <div v-else class="w-full flex flex-col items-center gap-4">
                    <h3 class="text-xl font-semibold text-gray-700">Select a Level</h3>
                    <div class="flex flex-wrap justify-center gap-4">
                        <button
                            v-for="levelNumber in totalLevels"
                            :key="levelNumber"
                            @click="selectLevel(levelNumber)"
                            class="py-3 px-8 bg-purple-500 text-white rounded-lg font-bold text-lg hover:bg-purple-600 transition-colors shadow-md"
                        >
                            Level {{ levelNumber }}
                        </button>
                    </div>
                </div>
            </template>

            <button @click="restartGame" class="mt-6 text-sm text-red-500 hover:text-red-700">Restart Game</button>
        </div>
    </div>
</template>

<script setup>
import { useGame } from '../composables/useGame';

const {
    gameState,
    players,
    currentPlayer,
    totalLevels,
    activeLevel,
    tasksCompletedThisLevel,
    currentTask,
    loading,
    error,
    startGame,
    restartGame,
    selectLevel,
    backToLevels,
    handleDone,
    handleDifferentTask,
} = useGame();
</script>

<style scoped>
/* Add any additional scoped styles here */
</style>
