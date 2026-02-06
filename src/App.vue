<script setup>
import { useAuth } from './composables/useAuth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const { isAuthenticated } = useAuth()

const isAuthPage = computed(() => {
  return router.currentRoute.value.path === '/login' || router.currentRoute.value.path === '/register'
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>

<style scoped>
</style>
