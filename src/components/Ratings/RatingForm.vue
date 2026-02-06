<template>
  <div class="rating-form">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="date" class="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          id="date"
          v-model="formData.date"
          type="date"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Score
        </label>
        <input
          v-model.number="formData.score"
          type="range"
          min="1"
          max="10"
          class="w-full"
        />
        <p class="text-sm text-gray-500 mt-1">
          {{ formData.score }}/10 {{ currentEmoji }}
        </p>
      </div>

      <div>
        <label for="note" class="block text-sm font-medium text-gray-700 mb-1">
          Note (Optional)
        </label>
        <textarea
          id="note"
          v-model="formData.note"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add a note..."
        ></textarea>
      </div>

      <div v-if="error" class="text-red-600 text-sm">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? "Submitting..." : "Submit Rating" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRatings } from "../../composables/useRatings.js";

const { createRating, loading, error } = useRatings();

const formData = reactive({
  date: "",
  score: 1,
  note: "",
});

const emojiMap = {
  1: "😭",
  2: "😢",
  3: "🙁",
  4: "😐",
  5: "🙂",
  6: "😊",
  7: "😄",
  8: "😆",
  9: "🤩",
  10: "🥰",
};

const currentEmoji = computed(() => emojiMap[formData.score] || "😐");

const emit = defineEmits(["success", "error"]);

const handleSubmit = async () => {
  try {
    const rating = await createRating({
      date: formData.date,
      score: formData.score,
      note: formData.note || null,
    });

    // Reset form
    formData.date = "";
    formData.score = 1;
    formData.note = "";

    emit("success", rating);
  } catch (err) {
    emit("error", err.message);
  }
};
</script>
