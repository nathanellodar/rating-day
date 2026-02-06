<template>
  <div class="user-detail-page min-h-screen bg-gray-50">
    <NavBar />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div v-if="userData" class="mb-8">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ userData.user.username }}</h1>
            <p class="text-gray-600 mt-2">{{ userData.user.ratingCount }} ratings • Average: {{ userData.user.averageScore }}/10</p>
          </div>
          <div class="text-right">
            <div class="text-4xl font-bold text-blue-600">{{ userData.user.averageScore }}</div>
            <p class="text-sm text-gray-600 mt-1">Average Score</p>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-3 gap-4">
          <div class="bg-white rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-blue-600">{{ userData.user.ratingCount }}</div>
            <p class="text-sm text-gray-600 mt-1">Total Ratings</p>
          </div>
          <div class="bg-white rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-600">{{ highestScore }}</div>
            <p class="text-sm text-gray-600 mt-1">Highest</p>
          </div>
          <div class="bg-white rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-orange-600">{{ lowestScore }}</div>
            <p class="text-sm text-gray-600 mt-1">Lowest</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading ratings...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="!userData || userData.ratings.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-600 mb-4">No ratings yet.</p>
      </div>

      <!-- Ratings List -->
      <div v-else class="space-y-4">
        <div class="flex justify-between items-center mb-4">
          <p class="text-gray-600">Showing {{ userData.ratings.length }} ratings</p>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by note..."
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="space-y-4">
          <div
            v-for="rating in filteredRatings"
            :key="rating.id"
            class="rating-item bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-900">{{ formatDate(rating.date) }}</span>
                <span class="text-2xl">{{ getEmoji(rating.score) }}</span>
                <span class="text-sm font-bold text-blue-600">({{ rating.score }}/10)</span>
              </div>
            </div>

            <div v-if="rating.note" class="text-gray-700 text-sm">
              {{ rating.note }}
            </div>
            <div v-else class="text-gray-400 text-sm italic">
              No note
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="userData.total > limit" class="flex justify-center gap-2 mt-8">
          <button
            v-if="currentPage > 1"
            @click="previousPage"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Previous
          </button>
          <span class="px-4 py-2 text-gray-700">
            Page {{ currentPage }} of {{ Math.ceil(userData.total / limit) }}
          </span>
          <button
            v-if="currentPage < Math.ceil(userData.total / limit)"
            @click="nextPage"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>

      <div class="mt-8 text-center">
        <router-link to="/user-ratings" class="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Users
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserRatings } from '../composables/useUserRatings.js';
import NavBar from '../components/Layout/NavBar.vue';

const route = useRoute();
const { loading, error, fetchUserRatings } = useUserRatings();
const userData = ref(null);
const searchQuery = ref('');
const currentPage = ref(1);
const limit = 20;

onMounted(async () => {
  await loadUserRatings();
});

const loadUserRatings = async () => {
  try {
    const response = await fetchUserRatings(route.params.userId, currentPage.value, limit);
    userData.value = response;
  } catch (err) {
    console.error('Failed to load user ratings:', err);
  }
};

const filteredRatings = computed(() => {
  if (!userData.value) return [];
  return userData.value.ratings.filter(rating =>
    (rating.note || '').toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const highestScore = computed(() => {
  if (!userData.value || userData.value.ratings.length === 0) return 'N/A';
  return Math.max(...userData.value.ratings.map(r => r.score));
});

const lowestScore = computed(() => {
  if (!userData.value || userData.value.ratings.length === 0) return 'N/A';
  return Math.min(...userData.value.ratings.map(r => r.score));
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getEmoji = (score) => {
  if (score <= 2) return '😢';
  if (score <= 4) return '😕';
  if (score <= 6) return '😐';
  if (score <= 8) return '🙂';
  return '😄';
};

const nextPage = async () => {
  currentPage.value++;
  await loadUserRatings();
};

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await loadUserRatings();
  }
};
</script>
