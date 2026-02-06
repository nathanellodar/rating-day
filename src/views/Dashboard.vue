<template>
  <div class="dashboard min-h-screen bg-gray-50">
    <NavBar />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ greeting }}{{ user?.username ? (', ' + user.username + '!') : '!' }}
        </h1>
        <p class="text-gray-600">Here's an overview of your rating activity.</p>
      </div>

      <!-- Stats Section -->
      <div class="mb-8">
        <RatingStats
          :average-rating="stats.averageRating"
          :total-ratings="stats.totalRatings"
          :rating-distribution="stats.ratingDistribution"
        />
      </div>

      <!-- Quick Actions -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <router-link
            to="/ratings/new"
            class="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <div class="flex items-center">
              <svg
                class="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <div>
                <h3 class="font-medium">Add New Rating</h3>
                <p class="text-sm opacity-90">Rate a new item</p>
              </div>
            </div>
          </router-link>

          <router-link
            to="/ratings"
            class="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            <div class="flex items-center">
              <svg
                class="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <div>
                <h3 class="font-medium">View All Ratings</h3>
                <p class="text-sm opacity-90">Browse your ratings</p>
              </div>
            </div>
          </router-link>

          <router-link
            to="/user-ratings"
            class="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <div class="flex items-center">
              <svg
                class="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2h2v-2a11 11 0 10-20 0v2h2v-2z"
                />
              </svg>
              <div>
                <h3 class="font-medium">User Ratings</h3>
                <p class="text-sm opacity-90">See all user ratings</p>
              </div>
            </div>
          </router-link>

          <div class="bg-purple-600 text-white p-4 rounded-lg">
            <div class="flex items-center">
              <svg
                class="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <div>
                <h3 class="font-medium">Profile</h3>
                <p class="text-sm opacity-90">Manage your account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Ratings -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Recent Ratings</h2>
          <router-link
            to="/ratings"
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all →
          </router-link>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
          ></div>
          <p class="mt-2 text-gray-600">Loading recent ratings...</p>
        </div>

        <div v-else-if="recentRatings.length === 0" class="text-center py-8">
          <p class="text-gray-600">
            No ratings yet.
            <router-link
              to="/ratings/new"
              class="text-blue-600 hover:text-blue-800"
              >Add your first rating</router-link
            >
          </p>
        </div>

        <div v-else class="space-y-4">
          <RatingItem
            v-for="rating in recentRatings"
            :key="rating.id"
            :rating="rating"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAuth } from "../composables/useAuth.js";
import { useRatings } from "../composables/useRatings.js";
import NavBar from "../components/Layout/NavBar.vue";
import RatingStats from "../components/Ratings/RatingStats.vue";
import RatingItem from "../components/Ratings/RatingItem.vue";

const { user, getMe } = useAuth();
const { ratings, loading, fetchRatings, deleteRating } = useRatings();

const stats = ref({
  averageRating: 0,
  totalRatings: 0,
  ratingDistribution: {},
});

// Time-based greeting
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
});

onMounted(async () => {
  // Fetch latest user from backend then fetch ratings
  try {
    await getMe();
  } catch (e) {
    // ignore - user may be unauthenticated
  }

  await fetchRatings();
  calculateStats();
});

// Recalculate stats whenever ratings change
watch(ratings, () => {
  calculateStats();
});

const recentRatings = computed(() => {
  return ratings.value.slice(0, 5);
});

const calculateStats = () => {
  if (ratings.value.length === 0) return;

  const total = ratings.value.length;

  // Convert 1-10 score into 1-5 scale for display
  const mappedScores = ratings.value.map((r) => {
    const s = Number(r.score ?? r.dataValues?.score ?? r.rating ?? 0);
    // map 1-10 -> 1-5
    return Math.max(1, Math.min(5, Math.ceil(s / 2)));
  });

  const sum = mappedScores.reduce((acc, v) => acc + v, 0);
  const average = total ? sum / total : 0;

  const distribution = {};
  for (let i = 1; i <= 5; i++) {
    distribution[i] = mappedScores.filter((v) => v === i).length;
  }

  stats.value = {
    averageRating: average,
    totalRatings: total,
    ratingDistribution: distribution,
  };
};

const handleEdit = (rating) => {
  // Navigate to edit page or open modal
  console.log("Edit rating:", rating);
};

const handleDelete = async (ratingId) => {
  if (confirm("Are you sure you want to delete this rating?")) {
    try {
      await deleteRating(ratingId);
      calculateStats(); // Recalculate stats after deletion
    } catch (error) {
      alert("Failed to delete rating: " + error.message);
    }
  }
};
</script>
