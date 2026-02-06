<template>
  <div class="user-ratings-page min-h-screen bg-gray-50">
    <NavBar />

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">User Ratings</h1>
            <p class="text-gray-600 mt-2">Browse all user ratings</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading users...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="users.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2h2v-2a11 11 0 10-20 0v2h2v-2z" />
        </svg>
        <p class="text-gray-600 mb-4">No users found.</p>
      </div>

      <!-- Users List -->
      <div v-else>
        <div class="mb-6">
          <div class="flex gap-2 flex-col sm:flex-row">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search users..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              v-model="sortBy"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="username">Sort by Name</option>
              <option value="avgScore">Sort by Avg Score (High)</option>
              <option value="avgScoreLow">Sort by Avg Score (Low)</option>
              <option value="ratingCount">Sort by # of Ratings</option>
            </select>
          </div>
          <p class="text-gray-600 mt-2">Showing {{ filteredUsers.length }} of {{ users.length }} users</p>
        </div>

        <div class="space-y-6">
          <UserCard
            v-for="user in filteredUsers"
            :key="user.id"
            :user="user"
          />
        </div>
      </div>

      <div class="mt-8 text-center">
        <router-link to="/dashboard" class="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserRatings } from '../composables/useUserRatings.js';
import NavBar from '../components/Layout/NavBar.vue';
import UserCard from '../components/Users/UserCard.vue';

const { users, loading, fetchAllUsersWithRatings } = useUserRatings();
const searchQuery = ref('');
const sortBy = ref('username');

onMounted(async () => {
  await fetchAllUsersWithRatings();
});

const filteredUsers = computed(() => {
  let filtered = users.value.filter(user =>
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  // Sort
  if (sortBy.value === 'username') {
    filtered.sort((a, b) => a.username.localeCompare(b.username));
  } else if (sortBy.value === 'avgScore') {
    filtered.sort((a, b) => parseFloat(b.averageScore) - parseFloat(a.averageScore));
  } else if (sortBy.value === 'avgScoreLow') {
    filtered.sort((a, b) => parseFloat(a.averageScore) - parseFloat(b.averageScore));
  } else if (sortBy.value === 'ratingCount') {
    filtered.sort((a, b) => b.ratingCount - a.ratingCount);
  }

  return filtered;
});
</script>
