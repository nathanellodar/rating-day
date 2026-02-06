<template>
  <div class="user-card bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all">
    <!-- Header -->
    <div class="border-b border-gray-200 p-5 bg-gradient-to-r from-blue-50 to-transparent">
      <div class="flex justify-between items-start mb-3">
        <div>
          <h3 class="text-lg font-bold text-gray-900">{{ user.username }}</h3>
          <p class="text-sm text-gray-600">{{ user.ratingCount }} ratings</p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold text-blue-600">{{ user.averageScore }}</div>
          <p class="text-xs text-gray-600">Avg Score</p>
        </div>
      </div>
    </div>

    <!-- Ratings List -->
    <div class="max-h-96 overflow-y-auto">
      <div v-if="user.ratings && user.ratings.length > 0" class="divide-y">
        <div
          v-for="rating in user.ratings"
          :key="rating.id"
          class="p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-medium text-gray-900">{{ formatDate(rating.date) }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-lg">{{ getEmoji(rating.score) }}</span>
              <span class="font-bold text-blue-600">{{ rating.score }}/10</span>
            </div>
          </div>
          <div v-if="rating.note" class="text-sm text-gray-700 text-left">
            {{ truncateNote(rating.note) }}
          </div>
          <div v-else class="text-sm text-gray-400 italic">
            No note
          </div>
        </div>
      </div>
      <div v-else class="p-4 text-center text-gray-400">
        No ratings yet
      </div>
    </div>

    <!-- Footer Stats -->
    <div v-if="user.ratings && user.ratings.length > 0" class="border-t border-gray-200 p-4 bg-gray-50 grid grid-cols-3 gap-2 text-center">
      <div>
        <p class="text-xs text-gray-600">Highest</p>
        <p class="font-bold text-green-600">{{ highestScore }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-600">Lowest</p>
        <p class="font-bold text-orange-600">{{ lowestScore }}</p>
      </div>
      <div>
        <p class="text-xs text-gray-600">Latest</p>
        <p class="text-sm font-medium text-gray-900">{{ formatDate(user.latestRating.date) }}</p>
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
