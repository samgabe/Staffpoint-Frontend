<template>
  <section class="space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-[#061b4f] md:text-4xl">Audit Logs</h1>
        <p class="mt-1 text-sm text-slate-500">Track critical actions across the system</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="downloadCSV">
          CSV
        </button>
        <button class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="downloadPDF">
          PDF
        </button>
        <button class="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50" @click="fetchLogs">
          Refresh
        </button>
      </div>
    </div>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="grid gap-3 md:grid-cols-5">
        <input v-model="filters.from" type="date" class="h-11 rounded-xl border border-slate-200 px-3 outline-none ring-indigo-500 focus:ring-2" />
        <input v-model="filters.to" type="date" class="h-11 rounded-xl border border-slate-200 px-3 outline-none ring-indigo-500 focus:ring-2" />
        <input v-model="filters.user_id" type="text" placeholder="User ID" class="h-11 rounded-xl border border-slate-200 px-3 outline-none ring-indigo-500 focus:ring-2" />
        <input v-model="filters.action" type="text" placeholder="Action" class="h-11 rounded-xl border border-slate-200 px-3 outline-none ring-indigo-500 focus:ring-2" />
        <button class="h-11 rounded-xl bg-[#112c63] px-4 font-semibold text-white hover:bg-[#0c234f]" @click="fetchLogs">
          Filter
        </button>
      </div>
    </article>

    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{{ error }}</div>

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        <p class="col-span-3">Created At</p>
        <p class="col-span-3">User</p>
        <p class="col-span-2">Action</p>
        <p class="col-span-2">Entity</p>
        <p class="col-span-2">Entity ID</p>
      </div>

      <div v-if="logs.length === 0" class="px-4 py-8 text-center text-slate-500">No audit logs found</div>

      <div v-for="log in logs" :key="log.ID || log.id" class="grid grid-cols-12 items-center border-b border-slate-100 px-4 py-3 last:border-b-0">
        <p class="col-span-3 text-slate-600">{{ formatDate(log.CreatedAt || log.created_at) }}</p>
        <p class="col-span-3 text-slate-700">{{ log.User?.Email || log.user?.email || "N/A" }}</p>
        <p class="col-span-2 font-semibold text-slate-800">{{ log.Action || log.action }}</p>
        <p class="col-span-2 text-slate-700">{{ log.Entity || log.entity }}</p>
        <p class="col-span-2 truncate text-slate-500">{{ log.EntityID || log.entity_id || "-" }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import API from "@/api/axios";

const logs = ref([]);
const error = ref("");
const filters = ref({
  from: "2026-01-01",
  to: new Date().toISOString().slice(0, 10),
  user_id: "",
  action: "",
  limit: 100,
});

function formatDate(value) {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function buildQuery() {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters.value)) {
    if (value !== "" && value !== null && value !== undefined) {
      params.set(key, String(value));
    }
  }
  return params.toString();
}

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

async function fetchLogs() {
  error.value = "";
  try {
    const res = await API.get(`/audit-logs/?${buildQuery()}`);
    logs.value = res.data || [];
  } catch (fetchError) {
    error.value = fetchError?.response?.data?.error || "Failed to load audit logs";
  }
}

async function downloadCSV() {
  error.value = "";
  try {
    const res = await API.get(`/audit-logs/csv?${buildQuery()}`, { responseType: "blob" });
    saveBlob(res.data, "audit_logs.csv");
  } catch (downloadError) {
    error.value = downloadError?.response?.data?.error || "Failed to download CSV";
  }
}

async function downloadPDF() {
  error.value = "";
  try {
    const res = await API.get(`/audit-logs/pdf?${buildQuery()}`, { responseType: "blob" });
    saveBlob(res.data, "audit_logs.pdf");
  } catch (downloadError) {
    error.value = downloadError?.response?.data?.error || "Failed to download PDF";
  }
}

onMounted(() => {
  fetchLogs();
});
</script>
