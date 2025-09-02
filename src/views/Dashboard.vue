<template>
    <div class="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <!-- Together Card -->
            <div class="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
                <h2 class="text-xl font-bold text-purple-500 mb-4">Our Journey</h2>
                <div class="text-6xl font-bold text-sky-500">{{ daysTogether }}</div>
                <div class="text-lg text-gray-600">Days Together</div>
                <div class="mt-4 text-sm text-gray-500">Since {{ formattedTogetherSinceDate }}</div>
            </div>

            <!-- Stats Card -->
            <div class="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
                <h2 class="text-xl font-bold text-purple-500 mb-4">Connection Stats</h2>
                <div class="flex justify-around w-full">
                    <div class="flex flex-col items-center">
                        <div class="text-4xl font-bold text-sky-500">{{ daysSinceLastSeen }}</div>
                        <div class="text-md text-gray-600">Days Since Last Seen</div>
                    </div>
                    <div class="flex flex-col items-center">
                        <div class="text-4xl font-bold text-sky-500">{{ daysTillNextMeet }}</div>
                        <div class="text-md text-gray-600">Days Until We Meet</div>
                    </div>
                </div>
                 <div class="mt-4 text-sm text-gray-500">Next meeting on {{ formattedNextMeetDate }}</div>
            </div>

            <!-- Date Ideas Card -->
            <div class="bg-white p-6 rounded-2xl shadow-lg md:col-span-2 lg:col-span-1">
                <h2 class="text-xl font-bold text-purple-500 mb-4 text-center">Date Ideas</h2>
                <ul class="space-y-3">
                    <li v-for="(idea, index) in dateIdeas" :key="index" class="flex items-center p-2 bg-gray-100 rounded-lg">
                        <span class="text-lg text-sky-500 mr-3">💕</span>
                        <span class="text-gray-700">{{ idea }}</span>
                    </li>
                </ul>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// --- Reactive Data ---
const togetherSinceDate = ref(new Date('2022-02-14'));
const lastSeenDate = ref(new Date('2025-08-20'));
const nextMeetDate = ref(new Date('2025-09-15'));
const dateIdeas = ref([
    'Go for a picnic in the park.',
    'Take a cooking class together.',
    'Visit a museum or art gallery.',
    'Have a movie marathon night at home.',
    'Go stargazing.',
    'Try a new restaurant.',
    'Build a fort and watch movies inside.',
]);

// --- Computed Properties for Calculations ---
const daysTogether = computed(() => {
    const today = new Date();
    const diffTime = Math.abs(today - togetherSinceDate.value);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const daysSinceLastSeen = computed(() => {
    const today = new Date();
    const diffTime = Math.abs(today - lastSeenDate.value);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const daysTillNextMeet = computed(() => {
    const today = new Date();
    const diffTime = nextMeetDate.value - today;
    if (diffTime < 0) return 0; // If the date is in the past
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// --- Computed Properties for Formatting ---
const formattedTogetherSinceDate = computed(() => {
    return togetherSinceDate.value.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

const formattedNextMeetDate = computed(() => {
    return nextMeetDate.value.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

</script>