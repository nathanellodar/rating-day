<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/dashboard" class="flex items-center">
            <span class="text-xl font-bold text-gray-900">RatingDay</span>
          </router-link>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link
            to="/dashboard"
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/dashboard' }"
          >
            Dashboard
          </router-link>
          <router-link
            to="/ratings"
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/ratings' }"
          >
            My Ratings
          </router-link>
          <router-link
            to="/ratings/new"
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/ratings/new' }"
          >
            Add Rating
          </router-link>
        </div>

        <!-- Desktop User Section -->
        <div class="hidden md:flex items-center space-x-4">
          <span class="text-sm text-gray-700">{{ user?.username }}</span>
          <button
            @click="handleLogout"
            class="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <!-- Mobile Burger Menu Button -->
        <div class="md:hidden flex items-center">
          <button
            @click="toggleMenu"
            class="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="isMenuOpen"
        class="md:hidden bg-white border-t border-gray-200"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            to="/dashboard"
            class="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/dashboard' }"
            @click="isMenuOpen = false"
          >
            Dashboard
          </router-link>
          <router-link
            to="/ratings"
            class="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/ratings' }"
            @click="isMenuOpen = false"
          >
            My Ratings
          </router-link>
          <router-link
            to="/ratings/new"
            class="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': $route.path === '/ratings/new' }"
            @click="isMenuOpen = false"
          >
            Add Rating
          </router-link>

          <!-- Mobile User Section -->
          <div class="border-t border-gray-200 pt-3 mt-3 px-3 py-2 space-y-2">
            <div class="text-sm text-gray-700 font-medium">
              {{ user?.username }}
            </div>
            <button
              @click="handleLogout"
              class="w-full text-left bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../../composables/useAuth.js";
import { useRouter } from "vue-router";

const { user, logout } = useAuth();
const router = useRouter();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleLogout = () => {
  logout();
  router.push("/login");
  isMenuOpen.value = false;
};
</script>
