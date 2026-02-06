<template>
  <div class="ratings-list-page min-h-screen bg-gray-50">
    <NavBar />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">All Ratings</h1>
          <router-link
            to="/ratings/new"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Rating
          </router-link>
        </div>
        <p class="text-gray-600 mt-2">Browse and manage all your ratings.</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading ratings...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="ratings.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-600 mb-4">No ratings yet.</p>
        <router-link to="/ratings/new" class="text-blue-600 hover:text-blue-800 font-medium">
          Create your first rating
        </router-link>
      </div>

      <!-- Ratings List -->
      <div v-else class="space-y-4">
        <div class="flex justify-between items-center mb-4">
          <p class="text-gray-600">Total ratings: {{ ratings.length }}</p>
          <div class="flex gap-2">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search ratings..."
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="space-y-4">
          <RatingItem
            v-for="rating in filteredRatings"
            :key="rating.id"
            :rating="rating"
            @edit="handleEdit"
            @delete="handleDelete"
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
import { ref, computed, onMounted } from "vue";
import { useRatings } from "../composables/useRatings.js";
import NavBar from "../components/Layout/NavBar.vue";
import RatingItem from "../components/Ratings/RatingItem.vue";

const { ratings, loading, fetchRatings, deleteRating } = useRatings();
const searchQuery = ref("");

onMounted(async () => {
  await fetchRatings();
});

const filteredRatings = computed(() => {
  if (!searchQuery.value) return ratings.value;

  const query = searchQuery.value.toLowerCase();
  return ratings.value.filter((rating) =>
    rating.note?.toLowerCase().includes(query) ||
    new Date(rating.date).toLocaleDateString().includes(query)
  );
});

const handleEdit = (rating) => {
  console.log("Edit rating:", rating);
};

const handleDelete = async (ratingId) => {
  if (confirm("Are you sure you want to delete this rating?")) {
    try {
      await deleteRating(ratingId);
    } catch (error) {
      alert("Failed to delete rating: " + error.message);
    }
  }
};
</script>
