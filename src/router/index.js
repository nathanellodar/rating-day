import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import Dashboard from '../views/Dashboard.vue'
import RatingFormPage from '../views/RatingFormPage.vue'
import RatingsListPage from '../views/RatingsListPage.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { requiresGuest: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage,
        meta: { requiresGuest: true }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/ratings',
        name: 'RatingsList',
        component: RatingsListPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/ratings/new',
        name: 'RatingForm',
        component: RatingFormPage,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
    const { isAuthenticated } = useAuth()

    if (to.meta.requiresAuth && !isAuthenticated.value) {
        next('/login')
    } else if (to.meta.requiresGuest && isAuthenticated.value) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router