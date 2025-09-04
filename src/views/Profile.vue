<template>
    <div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100">
        <div class="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-4xl border border-purple-100">
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
            </div>

            <!-- Profile Content -->
            <div v-else class="flex flex-col md:flex-row md:gap-12">
                <!-- Success/Error Messages -->
                <div v-if="successMessage" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                    {{ successMessage }}
                </div>
                <div v-if="errorMessage" class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                    {{ errorMessage }}
                </div>

                <!-- Avatar Section -->
                <div class="relative flex flex-col items-center md:w-1/3 gap-2">
                    <input 
                        type="file" 
                        ref="fileInput" 
                        @change="onFileChange" 
                        class="hidden" 
                        accept="image/*" 
                    />
                    <img 
                        :src="user.avatar || defaultAvatar" 
                        @click="openFileInput" 
                        alt="User Avatar" 
                        class="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-purple-400 cursor-pointer transition-transform duration-200 hover:scale-105" 
                    />
                    <div class="font-bold text-2xl text-purple-500 mt-4 tracking-wide">
                        @{{ user.user_name || 'username' }}
                    </div>
                    <p class="text-sm text-gray-500 text-center mt-2">
                        Klicke auf das Bild, um es zu ändern
                    </p>
                </div>

                <!-- Form Section -->
                <form class="w-full md:w-2/3 flex flex-col gap-6 mt-8 md:mt-0" @submit.prevent="saveProfile">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="flex flex-col gap-1">
                            <label for="firstName" class="text-purple-500 font-medium">Vorname</label>
                            <input 
                                type="text" 
                                id="firstName" 
                                v-model="user.first_name" 
                                placeholder="Vorname" 
                                class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors" 
                            />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label for="lastName" class="text-purple-500 font-medium">Nachname</label>
                            <input 
                                type="text" 
                                id="lastName" 
                                v-model="user.last_name" 
                                placeholder="Nachname" 
                                class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors" 
                            />
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-1">
                        <label for="userName" class="text-purple-500 font-medium">Benutzername</label>
                        <input 
                            type="text" 
                            id="userName" 
                            v-model="user.user_name" 
                            placeholder="benutzername" 
                            class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors" 
                        />
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="flex flex-col gap-1">
                            <label for="birthdate" class="text-purple-500 font-medium">Geburtsdatum</label>
                            <input 
                                type="date" 
                                id="birthdate" 
                                v-model="user.birthdate" 
                                class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors" 
                            />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label for="phone" class="text-purple-500 font-medium">Telefon</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                v-model="user.phonenumber" 
                                placeholder="+41 XX XXX XX XX" 
                                class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors" 
                            />
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-1">
                        <label for="address" class="text-purple-500 font-medium">Adresse</label>
                        <input 
                            type="text" 
                            id="address" 
                            v-model="user.adress" 
                            placeholder="Musterstrasse 123, 8001 Zürich" 
                            class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors" 
                        />
                    </div>
                    
                    <div class="flex flex-col gap-1">
                        <label for="bio" class="text-purple-500 font-medium">Bio</label>
                        <textarea 
                            id="bio" 
                            v-model="user.bio" 
                            rows="3" 
                            placeholder="Erzähle uns etwas über dich..." 
                            class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors"
                        ></textarea>
                    </div>
                    
                    <button 
                        type="submit" 
                        :disabled="saving"
                        class="w-full py-3 bg-gradient-to-r from-purple-500 to-sky-500 text-white rounded-xl text-lg font-bold hover:from-sky-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-2xl mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <span v-if="!saving">Änderungen speichern</span>
                        <span v-else class="flex items-center gap-2">
                            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Speichere...
                        </span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const session = inject('session')

// Reactive data
const user = ref({
    user_id: '',
    first_name: '',
    last_name: '',
    user_name: '',
    birthdate: '',
    phonenumber: '',
    adress: '',
    bio: '',
    profile_pictures: ''
})

const defaultAvatar = 'https://i.pinimg.com/736x/8c/14/9b/8c149bfad0dfc0366e70b97f679bd170.jpg'
const fileInput = ref(null)
const loading = ref(true)
const saving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Auto-hide messages after 3 seconds
function showMessage(message, isError = false) {
    if (isError) {
        errorMessage.value = message
        setTimeout(() => errorMessage.value = '', 3000)
    } else {
        successMessage.value = message
        setTimeout(() => successMessage.value = '', 3000)
    }
}

// Load user profile on component mount
onMounted(async () => {
    await loadUserProfile()
})

async function loadUserProfile() {
    try {
        loading.value = true
        const currentUser = session.user
        
        if (!currentUser) {
            router.push('/login')
            return
        }
        
        // Load profile data
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', currentUser.id)
            .single()
        
        if (profileError) {
            console.error('Error loading profile:', profileError)
            showMessage('Fehler beim Laden des Profils', true)
            return
        }
        
        // Set user data
        if (profile) {
            user.value = {
                ...profile,
                avatar: profile.profile_pictures || defaultAvatar
            }
        }
        
    } catch (error) {
        console.error('Error:', error)
        showMessage('Ein Fehler ist aufgetreten', true)
    } finally {
        loading.value = false
    }
}

async function saveProfile() {
    try {
        saving.value = true
        const currentUser = session.user
        
        if (!currentUser) {
            router.push('/login')
            return
        }
        
        // Prepare update data
        const updateData = {
            first_name: user.value.first_name?.trim() || null,
            last_name: user.value.last_name?.trim() || null,
            user_name: user.value.user_name?.trim() || null,
            birthdate: user.value.birthdate || null,
            phonenumber: user.value.phonenumber?.trim() || null,
            adress: user.value.adress?.trim() || null,
            bio: user.value.bio?.trim() || null,
            profile_pictures: user.value.profile_pictures || null,
            updated_at: new Date().toISOString()
        }
        
        // Update profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('user_id', currentUser.id)
        
        if (updateError) {
            throw updateError
        }
        
        showMessage('Profil erfolgreich aktualisiert!')
        
    } catch (error) {
        console.error('Error saving profile:', error)
        
        if (error.message.includes('duplicate key value violates unique constraint')) {
            showMessage('Dieser Benutzername ist bereits vergeben', true)
        } else {
            showMessage('Fehler beim Speichern des Profils', true)
        }
    } finally {
        saving.value = false
    }
}

function openFileInput() {
    fileInput.value.click()
}

async function onFileChange(event) {
    const file = event.target.files[0]
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showMessage('Bitte wählen Sie eine gültige Bilddatei aus', true)
        return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showMessage('Die Datei ist zu groß. Maximal 5MB erlaubt.', true)
        return
    }
    
    try {
        const currentUser = session.user
        
        if (!currentUser) {
            router.push('/login')
            return
        }
        
        // Create unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`
        
        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('avatars') // Bucket-Name
            .upload(fileName, file, { upsert: true }) // upsert = überschreibt, wenn schon vorhanden
        
        if (uploadError) {
            console.warn('Upload failed:', uploadError)
            showMessage('Fehler beim Hochladen', true)
            return
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName)
        
        // Update user object
        user.value.avatar = publicUrl
        user.value.profile_pictures = publicUrl
        
        // Save new URL in database
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ profile_pictures: publicUrl, updated_at: new Date().toISOString() })
            .eq('user_id', currentUser.id)
        
        if (updateError) {
            console.error('Error updating profile picture:', updateError)
            showMessage('Fehler beim Speichern des Profilbildes', true)
            return
        }
        
        showMessage('Profilbild aktualisiert!')
        
    } catch (error) {
        console.error('Error uploading file:', error)
        showMessage('Ein Fehler ist aufgetreten', true)
    }
}

</script>