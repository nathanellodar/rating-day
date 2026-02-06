<template>
  <div
    class="rating-stats bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
  >
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Rating Statistics</h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="text-center">
        <div class="text-3xl font-bold text-blue-600">
          {{ averageRating.toFixed(1) }}
        </div>
        <div class="text-sm text-gray-600">Average Rating</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-green-600">{{ totalRatings }}</div>
        <div class="text-sm text-gray-600">Total Ratings</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-purple-600">
          {{ ratingDistribution[5] || 0 }}
        </div>
        <div class="text-sm text-gray-600">5-Star Ratings</div>
      </div>
    </div>

    <div class="space-y-2">
      <h4 class="text-sm font-medium text-gray-700 mb-3">
        Rating Distribution
      </h4>
      <div
        v-for="star in [5, 4, 3, 2, 1]"
        :key="star"
        class="flex items-center space-x-2"
      >
        <span class="text-sm text-gray-600 w-8">{{ star }}★</span>
        <div class="flex-1 bg-gray-200 rounded-full h-2">
          <div
            class="bg-yellow-400 h-2 rounded-full"
            :style="{
              width: `${totalRatings ? ((ratingDistribution[star] || 0) / totalRatings) * 100 : 0}%`,
            }"
          ></div>
        </div>
        <span class="text-sm text-gray-600 w-8 text-right">{{
          ratingDistribution[star] || 0
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  averageRating: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  ratingDistribution: {
    type: Object,
    default: () => ({}),
  },
});
</script>
