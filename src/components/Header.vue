<template>
  <nav class="main-header">
    <div class="header-left">
      <router-link to="/" class="ily-text"><img src="../assets/logo.png" alt="Logo" class="header-logo" /></router-link>
    </div>

    <div class="header-center">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/games" class="nav-link">Game</router-link>
      <template v-if="isLoggedIn">
        <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
      </template>
      <template v-else>
        <router-link to="/login" class="nav-link">Login</router-link>
        <router-link to="/register" class="nav-link">Register</router-link>
      </template>
    </div>
    <div class="header-right">
      <template v-if="isLoggedIn">
      <div @mouseenter="showPopup(true)" @mouseleave="showPopup(false)">
        <img :src="user.profile_picture || defaultAvatar" alt="Profile"
          class="w-10 h-10 rounded-full object-cover border-2 border-purple-500 cursor-pointer" />

        <!-- Popup Card -->
        <div class="card-content" v-show="popupVisible">
          <router-link to="/profile" class="popup-button">Mein Profil</router-link>
          <button @click="logout" class="popup-button">Logout</button>
        </div>
      </div>
  </template>
    </div>

</nav>
</template>


<script setup>
import { ref, watch, inject, onUnmounted } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const session = inject('session')

const isLoggedIn = ref(false)
const user = ref({
  id: '',
  username: '',
  profile_picture: ''
})


const forceRefreshProfile = async () => {
  if (session.user) {
    await fetchUserProfile(session.user)
  }
}

const handleForceRefresh = () => {
  forceRefreshProfile()
}

window.addEventListener('forceProfileRefresh', handleForceRefresh)

const popupVisible = ref(false)
const defaultAvatar = '../assets/default-avatar.png'
let profileSubscription = null

const showPopup = (value) => {
  popupVisible.value = value
}

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}


const fetchUserProfile = async (currentUser) => {
  if (!currentUser) {
    isLoggedIn.value = false
    user.value = { id: '', username: '', profile_picture: '' }
    if (profileSubscription) {
      supabase.removeChannel(profileSubscription)
      profileSubscription = null
    }
    return
  }

  isLoggedIn.value = true
  const { data: profile, error } = await supabase
    .from('users')
    .select('username, profile_picture')
    .eq('user_id', currentUser.id)
    .single()

  if (!error && profile) {
    user.value.id = currentUser.id
    user.value.username = profile.username
    user.value.profile_picture = profile.profile_picture
  }


  if (!profileSubscription) {
    console.log('Subscribing to profile updates for user:', currentUser.id)
    profileSubscription = supabase
      .channel(`profile:${currentUser.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `user_id=eq.${currentUser.id}` },
        (payload) => {
          console.log('Real-time update received:', payload)
          if (payload.new) {
            user.value.profile_picture = payload.new.profile_picture
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to profile updates!')
        } else {
          console.error('Failed to subscribe to profile updates:', err)
        }
      })
  }
}

// Watch for changes in the session and update the user profile
watch(
  () => session.user,
  (newUser) => {
    fetchUserProfile(newUser)
  },
  { immediate: true } // Fetch profile immediately when the component is mounted
)

// Unsubscribe on component unmount
onUnmounted(() => {
  if (profileSubscription) {
    console.log('Unsubscribing from profile updates.')
    supabase.removeChannel(profileSubscription)
  }
})
</script>


<style scoped>
.header-right {
  position: relative;
}

.header-logo {
  height: 40px;
  width: 40px;
  border-radius: 8px;
}

.card-content {
  position: absolute;
  top: 100%;
  /* direkt unter dem Bild */
  right: 0;
  /* rechtsbündig */
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  gap: 0.5rem;
  width: 200px;
  z-index: 50;
}

.popup-button {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: #7f5af0;
  border: none;
  border-radius: 0.5rem;
  text-align: left;
  text-decoration: none;
  font-family: 'Montserrat', Arial, sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.popup-button:hover {
  background-color: #f0f0f0;
  color: #6a48d7;
}

.main-header {
  width: 100%;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: linear-gradient(90deg, #7f5af0 0%, #0ea5e9 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.ily-text {
  font-family: 'Montserrat', Arial, sans-serif;
  font-size: 1.7rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.1em;
}

.header-center {
  flex: 2;
  display: flex;
  justify-content: center;
  gap: 2.5rem;
}

.nav-link {
  color: #fff;
  font-family: 'Montserrat', Arial, sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background 0.2s, color 0.2s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #0ea5e9;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

@media (max-width: 700px) {
  .main-header {
    flex-direction: column;
    padding: 0.5rem 0.5rem;
    min-height: 80px;
  }

  .header-center {
    gap: 1rem;
    font-size: 1rem;
  }

  .ily-text {
    font-size: 1.2rem;
  }

}
</style>