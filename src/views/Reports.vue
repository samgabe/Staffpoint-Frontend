<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-3xl font-extrabold tracking-tight text-[#061b4f] md:text-4xl">Reports</h1>
      <p class="mt-1 text-sm text-slate-500">Attendance exports for analytics and payroll</p>
    </div>

    <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-xl font-bold text-slate-800">Attendance Report</h2>
      <p class="mt-1 text-slate-500">Choose a date range and export as CSV or PDF.</p>

      <div class="mt-5 grid gap-3 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-600">From</label>
          <input v-model="from" type="date" class="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none ring-indigo-500 focus:ring-2" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-semibold text-slate-600">To</label>
          <input v-model="to" type="date" class="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none ring-indigo-500 focus:ring-2" />
        </div>
      </div>

      <div class="mt-5 flex flex-wrap gap-3">
        <button class="rounded-xl bg-[#112c63] px-4 py-2 font-semibold text-white hover:bg-[#0c234f]" :disabled="loading" @click="downloadCSV">
          {{ loading ? "Generating..." : "Download CSV" }}
        </button>
        <button class="rounded-xl bg-amber-500 px-4 py-2 font-semibold text-white hover:bg-amber-600" :disabled="loading" @click="downloadPDF">
          {{ loading ? "Generating..." : "Download PDF" }}
        </button>
      </div>
    </article>

    <div v-if="message" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{{ message }}</div>
    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{{ error }}</div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import API from "@/api/axios";

const from = ref("2026-01-01");
const to = ref(new Date().toISOString().slice(0, 10));
const loading = ref(false);
const message = ref("");
const error = ref("");

function saveBlob(data, filename) {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

async function download(type) {
  loading.value = true;
  message.value = "";
  error.value = "";
  try {
    const res = await API.get(`/reports/attendance/${type}?from=${from.value}&to=${to.value}`, { responseType: "blob" });
    saveBlob(res.data, `attendance_${from.value}_to_${to.value}.${type}`);
    message.value = `${type.toUpperCase()} report downloaded`;
  } catch (downloadError) {
    error.value = downloadError?.response?.data?.error || "Failed to download report";
  } finally {
    loading.value = false;
  }
}

function downloadCSV() {
  download("csv");
}

function downloadPDF() {
  download("pdf");
}
</script>
