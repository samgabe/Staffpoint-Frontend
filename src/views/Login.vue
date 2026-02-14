<template>
  <div class="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-6">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Welcome Back</h2>
        <p class="text-gray-600 mt-2">Login to your account</p>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="isVisible ? 'text' : 'password'"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="********"
              required
            />

            <button
              type="button"
              @click="togglePassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <EyeIcon v-if="isVisible" class="w-5 h-5 text-gray-400 cursor-pointer" />
              <EyeSlashIcon v-else class="w-5 h-5 text-gray-400 cursor-pointer" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <p class="text-center text-gray-600 mt-6">
        Don't have an account?
        <span class="hover:underline text-blue-400 font-bold text-lg cursor-pointer">Contact the administrator.</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth";

const email = ref("");
const password = ref("");
const isVisible = ref(false);

const loading = ref(false);
const error = ref("");
const authStore = useAuthStore();
const router = useRouter();

function togglePassword() {
  isVisible.value = !isVisible.value;
}

const handleLogin = async () => {
  error.value = "";
  loading.value = true;

  const result = await authStore.login(email.value, password.value);

  loading.value = false;
  if (!result.success) {
    error.value = result.message;
    return;
  }

  router.push("/app/dashboard");
};
</script>
