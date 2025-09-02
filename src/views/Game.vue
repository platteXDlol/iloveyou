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
                        <button @click="handleDone" class="py-2 px-6 bg-purple-500 text-white rounded-xl font-bold shadow-md hover:bg-purple-600 transition-all">Done</button>
                        <button @click="handleDifferentTask" class="py-2 px-6 bg-blue-500 text-white rounded-xl font-bold shadow-md hover:bg-blue-600 transition-all">Different Task</button>
                    </div>
                    <button @click="backToLevels" class="mt-4 py-2 px-6 border border-gray-500 text-gray-500 rounded-xl font-semibold shadow hover:bg-gray-500 hover:text-white transition-all">Back to Levels</button>
                </div>

                <!-- Level Selection View -->
                <div v-else class="w-full flex flex-col items-center gap-4">
                    <h3 class="text-xl font-semibold text-gray-700">Select a Level</h3>
                    <div class="flex flex-wrap justify-center gap-4">
                        <button
                            v-for="levelNumber in totalLevels"
                            :key="levelNumber"
                            @click="selectLevel(levelNumber)"
                            :class="[
                                'py-3 px-8 rounded-lg font-bold text-lg transition-colors shadow-md',
                                isLevelUnlocked(levelNumber) ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            ]"
                            :disabled="!isLevelUnlocked(levelNumber)"
                        >
                            Level {{ levelNumber }}
                        </button>
                    </div>
                </div>
            </template>

            <button @click="restartGame" class="mt-6 text-sm text-red-500 hover:underline cursor-pointer">Restart Game</button>
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
    completedTasks, // Make sure to get this from the composable
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

// Function to check if a level is unlocked
const isLevelUnlocked = (levelNumber) => {
    if (levelNumber === 1) return true; // Level 1 is always unlocked
    // Check if the previous level is completed (4 tasks done)
    return (completedTasks[levelNumber - 1] || 0) >= 4;
};
</script>

<style scoped>
/* Add any additional scoped styles here */
</style>
