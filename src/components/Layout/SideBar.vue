<template>
  <div
    class="sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
  >
    <div
      class="flex items-center justify-between h-16 px-4 border-b border-gray-200"
    >
      <span class="text-xl font-bold text-gray-900">RatingDay</span>
      <button
        @click="closeSidebar"
        class="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <nav class="mt-8">
      <router-link
        to="/dashboard"
        @click="closeSidebar"
        class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        :class="{
          'bg-blue-50 text-blue-700 border-r-4 border-blue-700':
            $route.path === '/dashboard',
        }"
      >
        <svg
          class="w-5 h-5 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
          />
        </svg>
        Dashboard
      </router-link>

      <router-link
        to="/ratings"
        @click="closeSidebar"
        class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        :class="{
          'bg-blue-50 text-blue-700 border-r-4 border-blue-700':
            $route.path === '/ratings',
        }"
      >
        <svg
          class="w-5 h-5 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        My Ratings
      </router-link>

      <router-link
        to="/ratings/new"
        @click="closeSidebar"
        class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        :class="{
          'bg-blue-50 text-blue-700 border-r-4 border-blue-700':
            $route.path === '/ratings/new',
        }"
      >
        <svg
          class="w-5 h-5 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add Rating
      </router-link>
    </nav>

    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div
            class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
          >
            <span class="text-sm font-medium text-gray-700">{{
              userInitials
            }}</span>
          </div>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">{{ user?.username }}</p>
          <button
            @click="logout"
            class="text-xs text-gray-500 hover:text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Overlay -->
  <div
    v-if="isOpen"
    @click="closeSidebar"
    class="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
  ></div>
</template>

<script setup>
import { computed } from "vue";
import { useAuth } from "../../composables/useAuth.js";
import { useRouter } from "vue-router";

const { user, logout } = useAuth();
const router = useRouter();

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const userInitials = computed(() => {
  if (!user.value?.username) return "U";
  return user.value.username.charAt(0).toUpperCase();
});

const closeSidebar = () => {
  emit("close");
};

const handleLogout = () => {
  logout();
  router.push("/login");
  closeSidebar();
};
</script>
