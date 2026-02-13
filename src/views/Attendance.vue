<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-3xl font-extrabold tracking-tight text-[#061b4f] md:text-4xl">Attendance</h1>
      <p class="mt-1 text-sm text-slate-500">Track daily clock-ins and clock-outs</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-bold text-slate-800">Clock In</h2>
        <p class="mt-1 text-slate-500">Register the start of today&apos;s shift.</p>
        <button
          class="mt-5 rounded-xl bg-[#112c63] px-4 py-2 font-semibold text-white hover:bg-[#0c234f]"
          :disabled="loading"
          @click="clockIn"
        >
          {{ loading ? "Submitting..." : "Clock In" }}
        </button>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-xl font-bold text-slate-800">Clock Out</h2>
        <p class="mt-1 text-slate-500">Register the end of today&apos;s shift.</p>
        <button
          class="mt-5 rounded-xl bg-amber-500 px-4 py-2 font-semibold text-white hover:bg-amber-600"
          :disabled="loading"
          @click="clockOut"
        >
          {{ loading ? "Submitting..." : "Clock Out" }}
        </button>
      </article>
    </div>

    <p v-if="message" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{{ message }}</p>
    <p v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{{ error }}</p>
  </section>
</template>

<script setup>
import { ref } from "vue";
import API from "@/api/axios";

const loading = ref(false);
const message = ref("");
const error = ref("");

async function perform(action) {
  loading.value = true;
  message.value = "";
  error.value = "";
  try {
    const response = await API.post(`/attendance/${action}`);
    message.value = response.data?.message || `Successfully ${action.replace("-", " ")}`;
  } catch (err) {
    error.value = err?.response?.data?.error || "Request failed";
  } finally {
    loading.value = false;
  }
}

function clockIn() {
  perform("clock-in");
}

function clockOut() {
  perform("clock-out");
}
</script>
