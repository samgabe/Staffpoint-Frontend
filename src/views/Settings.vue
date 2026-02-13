<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-3xl font-extrabold tracking-tight text-[#061b4f] md:text-4xl">Settings</h1>
      <p class="mt-1 text-sm text-slate-500">Manage profile and account security</p>
    </div>

    <div v-if="message" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{{ message }}</div>
    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>

    <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-xl font-bold text-slate-800">Profile</h2>
      <form class="mt-4 space-y-4" @submit.prevent="saveProfile">
        <div class="grid gap-3 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-semibold text-slate-600">First Name</label>
            <input v-model="form.first_name" required class="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none ring-indigo-500 focus:ring-2" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-semibold text-slate-600">Last Name</label>
            <input v-model="form.last_name" required class="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none ring-indigo-500 focus:ring-2" />
          </div>
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-600">New Password (optional)</label>
          <input
            v-model="form.password"
            type="password"
            minlength="8"
            placeholder="Leave empty to keep current password"
            class="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none ring-indigo-500 focus:ring-2"
          />
        </div>
        <button type="submit" class="rounded-xl bg-[#112c63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c234f]" :disabled="loading">
          {{ loading ? "Saving..." : "Save Settings" }}
        </button>
      </form>
    </article>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import API from "@/api/axios";

const loading = ref(false);
const message = ref("");
const error = ref("");
const form = ref({
  first_name: "",
  last_name: "",
  password: "",
});

async function loadProfile() {
  try {
    const res = await API.get("/profile/");
    form.value.first_name = res.data?.first_name || "";
    form.value.last_name = res.data?.last_name || "";
  } catch (loadError) {
    error.value = loadError?.response?.data?.error || "Failed to load profile";
  }
}

async function saveProfile() {
  loading.value = true;
  message.value = "";
  error.value = "";
  try {
    await API.put("/profile/", form.value);
    message.value = "Settings updated successfully";
    form.value.password = "";
  } catch (saveError) {
    error.value = saveError?.response?.data?.error || "Failed to update settings";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadProfile();
});
</script>
