<template>
  <div class="rating-form-page min-h-screen bg-gray-50">
    <NavBar />

    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Add New Rating</h1>
        <p class="text-gray-600">Rate an item and share your thoughts.</p>
      </div>

      <div class="bg-white shadow-sm rounded-lg p-6">
        <RatingForm @success="handleSuccess" @error="handleError" />

        <div
          v-if="successMessage"
          class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">
                {{ successMessage }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">
                {{ errorMessage }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center">
        <router-link
          to="/dashboard"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import NavBar from "../components/Layout/NavBar.vue";
import RatingForm from "../components/Ratings/RatingForm.vue";

const router = useRouter();
const successMessage = ref("");
const errorMessage = ref("");

const handleSuccess = (rating) => {
  successMessage.value = "Rating submitted successfully!";
  errorMessage.value = "";

  // Redirect to dashboard after a short delay
  setTimeout(() => {
    router.push("/dashboard");
  }, 2000);
};

const handleError = (error) => {
  errorMessage.value = error;
  successMessage.value = "";
};
</script>
