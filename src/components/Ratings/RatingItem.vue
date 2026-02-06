<template>
  <div
    class="rating-item bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
  >
    <div class="flex justify-between items-start mb-3">
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-900">{{
          formatDate(rating.date)
        }}</span>
        <span class="text-lg">{{ getEmoji(rating.score) }}</span>
        <span class="text-sm text-gray-600">({{ rating.score }}/10)</span>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="$emit('edit', rating)"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Edit
        </button>
        <button
          @click="$emit('delete', rating.id)"
          class="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>

    <div v-if="rating.note" class="mb-3">
      <p class="text-gray-700 text-sm">{{ rating.note }}</p>
    </div>

    <div class="text-xs text-gray-500">
      Created on {{ formatDateTime(rating.createdAt) }}
      <span v-if="rating.updatedAt !== rating.createdAt">
        • Updated {{ formatDateTime(rating.updatedAt) }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rating: {
    type: Object,
    required: true,
  },
});

defineEmits(["edit", "delete"]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getEmoji = (score) => {
  if (score <= 2) return "😢";
  if (score <= 4) return "😕";
  if (score <= 6) return "😐";
  if (score <= 8) return "😊";
  return "😍";
};
</script>
