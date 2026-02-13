<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-[#061b4f] md:text-4xl">Leave Management</h1>
        <p class="mt-1 text-sm text-slate-500">Request leave, track statuses, and review team requests</p>
      </div>
    </div>

    <div class="grid gap-3 md:grid-cols-3">
      <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">My Requests</p>
        <p class="mt-1 text-2xl font-bold text-slate-800">{{ myLeaves.length }}</p>
      </article>
      <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">My Pending</p>
        <p class="mt-1 text-2xl font-bold text-amber-600">{{ myPendingCount }}</p>
      </article>
      <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Team Pending</p>
        <p class="mt-1 text-2xl font-bold text-[#112c63]">{{ pendingLeaves.length }}</p>
      </article>
    </div>

    <div v-if="message" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{{ message }}</div>
    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 class="text-lg font-bold text-slate-800">Request Leave</h2>
      <form class="mt-4 grid gap-3 md:grid-cols-4" @submit.prevent="submitLeave">
        <input v-model="requestForm.start_date" type="date" required class="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none ring-indigo-500 focus:ring-2" />
        <input v-model="requestForm.end_date" type="date" required class="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none ring-indigo-500 focus:ring-2" />
        <input
          v-model="requestForm.reason"
          type="text"
          required
          placeholder="Reason"
          class="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none ring-indigo-500 focus:ring-2 md:col-span-2"
        />
        <button type="submit" class="h-10 rounded-xl bg-[#112c63] px-4 text-sm font-semibold text-white hover:bg-[#0c234f]" :disabled="loading">
          {{ loading ? "Submitting..." : "Submit Request" }}
        </button>
      </form>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-800">My Leave Requests</h2>
        <div class="flex items-center gap-2">
          <input v-model="myFrom" type="date" class="h-9 rounded-lg border border-slate-200 px-2 text-xs outline-none ring-indigo-500 focus:ring-2" />
          <input v-model="myTo" type="date" class="h-9 rounded-lg border border-slate-200 px-2 text-xs outline-none ring-indigo-500 focus:ring-2" />
          <select v-model="myStatusFilter" class="h-9 rounded-lg border border-slate-200 px-2 text-xs outline-none ring-indigo-500 focus:ring-2">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button class="text-sm font-semibold text-slate-600 hover:text-slate-800" @click="loadLeaves">Refresh</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th class="py-2 pr-2">Start</th>
              <th class="py-2 pr-2">End</th>
              <th class="py-2 pr-2">Reason</th>
              <th class="py-2 pr-2">Status</th>
              <th class="py-2 pr-2">Reviewed At</th>
              <th class="py-2 pr-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="leave in paginatedMyLeaves" :key="leave.ID || leave.id" class="border-b border-slate-100">
              <td class="py-2 pr-2">{{ fmtDate(leave.StartDate || leave.start_date) }}</td>
              <td class="py-2 pr-2">{{ fmtDate(leave.EndDate || leave.end_date) }}</td>
              <td class="py-2 pr-2">{{ leave.Reason || leave.reason }}</td>
              <td class="py-2 pr-2">
                <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="statusClass(leave.Status || leave.status)">
                  {{ leave.Status || leave.status }}
                </span>
              </td>
              <td class="py-2 pr-2 text-slate-500">{{ fmtDateTime(leave.ReviewedAt || leave.reviewed_at) }}</td>
              <td class="py-2 pr-2">
                <button
                  v-if="String(leave.Status || leave.status).toLowerCase() === 'pending'"
                  class="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                  @click="cancelLeave(leave)"
                >
                  Cancel
                </button>
                <span v-else class="text-xs text-slate-400">-</span>
              </td>
            </tr>
            <tr v-if="filteredMyLeaves.length === 0">
              <td colspan="6" class="py-4 text-center text-slate-500">No leave requests found</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-3 flex items-center justify-between text-xs text-slate-500">
        <p>Showing {{ paginatedMyLeaves.length }} of {{ filteredMyLeaves.length }}</p>
        <div class="flex items-center gap-2">
          <button class="rounded border border-slate-200 px-2 py-1 disabled:opacity-50" :disabled="myPage === 1" @click="myPage--">Prev</button>
          <span>Page {{ myPage }} / {{ myTotalPages }}</span>
          <button class="rounded border border-slate-200 px-2 py-1 disabled:opacity-50" :disabled="myPage >= myTotalPages" @click="myPage++">Next</button>
        </div>
      </div>
    </article>

    <article v-if="isReviewer" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-lg font-bold text-slate-800">Team Leave Requests</h2>
        <div class="flex items-center gap-2">
          <input v-model="teamFrom" type="date" class="h-9 rounded-lg border border-slate-200 px-2 text-xs outline-none ring-indigo-500 focus:ring-2" />
          <input v-model="teamTo" type="date" class="h-9 rounded-lg border border-slate-200 px-2 text-xs outline-none ring-indigo-500 focus:ring-2" />
          <select v-model="teamStatusFilter" class="h-9 rounded-lg border border-slate-200 px-3 text-sm outline-none ring-indigo-500 focus:ring-2" @change="loadLeaves">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="loadLeaves">
            Refresh
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th class="py-2 pr-2">Employee</th>
              <th class="py-2 pr-2">Period</th>
              <th class="py-2 pr-2">Reason</th>
              <th class="py-2 pr-2">Status</th>
              <th class="py-2 pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="leave in paginatedTeamLeaves" :key="leave.ID || leave.id" class="border-b border-slate-100">
              <td class="py-2 pr-2">{{ fullName(leave) }}</td>
              <td class="py-2 pr-2">{{ fmtDate(leave.StartDate || leave.start_date) }} - {{ fmtDate(leave.EndDate || leave.end_date) }}</td>
              <td class="py-2 pr-2">{{ leave.Reason || leave.reason }}</td>
              <td class="py-2 pr-2">
                <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="statusClass(leave.Status || leave.status)">
                  {{ leave.Status || leave.status }}
                </span>
              </td>
              <td class="py-2 pr-2">
                <div v-if="(leave.Status || leave.status) === 'pending'" class="flex gap-2">
                  <button class="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700" @click="reviewLeave(leave, 'approved')">
                    Approve
                  </button>
                  <button class="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700" @click="reviewLeave(leave, 'rejected')">
                    Reject
                  </button>
                </div>
                <span v-else class="text-xs text-slate-500">Reviewed</span>
              </td>
            </tr>
            <tr v-if="filteredTeamLeaves.length === 0">
              <td colspan="5" class="py-4 text-center text-slate-500">No team leave requests found</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-3 flex items-center justify-between text-xs text-slate-500">
        <p>Showing {{ paginatedTeamLeaves.length }} of {{ filteredTeamLeaves.length }}</p>
        <div class="flex items-center gap-2">
          <button class="rounded border border-slate-200 px-2 py-1 disabled:opacity-50" :disabled="teamPage === 1" @click="teamPage--">Prev</button>
          <span>Page {{ teamPage }} / {{ teamTotalPages }}</span>
          <button class="rounded border border-slate-200 px-2 py-1 disabled:opacity-50" :disabled="teamPage >= teamTotalPages" @click="teamPage++">Next</button>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import API from "@/api/axios";
import { useAuthStore } from "@/stores/auth";
import { PERMISSIONS, hasAllPermissions } from "@/utils/rbac";

const authStore = useAuthStore();
const permissions = computed(() => authStore.permissions || authStore.user?.permissions || []);
const isReviewer = computed(() => hasAllPermissions(permissions.value, [PERMISSIONS.REVIEW_LEAVES]));

const loading = ref(false);
const message = ref("");
const error = ref("");
const myLeaves = ref([]);
const teamLeaves = ref([]);
const pendingLeaves = ref([]);
const teamStatusFilter = ref("");
const myStatusFilter = ref("");
const myFrom = ref("");
const myTo = ref("");
const teamFrom = ref("");
const teamTo = ref("");
const myPage = ref(1);
const teamPage = ref(1);
const pageSize = 8;

const requestForm = ref({
  start_date: "",
  end_date: "",
  reason: "",
});

const myPendingCount = computed(() =>
  myLeaves.value.filter((leave) => String(leave.Status || leave.status).toLowerCase() === "pending").length
);

function inDateRange(leave, from, to) {
  const start = String(leave.StartDate || leave.start_date || "").slice(0, 10);
  if (!start) return true;
  if (from && start < from) return false;
  if (to && start > to) return false;
  return true;
}

const filteredMyLeaves = computed(() =>
  myLeaves.value.filter((leave) => {
    const status = String(leave.Status || leave.status).toLowerCase();
    if (myStatusFilter.value && status !== myStatusFilter.value) return false;
    return inDateRange(leave, myFrom.value, myTo.value);
  })
);

const myTotalPages = computed(() => Math.max(1, Math.ceil(filteredMyLeaves.value.length / pageSize)));
const paginatedMyLeaves = computed(() => {
  if (myPage.value > myTotalPages.value) myPage.value = myTotalPages.value;
  const start = (myPage.value - 1) * pageSize;
  return filteredMyLeaves.value.slice(start, start + pageSize);
});

const filteredTeamLeaves = computed(() =>
  teamLeaves.value.filter((leave) => {
    const status = String(leave.Status || leave.status).toLowerCase();
    if (teamStatusFilter.value && status !== teamStatusFilter.value) return false;
    return inDateRange(leave, teamFrom.value, teamTo.value);
  })
);

const teamTotalPages = computed(() => Math.max(1, Math.ceil(filteredTeamLeaves.value.length / pageSize)));
const paginatedTeamLeaves = computed(() => {
  if (teamPage.value > teamTotalPages.value) teamPage.value = teamTotalPages.value;
  const start = (teamPage.value - 1) * pageSize;
  return filteredTeamLeaves.value.slice(start, start + pageSize);
});

function fmtDate(value) {
  if (!value) return "N/A";
  return String(value).slice(0, 10);
}

function fmtDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

function fullName(leave) {
  return `${leave.Employee?.FirstName || leave.employee?.first_name || ""} ${leave.Employee?.LastName || leave.employee?.last_name || ""}`.trim() || "Employee";
}

function statusClass(status = "") {
  const normalized = String(status).toLowerCase();
  if (normalized === "approved") return "bg-emerald-100 text-emerald-700";
  if (normalized === "rejected") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

async function loadLeaves() {
  error.value = "";
  try {
    const reqs = [API.get("/leaves/mine?limit=200")];
    if (isReviewer.value) {
      const query = teamStatusFilter.value ? `?status=${encodeURIComponent(teamStatusFilter.value)}&limit=200` : "?limit=200";
      reqs.push(API.get(`/leaves/${query}`));
      reqs.push(API.get("/leaves/?status=pending&limit=200"));
    }

    const results = await Promise.all(reqs);
    myLeaves.value = results[0]?.data || [];
    teamLeaves.value = results[1]?.data || [];
    pendingLeaves.value = results[2]?.data || [];
  } catch (loadError) {
    error.value = loadError?.response?.data?.error || "Failed to load leaves";
  }
}

async function submitLeave() {
  loading.value = true;
  message.value = "";
  error.value = "";
  try {
    await API.post("/leaves/", requestForm.value);
    message.value = "Leave request submitted";
    requestForm.value = { start_date: "", end_date: "", reason: "" };
    await loadLeaves();
  } catch (submitError) {
    error.value = submitError?.response?.data?.error || "Failed to submit leave";
  } finally {
    loading.value = false;
  }
}

async function reviewLeave(leave, status) {
  message.value = "";
  error.value = "";
  const leaveID = leave.ID || leave.id;
  try {
    await API.put(`/leaves/${leaveID}/review`, { status });
    message.value = `Leave ${status}`;
    await loadLeaves();
  } catch (reviewError) {
    error.value = reviewError?.response?.data?.error || "Failed to review leave";
  }
}

async function cancelLeave(leave) {
  message.value = "";
  error.value = "";
  try {
    await API.put(`/leaves/${leave.ID || leave.id}/cancel`);
    message.value = "Leave request cancelled";
    await loadLeaves();
  } catch (cancelError) {
    error.value = cancelError?.response?.data?.error || "Failed to cancel leave";
  }
}

onMounted(() => {
  loadLeaves();
});
</script>
