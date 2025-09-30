
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Profile from '../views/Profile.vue';
import AddPartner from '../views/AddPartner.vue';
import PartnerProfile from '../views/PartnerProfile.vue';
import Games from '../views/Games.vue';
import { supabase } from '../supabase';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/games',
    name: 'Games',
    component: Games,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/add-partner',
    name: 'AddPartner',
    component: AddPartner,
    meta: { requiresAuth: true },
  },
  {
    path: '/partner/:id',
    name: 'PartnerProfile',
    component: PartnerProfile,
    meta: { requiresAuth: true },
  },
  ];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !session) {
    next('/login');
  } else {
    next();
  }
});

export default router;