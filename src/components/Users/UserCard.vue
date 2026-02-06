<template>
  <div class="user-card bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all">
    <!-- Header -->
    <div class="border-b border-gray-200 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-transparent">
      <div class="flex justify-between items-start mb-3 gap-2">
        <div class="min-w-0">
          <h3 class="text-base sm:text-lg font-bold text-gray-900 break-words">{{ user.username }}</h3>
          <p class="text-xs sm:text-sm text-gray-600">{{ user.ratingCount }} ratings</p>
        </div>
        <div class="text-right flex-shrink-0">
          <div class="text-2xl sm:text-3xl font-bold text-blue-600">{{ user.averageScore }}</div>
          <p class="text-xs text-gray-600">Avg</p>
        </div>
      </div>
    </div>

    <!-- Ratings List -->
    <div class="max-h-64 sm:max-h-96 overflow-y-auto">
      <div v-if="user.ratings && user.ratings.length > 0" class="divide-y">
        <div
          v-for="rating in user.ratings"
          :key="rating.id"
          class="p-3 sm:p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between items-start mb-2 gap-2">
            <div class="min-w-0">
              <p class="text-xs sm:text-sm font-medium text-gray-900">{{ formatDate(rating.date) }}</p>
            </div>
            <div class="flex items-center space-x-1 flex-shrink-0">
              <span class="text-base sm:text-lg">{{ getEmoji(rating.score) }}</span>
              <span class="text-xs sm:text-sm font-bold text-blue-600 whitespace-nowrap">{{ rating.score }}/10</span>
            </div>
          </div>
          <div v-if="rating.note" class="text-xs sm:text-sm text-gray-700 text-left break-words">
            {{ truncateNote(rating.note) }}
          </div>
          <div v-else class="text-xs sm:text-sm text-gray-400 italic">
            No note
          </div>
        </div>
      </div>
      <div v-else class="p-3 sm:p-4 text-center text-gray-400 text-sm">
        No ratings yet
      </div>
    </div>

    <!-- Footer Stats -->
    <div v-if="user.ratings && user.ratings.length > 0" class="border-t border-gray-200 p-3 sm:p-4 bg-gray-50 grid grid-cols-3 gap-1 sm:gap-2 text-center">
      <div class="min-w-0">
        <p class="text-xs text-gray-600">Highest</p>
        <p class="text-sm sm:text-base font-bold text-green-600">{{ highestScore }}</p>
      </div>
      <div class="min-w-0">
        <p class="text-xs text-gray-600">Lowest</p>
        <p class="text-sm sm:text-base font-bold text-orange-600">{{ lowestScore }}</p>
      </div>
      <div class="min-w-0">
        <p class="text-xs text-gray-600">Latest</p>
        <p class="text-xs sm:text-sm font-medium text-gray-900 break-words">{{ formatDate(user.latestRating.date) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
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

const truncateNote = (note) => {
  if (!note) return '';
  return note.length > 150 ? note.substring(0, 150) + '...' : note;
};

const highestScore = computed(() => {
  if (!props.user.ratings || props.user.ratings.length === 0) return 'N/A';
  return Math.max(...props.user.ratings.map(r => r.score));
});

const lowestScore = computed(() => {
  if (!props.user.ratings || props.user.ratings.length === 0) return 'N/A';
  return Math.min(...props.user.ratings.map(r => r.score));
});
</script>

<style scoped>
.user-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.user-card:hover {
  border-color: #3b82f6;
}
</style>
