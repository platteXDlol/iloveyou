<template>
    <!-- Loading && Error -->
    <div v-if="isLoading" class="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <p class="text-2xl text-gray-600">Loading...</p>
    </div>
    <div v-else-if="error" class="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <p class="text-2xl text-red-600">{{ error }}</p>
    </div>
    <!-- Main Dashboard -->
    <div v-else class="min-h-screen bg-gray-100 p-8 relative">
        <div class="flex justify-between items-center mb-10">
            <h1 class="text-4xl font-bold text-center text-gray-800">{{ dashboardTitle }}</h1>
            <div>
                <!-- Edit Button -->
                <button @click="isEditMode = !isEditMode"
                    class="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
                    </svg>
                </button>
                <!-- Add Card Button -->
                <button v-if="isEditMode" @click="showAddCardModal = true"
                    class="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
                <!-- Save Theme Button -->
                <button v-if="isEditMode" @click="saveTheme"
                    class="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors ml-2">
                    Save
                </button>
            </div>
        </div>

        <!-- If No Partner then show Invitation Section -->
        <div v-if="!couple" class="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">You are not part of a couple yet!</h2>
            <p class="text-gray-600 mb-6 text-center">Invite your partner to join you on this dashboard.</p>

            <div class="w-full max-w-md flex flex-col gap-4 pb-3">
                <button
                    @click="$router.push('/addpartner')"
                    class="w-full py-3 bg-purple-500 text-white rounded-md font-semibold hover:bg-purple-600 transition disabled:opacity-50">
                    <span>Invite Partner</span>
                </button>
            </div>
        </div> 
        <!-- If Partner then show Dashboard -->
        <div v-else class="space-y-10">
            <!-- Date Cards -->
            <div class="space-y-10">
                <draggable v-model="cardOrder" item-key="self" class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10"
                    :disabled="!isEditMode" @end="updateCardOrder">
                    <template #item="{ element: cardKey }">
                        <div v-if="cardVisibility[cardKey]">

                            <div v-if="cardKey === 'days_together'" class="rounded-lg shadow-lg p-6 relative h-full"
                                :style="{ backgroundColor: cardColors.days_together.background, color: cardColors.days_together.text }">
                                <button v-if="isEditMode" @click="toggleCardVisibility('days_together')"
                                    class="absolute top-2 right-2 p-1 rounded-full bg-black/10 hover:bg-black/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <h2 class="text-2xl font-semibold mb-2">Days Together</h2>
                                <p class="text-5xl font-bold">{{ daysTogether }}</p>
                                <input v-if="isEditMode" type="date"
                                    :value="togetherSinceDate.toISOString().split('T')[0]"
                                    @change="updateDate('together_since', $event.target.value)"
                                    class="mt-2 w-full rounded-md border-gray-300 shadow-sm text-gray-800">
                                <p v-else class="opacity-80 mt-2">since {{ formattedTogetherSinceDate }}</p>
                                <div v-if="isEditMode" class="mt-4 flex gap-2">
                                    <div>
                                        <label class="block text-xs opacity-80">Card</label>
                                        <input type="color" v-model="cardColors.days_together.background"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                    <div>
                                        <label class="block text-xs opacity-80">Text</label>
                                        <input type="color" v-model="cardColors.days_together.text"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                </div>
                            </div>

                            <div v-if="cardKey === 'days_till_next_meet'"
                                class="rounded-lg shadow-lg p-6 relative h-full"
                                :style="{ backgroundColor: cardColors.days_till_next_meet.background, color: cardColors.days_till_next_meet.text }">
                                <button v-if="isEditMode" @click="toggleCardVisibility('days_till_next_meet')"
                                    class="absolute top-2 right-2 p-1 rounded-full bg-black/10 hover:bg-black/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <h2 class="text-2xl font-semibold mb-2">Days Till Next Meet</h2>
                                <p class="text-5xl font-bold">{{ daysTillNextMeet }}</p>
                                <input v-if="isEditMode" type="date" :value="nextMeetDate.toISOString().split('T')[0]"
                                    @change="updateDate('next_date', $event.target.value)"
                                    class="mt-2 w-full rounded-md border-gray-300 shadow-sm text-gray-800">
                                <p v-else class="opacity-80 mt-2">until {{ formattedNextMeetDate }}</p>
                                <div v-if="isEditMode" class="mt-4 flex gap-2">
                                    <div>
                                        <label class="block text-xs opacity-80">Card</label>
                                        <input type="color" v-model="cardColors.days_till_next_meet.background"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                    <div>
                                        <label class="block text-xs opacity-80">Text</label>
                                        <input type="color" v-model="cardColors.days_till_next_meet.text"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                </div>
                            </div>

                            <div v-if="cardKey === 'days_since_last_seen'"
                                class="rounded-lg shadow-lg p-6 relative h-full"
                                :style="{ backgroundColor: cardColors.days_since_last_seen.background, color: cardColors.days_since_last_seen.text }">
                                <button v-if="isEditMode" @click="toggleCardVisibility('days_since_last_seen')"
                                    class="absolute top-2 right-2 p-1 rounded-full bg-black/10 hover:bg-black/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <h2 class="text-2xl font-semibold mb-2">Days Since Last Seen</h2>
                                <p class="text-5xl font-bold">{{ daysSinceLastSeen }}</p>
                                <input v-if="isEditMode" type="date" :value="lastSeenDate.toISOString().split('T')[0]"
                                    @change="updateDate('last_seen', $event.target.value)"
                                    class="mt-2 w-full rounded-md border-gray-300 shadow-sm text-gray-800">
                                <p v-else class="opacity-80 mt-2">days ago</p>
                                <div v-if="isEditMode" class="mt-4 flex gap-2">
                                    <div>
                                        <label class="block text-xs opacity-80">Card</label>
                                        <input type="color" v-model="cardColors.days_since_last_seen.background"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                    <div>
                                        <label class="block text-xs opacity-80">Text</label>
                                        <input type="color" v-model="cardColors.days_since_last_seen.text"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                </div>
                            </div>

                            <div v-if="cardKey === 'first_kiss'" class="rounded-lg shadow-lg p-6 relative h-full"
                                :style="{ backgroundColor: cardColors.first_kiss.background, color: cardColors.first_kiss.text }">
                                <button v-if="isEditMode" @click="toggleCardVisibility('first_kiss')"
                                    class="absolute top-2 right-2 p-1 rounded-full bg-black/10 hover:bg-black/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <h2 class="text-2xl font-semibold mb-2">First Kiss</h2>
                                <p class="text-5xl font-bold">{{ daysSinceFirstKiss }}</p>
                                <input v-if="isEditMode" type="date" :value="firstKissDate.toISOString().split('T')[0]"
                                    @change="updateDate('first_kiss', $event.target.value)"
                                    class="mt-2 w-full rounded-md border-gray-300 shadow-sm text-gray-800">
                                <p v-else class="opacity-80 mt-2">days ago on {{ formattedFirstKissDate }}</p>
                                <div v-if="isEditMode" class="mt-4 flex gap-2">
                                    <div>
                                        <label class="block text-xs opacity-80">Card</label>
                                        <input type="color" v-model="cardColors.first_kiss.background"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                    <div>
                                        <label class="block text-xs opacity-80">Text</label>
                                        <input type="color" v-model="cardColors.first_kiss.text"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                </div>
                            </div>

                            <div v-if="cardKey === 'known_since'" class="rounded-lg shadow-lg p-6 relative h-full"
                                :style="{ backgroundColor: cardColors.known_since.background, color: cardColors.known_since.text }">
                                <button v-if="isEditMode" @click="toggleCardVisibility('known_since')"
                                    class="absolute top-2 right-2 p-1 rounded-full bg-black/10 hover:bg-black/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <h2 class="text-2xl font-semibold mb-2">Known Since</h2>
                                <p class="text-5xl font-bold">{{ daysSinceKnown }}</p>
                                <input v-if="isEditMode" type="date" :value="knownSinceDate.toISOString().split('T')[0]"
                                    @change="updateDate('known_since', $event.target.value)"
                                    class="mt-2 w-full rounded-md border-gray-300 shadow-sm text-gray-800">
                                <p v-else class="opacity-80 mt-2">days ago on {{ formattedKnownSinceDate }}</p>
                                <div v-if="isEditMode" class="mt-4 flex gap-2">
                                    <div>
                                        <label class="block text-xs opacity-80">Card</label>
                                        <input type="color" v-model="cardColors.known_since.background"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                    <div>
                                        <label class="block text-xs opacity-80">Text</label>
                                        <input type="color" v-model="cardColors.known_since.text"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                </div>
                            </div>

                            <div v-if="cardKey === 'first_time'" class="rounded-lg shadow-lg p-6 relative h-full"
                                :style="{ backgroundColor: cardColors.first_time.background, color: cardColors.first_time.text }">
                                <button v-if="isEditMode" @click="toggleCardVisibility('first_time')"
                                    class="absolute top-2 right-2 p-1 rounded-full bg-black/10 hover:bg-black/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <h2 class="text-2xl font-semibold mb-2">First Time</h2>
                                <p class="text-5xl font-bold">{{ daysSinceFirstTime }}</p>
                                <input v-if="isEditMode" type="date" :value="firstTimeDate.toISOString().split('T')[0]"
                                    @change="updateDate('first_time', $event.target.value)"
                                    class="mt-2 w-full rounded-md border-gray-300 shadow-sm text-gray-800">
                                <p v-else class="opacity-80 mt-2">days ago on {{ formattedFirstTimeDate }}</p>
                                <div v-if="isEditMode" class="mt-4 flex gap-2">
                                    <div>
                                        <label class="block text-xs opacity-80">Card</label>
                                        <input type="color" v-model="cardColors.first_time.background"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                    <div>
                                        <label class="block text-xs opacity-80">Text</label>
                                        <input type="color" v-model="cardColors.first_time.text"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                </div>
                            </div>

                            <div v-if="cardKey === 'wedding_day'" class="rounded-lg shadow-lg p-6 relative h-full"
                                :style="{ backgroundColor: cardColors.wedding_day.background, color: cardColors.wedding_day.text }">
                                <button v-if="isEditMode" @click="toggleCardVisibility('wedding_day')"
                                    class="absolute top-2 right-2 p-1 rounded-full bg-black/10 hover:bg-black/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <h2 class="text-2xl font-semibold mb-2">Wedding Day</h2>
                                <p class="text-5xl font-bold">{{ daysSinceWedding }}</p>
                                <input v-if="isEditMode" type="date" :value="weddingDate.toISOString().split('T')[0]"
                                    @change="updateDate('wedding_day', $event.target.value)"
                                    class="mt-2 w-full rounded-md border-gray-300 shadow-sm text-gray-800">
                                <p v-else class="opacity-80 mt-2">days ago on {{ formattedWeddingDate }}</p>
                                <div v-if="isEditMode" class="mt-4 flex gap-2">
                                    <div>
                                        <label class="block text-xs opacity-80">Card</label>
                                        <input type="color" v-model="cardColors.wedding_day.background"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                    <div>
                                        <label class="block text-xs opacity-80">Text</label>
                                        <input type="color" v-model="cardColors.wedding_day.text"
                                            @change="updateCardColors" class="w-8 h-8 p-0 border-none rounded-full">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                </draggable>
            </div>
            <!-- Date Ideas Section -->
            <div class="bg-white rounded-lg shadow-lg p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-bold text-gray-800">Date Ideas</h2>
                    <button @click="openAddModal"
                        class="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
                <div v-if="isEditMode" class="mb-4 flex gap-4 border-b pb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">To Do</label>
                        <input type="color" v-model="cardColors.date_ideas_todo.background" @change="updateCardColors"
                            class="w-8 h-8 p-0 border-none rounded-full">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Done</label>
                        <input type="color" v-model="cardColors.date_ideas_done.background" @change="updateCardColors"
                            class="w-8 h-8 p-0 border-none rounded-full">
                    </div>
                </div>
                <draggable v-model="dateIdeas" @end="updateDateIdeasOrder" item-key="date_idea_id"
                    :disabled="!isEditMode">
                    <template #item="{ element }">
                        <div @click="openEditModal(element)"
                            class="cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <div class="flex items-center">
                                <span @click.stop="toggleIdeaState(element)"
                                    class="h-4 w-4 rounded-full mr-4 cursor-pointer"
                                    :style="{ backgroundColor: element.state === 'done' ? cardColors.date_ideas_done.background : cardColors.date_ideas_todo.background }"></span>
                                <span class="text-lg text-gray-800 font-medium"
                                    :class="{ 'line-through': element.state === 'done' }">{{ element.title }}</span>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>

            <!-- Modal for adding/editing idea -->
            <div v-if="editingIdea" @click="editingIdea = null"
                class="fixed inset-0 bg-gray-300/50 z-40 flex justify-center items-center">
                <div @click.stop class="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
                    <h3 class="text-2xl font-bold mb-4">{{ editingIdea.date_idea_id ? 'Edit Idea' : 'Add Idea' }}</h3>
                    <div class="space-y-4">
                        <div>
                            <label for="ideaTitle" class="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" v-model="editingIdea.title" id="ideaTitle"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        </div>
                        <div>
                            <label for="ideaDescription"
                                class="block text-sm font-medium text-gray-700">Description</label>
                            <textarea v-model="editingIdea.description" id="ideaDescription" rows="4"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" v-model="isEditingIdeaDone" id="ideaState"
                                class="h-4 w-4 rounded border-gray-300 text-indigo-600">
                            <label for="ideaState" class="ml-2 block text-sm text-gray-900">Done</label>
                        </div>
                        <div class="flex justify-end space-x-4">
                            <button @click="editingIdea = null"
                                class="px-4 py-2 rounded-md text-gray-600 bg-gray-200 hover:bg-gray-300">Cancel</button>
                            <button @click="saveIdea"
                                class="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Save</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal for adding cards -->
            <div v-if="showAddCardModal" @click="showAddCardModal = false"
                class="fixed inset-0 bg-gray-300/50 z-40 flex justify-center items-center">
                <div @click.stop class="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm">
                    <h3 class="text-2xl font-bold mb-4">Add a Card</h3>
                    <div v-if="hiddenCards.length > 0" class="space-y-2">
                        <div v-for="cardKey in hiddenCards" :key="cardKey">
                            <button @click="toggleCardVisibility(cardKey)"
                                class="w-full text-left px-4 py-2 rounded-md text-gray-700 font-medium bg-gray-100 hover:bg-gray-200">{{
                                formatCardKey(cardKey) }}</button>
                        </div>
                    </div>
                    <div v-else>
                        <p class="text-gray-500">All cards are currently visible.</p>
                    </div>
                    <div class="flex justify-end mt-6">
                        <button @click="showAddCardModal = false"
                            class="px-4 py-2 rounded-md text-gray-600 bg-gray-200 hover:bg-gray-300">Close</button>
                    </div>
                </div>
            </div>

            <!-- Modal for saving theme 
            <div v-if="showSaveThemeModal" @click="showSaveThemeModal = false"
                class="fixed inset-0 bg-gray-300/50 z-50 flex justify-center items-center">
                <div @click.stop class="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
                    <h3 class="text-2xl font-bold mb-4">Save as Theme</h3>
                    <div class="space-y-4">
                        <div>
                            <label for="themeTitle" class="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" v-model="newTheme.title" id="themeTitle"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                        </div>
                        <div>
                            <label for="themeDescription"
                                class="block text-sm font-medium text-gray-700">Description</label>
                            <textarea v-model="newTheme.description" id="themeDescription" rows="3"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                        </div>
                        <div>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-4 mt-6">
                        <button @click="showSaveThemeModal = false"
                            class="px-4 py-2 rounded-md text-gray-600 bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button @click="saveTheme"
                            class="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">Save
                            Theme</button>
                    </div>
                </div>
            </div>
            -->

            <!-- Modal for themes -->
            <div v-if="showThemesModal" @click="showThemesModal = false"
                class="fixed inset-0 bg-gray-300/50 z-50 flex justify-center items-center">
                <div @click.stop class="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
                    <h3 class="text-2xl font-bold mb-4">Apply a Theme</h3>
                    <div class="max-h-96 overflow-y-auto space-y-4">
                        <div v-for="theme in themes" :key="theme.theme_id" class="p-4 border rounded-lg">
                            <h4 class="font-bold text-lg">{{ theme.title }}</h4>
                            <p class="text-gray-600">{{ theme.description }}</p>
                            <div class="flex justify-end mt-2">
                                <button @click="applyTheme(theme)"
                                    class="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">Apply</button>
                            </div>
                        </div>
                        <div v-if="themes.length === 0">
                            <p class="text-gray-500">No themes found. Create one in edit mode!</p>
                        </div>
                    </div>
                    <div class="flex justify-end mt-6">
                        <button @click="showThemesModal = false"
                            class="px-4 py-2 rounded-md text-gray-600 bg-gray-200 hover:bg-gray-300">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<!-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- -->
<!-- -------------------------------------------------------------------------Script------------------------------------------------------------------------------------------------ -->
<!-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- -->
<!-- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- -->

<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '../supabase';
import draggable from 'vuedraggable';

// --------------------------------------- Declaration --------------------------------------------------------------------------------
const isLoading = ref(true);
const error = ref(null);
const isEditMode = ref(false);
const showAddCardModal = ref(false);
const showSaveThemeModal = ref(false);
const showThemesModal = ref(false);
const themes = ref([]);
const newTheme = ref([]);
const dashboardTitle = ref('Relationship Dashboard');
const cardOrder = ref([
    'days_together',
    'days_till_next_meet',
    'days_since_last_seen',
    'first_kiss',
    'known_since',
    'first_time',
    'wedding_day'
]);
const cardColors = ref({
    days_together: { background: '#ec4899', text: '#ffffff' },
    days_till_next_meet: { background: '#22c55e', text: '#ffffff' },
    days_since_last_seen: { background: '#3b82f6', text: '#ffffff' },
    first_kiss: { background: '#ef4444', text: '#ffffff' },
    known_since: { background: '#eab308', text: '#ffffff' },
    first_time: { background: '#6366f1', text: '#ffffff' },
    wedding_day: { background: '#8b5cf6', text: '#ffffff' },
    date_ideas_done: { background: '#ef4444', text: '#ffffff' },
    date_ideas_todo: { background: '#8b5cf6', text: '#ffffff' }
});
const cardVisibility = ref({});

const couple = ref(null);
const togetherSinceDate = ref(null);
const lastSeenDate = ref(null);
const nextMeetDate = ref(null);
const firstKissDate = ref(null);
const knownSinceDate = ref(null);
const firstTimeDate = ref(null);
const weddingDate = ref(null);
const dateIdeas = ref([]);
const editingIdea = ref(null);

    onMounted(() => {
      loadTheme(fetchThemes)
    })

// ---------------------------------------- Functions ---------------------------------------------------------------------------------------------------------

// 
const hiddenCards = computed(() => {
    return Object.keys(cardVisibility.value).filter(key => !cardVisibility.value[key]);
});

const isEditingIdeaDone = computed({
    get() {
        return editingIdea.value ? editingIdea.value.state === 'done' : false;
    },
    set(value) {
        if (editingIdea.value) {
            editingIdea.value.state = value ? 'done' : 'to_do';
        }
    }
});



// --------------- Formate Dates --------------------
const formattedTogetherSinceDate = computed(() => {
    if (!togetherSinceDate.value) return '';
    return new Date(togetherSinceDate.value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

const formattedNextMeetDate = computed(() => {
    if (!nextMeetDate.value) return '';
    return new Date(nextMeetDate.value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

const formattedFirstKissDate = computed(() => {
    if (!firstKissDate.value) return '';
    return new Date(firstKissDate.value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

const formattedKnownSinceDate = computed(() => {
    if (!knownSinceDate.value) return '';
    return new Date(knownSinceDate.value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

const formattedFirstTimeDate = computed(() => {
    if (!firstTimeDate.value) return '';
    return new Date(firstTimeDate.value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

const formattedWeddingDate = computed(() => {
    if (!weddingDate.value) return '';
    return new Date(weddingDate.value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

const daysTogether = computed(() => {
    if (!togetherSinceDate.value) return null;
    const today = new Date();
    const diffTime = Math.abs(today - new Date(togetherSinceDate.value));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const daysSinceLastSeen = computed(() => {
    if (!lastSeenDate.value) return null;
    const today = new Date();
    const diffTime = Math.abs(today - new Date(lastSeenDate.value));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const daysTillNextMeet = computed(() => {
    if (!nextMeetDate.value) return null;
    const today = new Date();
    const diffTime = new Date(nextMeetDate.value) - today;
    if (diffTime < 0) return 0; // If the date is in the past
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const daysSinceFirstKiss = computed(() => {
    if (!firstKissDate.value) return null;
    const today = new Date();
    const diffTime = Math.abs(today - new Date(firstKissDate.value));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const daysSinceKnown = computed(() => {
    if (!knownSinceDate.value) return null;
    const today = new Date();
    const diffTime = Math.abs(today - new Date(knownSinceDate.value));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const daysSinceFirstTime = computed(() => {
    if (!firstTimeDate.value) return null;
    const today = new Date();
    const diffTime = Math.abs(today - new Date(firstTimeDate.value));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const daysSinceWedding = computed(() => {
    if (!weddingDate.value) return null;
    const today = new Date();
    const diffTime = Math.abs(today - new Date(weddingDate.value));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

function formatCardKey(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}


// --- Fetch couple date ---
async function fetchFullCoupleData() {
    isLoading.value = true;
    error.value = null;
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            isLoading.value = false;
            return;
        }

        const { data: coupleData, error: coupleError } = await supabase
            .from('couples')
            .select('*')
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
            .single();

        if (coupleError && coupleError.code !== 'PGRST116') { // PGRST116 means no rows found
            throw coupleError;
        }

        if (coupleData) {
            couple.value = coupleData;

            togetherSinceDate.value = coupleData.together_since ? new Date(coupleData.together_since) : new Date(0);
            firstKissDate.value = coupleData.first_kiss ? new Date(coupleData.first_kiss) : new Date(0);
            knownSinceDate.value = coupleData.known_since ? new Date(coupleData.known_since) : new Date(0);
            firstTimeDate.value = coupleData.first_time ? new Date(coupleData.first_time) : new Date(0);
            lastSeenDate.value = coupleData.last_seen ? new Date(coupleData.last_seen) : new Date(0);
            nextMeetDate.value = coupleData.next_date ? new Date(coupleData.next_date) : new Date(0);
            weddingDate.value = coupleData.wedding_day ? new Date(coupleData.wedding_day) : new Date(0);

            await fetchDateIdeas();
        } 
        else {
            couple.value = null; // No couple found for this user
        }

    } catch (e) {
        console.error('Error fetching data:', e);
        error.value = 'Failed to load your data. Please try again later.';
    } finally {
        isLoading.value = false;
    }
}

// f
async function fetchDateIdeas() {
    if (!couple.value?.couple_id) return;

    try {
        // Fetch date ideas
        const { data: dateIdeasData, error: dateIdeasError } = await supabase
            .from('date_ideas')
            .select('*')
            .eq('couple_id', couple.value.couple_id);

        if (dateIdeasError) {
            console.error('Error fetching date ideas:', dateIdeasError);
            return;
        }

        // Fetch couple's order preference
        const { data: coupleData, error: coupleError } = await supabase
            .from('couples')
            .select('date_idea_order')
            .eq('couple_id', couple.value.couple_id)
            .single();

        if (coupleError) {
            console.error('Error fetching couple order:', coupleError);
        }

        const savedOrder = coupleData?.date_idea_order;

        if (savedOrder && Array.isArray(savedOrder)) {
            // Apply saved order
            const orderedIdeas = [];
            const unorderedIdeas = [];

            // First, add ideas in saved order
            savedOrder.forEach(id => {
                const idea = dateIdeasData.find(idea => idea.date_idea_id === id);
                if (idea) {
                    orderedIdeas.push(idea);
                }
            });

            // Add any new ideas that weren't in the saved order
            dateIdeasData.forEach(idea => {
                if (!savedOrder.includes(idea.date_idea_id)) {
                    unorderedIdeas.push(idea);
                }
            });

            dateIdeas.value = [...orderedIdeas, ...unorderedIdeas];
        } else {
            // No saved order, use default
            dateIdeas.value = dateIdeasData;
        }

    } catch (error) {
        console.error('Error loading date ideas:', error);
        dateIdeas.value = dateIdeasData || [];
    }
}

/*
async function openThemesModal() {
    await fetchThemes();
    showThemesModal.value = true;
}
*/

async function fetchThemes() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: userTheme, error } = await supabase
      .from('users')
      .select('dashboard_theme')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Fehler beim Abrufen des Themes:', error);
      return null;
    }

    const theme = userTheme?.dashboard_theme;
    return theme;
  }
  return null;
}

async function loadTheme() {
  try {
    const theme = await fetchThemes();
    
    if (theme && theme.colors && theme.visibility && theme.order) {
      // Theme erfolgreich geladen, jetzt anwenden
      cardColors.value = theme.colors;
      cardVisibility.value = theme.visibility;
      cardOrder.value = theme.order;
      
      console.log('Theme erfolgreich geladen:', theme);
    } else {
      console.log('Kein Theme gefunden oder unvollständig, verwende Standard-Theme');
    }
  } catch (error) {
    console.error('Fehler beim Laden des Themes:', error);
  }
}

/* Save Theme and Date Ideas Order */
async function saveTheme() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert('You must be logged in to save a theme.');
        return;
    }

    const dashboard_theme = {
        colors: cardColors.value,
        visibility: cardVisibility.value,
        order: cardOrder.value
    };

    const { error } = await supabase
        .from('users')
        .update({ dashboard_theme: dashboard_theme })
        .eq('user_id', user.id);

    if (error) {
        console.error('Error saving theme:', error);
        alert('Failed to save theme.');
    } else {
        showSaveThemeModal.value = false;
        isEditMode.value = false;
        newTheme.value = { title: '', description: '', visibility: 'private' };
        await fetchThemes(); // Refresh themes list
    }

    // Save the order of date ideas as well
    try {
    const orderArray = dateIdeas.value.map(idea => idea.date_idea_id);

    const { error } = await supabase
        .from('couples')
        .update({ date_idea_order: orderArray })
        .eq('couple_id', couple.value.couple_id);

    if (error) {
        console.error('Error saving date ideas order:', error);
        alert('Failed to save order.');
    } 
    } catch (error) {
        console.error('Error saving date ideas order:', error);
        alert('Failed to save order.');
    }
}

async function updateDate(column, value) {
    if (!couple.value) return;
    const { error } = await supabase.from('couples').update({ [column]: value }).eq('couple_id', couple.value.couple_id);
    if (error) console.error('Error updating date', error);
}

async function toggleCardVisibility(card) {
    cardVisibility.value[card] = !cardVisibility.value[card];
    console.log("Card visibility updated locally. Save as a theme to persist.");
}

async function addDateIdea(idea) {
    if (!couple.value) return;
    const { data, error } = await supabase.from('date_ideas').insert([{ ...idea, couple_id: couple.value.couple_id }]).select();
    if (error) {
        console.error('Error adding date idea:', error);
    } else if (data) {
        await fetchDateIdeas();
    }
}

async function deleteDateIdea(id) {
    const { error } = await supabase.from('date_ideas').delete().eq('date_idea_id', id);
    if (error) {
        console.error('Error deleting date idea:', error);
    } else {
        dateIdeas.value = dateIdeas.value.filter(idea => idea.date_idea_id !== id);
    }
}

async function updateDateIdea(idea) {
    const { error } = await supabase.from('date_ideas').update({ title: idea.title, description: idea.description, state: idea.state }).eq('date_idea_id', idea.date_idea_id);
    if (error) {
        console.error('Error updating date idea:', error);
    } else {
        const index = dateIdeas.value.findIndex(i => i.date_idea_id === idea.date_idea_id);
        if (index !== -1) {
            dateIdeas.value[index] = idea;
        }
    }
}

function openAddModal() {
    editingIdea.value = { title: '', description: '', state: 'to_do' };
}

function openEditModal(idea) {
    editingIdea.value = { ...idea };
}

async function saveIdea() {
    if (!editingIdea.value || !editingIdea.value.title.trim()) return;

    if (editingIdea.value.date_idea_id) {
        await updateDateIdea(editingIdea.value);
    } else {
        await addDateIdea(editingIdea.value);
    }
    editingIdea.value = null;
}

async function toggleIdeaState(idea) {
    const ideaToUpdate = { ...idea };
    ideaToUpdate.state = ideaToUpdate.state === 'done' ? 'to_do' : 'done';
    await updateDateIdea(ideaToUpdate);
}



onMounted(async () => {
  try {
    // Zuerst Theme laden
    await loadTheme();
    // Dann Couple-Daten laden
    await fetchFullCoupleData();
  } catch (error) {
    console.error('Fehler beim Initialisieren:', error);
    isLoading.value = false;
    error.value = 'Fehler beim Laden der Daten';
  }
});



</script>