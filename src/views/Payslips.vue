<template>
  <section class="space-y-6">
    <div class="rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_top_right,_#c7d2fe_0%,_#eff6ff_45%,_#ffffff_100%)] p-6 shadow-sm">
      <h1 class="text-3xl font-extrabold tracking-tight text-[#061b4f] md:text-4xl">Payslips</h1>
      <p class="mt-1 text-sm text-slate-600">Payroll records by period with secure download support</p>
    </div>

    <div v-if="message" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{{ message }}</div>
    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</div>

    <div class="grid gap-3 md:grid-cols-3">
      <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">My Payslips</p>
        <p class="mt-1 text-2xl font-bold text-slate-800">{{ myPayslips.length }}</p>
      </article>
      <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Latest Net Pay</p>
        <p class="mt-1 text-2xl font-bold text-[#112c63]">{{ latestNetPay }}</p>
      </article>
      <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Admin Records</p>
        <p class="mt-1 text-2xl font-bold text-slate-800">{{ allPayslips.length }}</p>
      </article>
    </div>

    <article v-if="canManagePayslips" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-800">Generate / Update Payslip</h2>
        <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Payroll Admin</span>
      </div>
      <form class="grid gap-3 md:grid-cols-4" @submit.prevent="generatePayslip">
        <select v-model="form.employee_id" required class="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none ring-indigo-500 focus:bg-white focus:ring-2 md:col-span-2">
          <option value="" disabled>Select employee</option>
          <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.fullName }} ({{ emp.email }})</option>
        </select>
        <input v-model.number="form.month" type="number" min="1" max="12" placeholder="Month" required class="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none ring-indigo-500 focus:bg-white focus:ring-2" />
        <input v-model.number="form.year" type="number" min="2000" max="2100" placeholder="Year" required class="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none ring-indigo-500 focus:bg-white focus:ring-2" />
        <input v-model.number="form.basic_pay" type="number" min="0" step="0.01" placeholder="Basic pay" required class="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none ring-indigo-500 focus:bg-white focus:ring-2" />
        <input v-model.number="form.allowances" type="number" min="0" step="0.01" placeholder="Allowances" class="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none ring-indigo-500 focus:bg-white focus:ring-2" />
        <input v-model.number="form.deductions" type="number" min="0" step="0.01" placeholder="Deductions" class="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none ring-indigo-500 focus:bg-white focus:ring-2" />
        <input v-model="form.currency" type="text" maxlength="10" placeholder="Currency (USD)" class="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none ring-indigo-500 focus:bg-white focus:ring-2" />
        <button type="submit" class="h-10 rounded-xl bg-[#112c63] px-4 text-sm font-semibold text-white hover:bg-[#0c234f]" :disabled="loading">
          {{ loading ? "Saving..." : "Generate" }}
        </button>
      </form>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-800">My Payslips</h2>
        <button class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="loadData">Refresh</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th class="py-2 pr-2">Period</th>
              <th class="py-2 pr-2">Basic</th>
              <th class="py-2 pr-2">Allowances</th>
              <th class="py-2 pr-2">Deductions</th>
              <th class="py-2 pr-2">Net</th>
              <th class="py-2 pr-2">Download</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in myPayslips" :key="p.ID || p.id" class="border-b border-slate-100">
              <td class="py-2 pr-2">
                <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">{{ p.Month || p.month }}/{{ p.Year || p.year }}</span>
              </td>
              <td class="py-2 pr-2">{{ money(p.BasicPay || p.basic_pay, p.Currency || p.currency) }}</td>
              <td class="py-2 pr-2">{{ money(p.Allowances || p.allowances, p.Currency || p.currency) }}</td>
              <td class="py-2 pr-2">{{ money(p.Deductions || p.deductions, p.Currency || p.currency) }}</td>
              <td class="py-2 pr-2 font-semibold text-[#112c63]">{{ money(p.NetPay || p.net_pay, p.Currency || p.currency) }}</td>
              <td class="py-2 pr-2">
                <button class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="downloadPayslipPDF(p)">
                  PDF
                </button>
              </td>
            </tr>
            <tr v-if="myPayslips.length === 0">
              <td colspan="6" class="py-4 text-center text-slate-500">No payslips found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    <article v-if="canManagePayslips" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-lg font-bold text-slate-800">All Payslips</h2>
        <div class="flex items-center gap-2">
          <input v-model.number="filters.month" type="number" min="1" max="12" placeholder="Month" class="h-9 w-20 rounded-lg border border-slate-200 px-2 text-xs outline-none ring-indigo-500 focus:ring-2" />
          <input v-model.number="filters.year" type="number" min="2000" max="2100" placeholder="Year" class="h-9 w-24 rounded-lg border border-slate-200 px-2 text-xs outline-none ring-indigo-500 focus:ring-2" />
          <button class="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="loadAllPayslips">Filter</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
              <th class="py-2 pr-2">Employee</th>
              <th class="py-2 pr-2">Period</th>
              <th class="py-2 pr-2">Net</th>
              <th class="py-2 pr-2">Generated</th>
              <th class="py-2 pr-2">Download</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in allPayslips" :key="p.ID || p.id" class="border-b border-slate-100">
              <td class="py-2 pr-2">{{ p.Employee?.FirstName || p.employee?.first_name }} {{ p.Employee?.LastName || p.employee?.last_name }}</td>
              <td class="py-2 pr-2">{{ p.Month || p.month }}/{{ p.Year || p.year }}</td>
              <td class="py-2 pr-2 font-semibold text-[#112c63]">{{ money(p.NetPay || p.net_pay, p.Currency || p.currency) }}</td>
              <td class="py-2 pr-2 text-slate-500">{{ dateTime(p.CreatedAt || p.created_at) }}</td>
              <td class="py-2 pr-2">
                <button class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50" @click="downloadPayslipPDF(p)">
                  PDF
                </button>
              </td>
            </tr>
            <tr v-if="allPayslips.length === 0">
              <td colspan="5" class="py-4 text-center text-slate-500">No payslips found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import API from "@/api/axios";
import { useAuthStore } from "@/stores/auth";
import { PERMISSIONS, hasAllPermissions } from "@/utils/rbac";
import { normalizeEmployee } from "@/utils/normalizers";

const authStore = useAuthStore();
const canManagePayslips = computed(() =>
  hasAllPermissions(authStore.permissions || authStore.user?.permissions || [], [PERMISSIONS.MANAGE_PAYSLIPS])
);

const loading = ref(false);
const message = ref("");
const error = ref("");
const employees = ref([]);
const myPayslips = ref([]);
const allPayslips = ref([]);

const form = ref({
  employee_id: "",
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  basic_pay: 0,
  allowances: 0,
  deductions: 0,
  currency: "USD",
});

const filters = ref({
  month: null,
  year: null,
});

const latestNetPay = computed(() => {
  if (!myPayslips.value.length) return "USD 0.00";
  const latest = myPayslips.value[0];
  return money(latest.NetPay || latest.net_pay, latest.Currency || latest.currency || "USD");
});

function money(amount, currency = "USD") {
  const n = Number(amount || 0);
  return `${currency} ${n.toFixed(2)}`;
}

function dateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
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

async function loadAllPayslips() {
  if (!canManagePayslips.value) return;
  try {
    const params = new URLSearchParams();
    if (filters.value.month) params.set("month", String(filters.value.month));
    if (filters.value.year) params.set("year", String(filters.value.year));
    params.set("limit", "200");
    const res = await API.get(`/payslips/?${params.toString()}`);
    allPayslips.value = res.data || [];
  } catch (err) {
    error.value = err?.response?.data?.error || "Failed to load all payslips";
  }
}

async function loadData() {
  error.value = "";
  try {
    const reqs = [API.get("/payslips/mine?limit=200")];
    if (canManagePayslips.value) {
      reqs.push(API.get("/employees/"));
      reqs.push(API.get("/payslips/?limit=200"));
    }
    const [mineRes, employeesRes, allRes] = await Promise.all(reqs);
    myPayslips.value = mineRes.data || [];
    employees.value = (employeesRes?.data || []).map(normalizeEmployee);
    allPayslips.value = allRes?.data || [];
  } catch (err) {
    error.value = err?.response?.data?.error || "Failed to load payslips";
  }
}

async function generatePayslip() {
  loading.value = true;
  message.value = "";
  error.value = "";
  try {
    await API.post("/payslips/", form.value);
    message.value = "Payslip generated successfully";
    await loadData();
  } catch (err) {
    error.value = err?.response?.data?.error || "Failed to generate payslip";
  } finally {
    loading.value = false;
  }
}

async function downloadPayslipPDF(payslip) {
  message.value = "";
  error.value = "";
  try {
    const id = payslip.ID || payslip.id;
    const month = payslip.Month || payslip.month;
    const year = payslip.Year || payslip.year;
    const res = await API.get(`/payslips/${id}/pdf`, { responseType: "blob" });
    saveBlob(res.data, `payslip_${month}_${year}.pdf`);
  } catch (err) {
    error.value = err?.response?.data?.error || "Failed to download payslip";
  }
}

onMounted(() => {
  loadData();
});
</script>
