<template>
  <div class="rating-list">
    <div class="mb-4 flex flex-col sm:flex-row gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search ratings..."
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <select
        v-model="sortBy"
        class="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="created_at">Newest First</option>
        <option value="rating">Highest Rating</option>
        <option value="item_id">Item ID</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
      ></div>
      <p class="mt-2 text-gray-600">Loading ratings...</p>
    </div>

    <div v-else-if="filteredRatings.length === 0" class="text-center py-8">
      <p class="text-gray-600">No ratings found.</p>
    </div>

    <div v-else class="space-y-4">
      <RatingItem
        v-for="rating in paginatedRatings"
        :key="rating.id"
        :rating="rating"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <div v-if="totalPages > 1" class="mt-6 flex justify-center">
      <nav class="flex items-center space-x-1">
        <button
          @click="currentPage > 1 && currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-2 text-sm font-medium border',
            page === currentPage
              ? 'text-blue-600 bg-blue-50 border-blue-500'
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50',
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="currentPage < totalPages && currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRatings } from "../../composables/useRatings.js";
import RatingItem from "./RatingItem.vue";

const { ratings, loading, fetchRatings, deleteRating } = useRatings();

const searchQuery = ref("");
const sortBy = ref("created_at");
const currentPage = ref(1);
const itemsPerPage = 10;

const emit = defineEmits(["edit"]);

onMounted(() => {
  fetchRatings();
});

const filteredRatings = computed(() => {
  let filtered = [...ratings.value];

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(
      (rating) =>
        rating.comment
          ?.toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        rating.item_id.toString().includes(searchQuery.value),
    );
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case "rating":
        return b.rating - a.rating;
      case "item_id":
        return a.item_id - b.item_id;
      case "created_at":
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  return filtered;
});

const totalPages = computed(() =>
  Math.ceil(filteredRatings.value.length / itemsPerPage),
);

const paginatedRatings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredRatings.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const handleEdit = (rating) => {
  emit("edit", rating);
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
