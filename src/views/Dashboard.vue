<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-base text-slate-500">Welcome back, {{ firstName }}</p>
        <h1 class="text-3xl font-extrabold tracking-tight text-[#061b4f] md:text-4xl">Dashboard</h1>
      </div>
      <router-link
        v-if="canManageEmployees"
        to="/employees"
        class="inline-flex items-center gap-2 rounded-xl bg-[#112c63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c234f]"
      >
        <UserPlusIcon class="h-4 w-4" />
        Add Employee
      </router-link>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article v-for="card in metrics" :key="card.label" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <div class="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-[#112c63]">
            <component :is="card.icon" class="h-5 w-5" />
          </div>
          <p :class="card.trendClass" class="text-xs font-semibold">{{ card.trend }}</p>
        </div>
        <p class="text-sm text-slate-500">{{ card.label }}</p>
        <p class="mt-1 text-3xl font-extrabold text-[#061b4f]">{{ card.value }}</p>
      </article>
    </div>

    <div class="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <section v-if="canViewOrgEmployees">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-[#061b4f]">Recent Employees</h2>
          <router-link to="/employees" class="text-sm font-semibold text-amber-500 hover:text-amber-600">View all</router-link>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <article v-for="employee in recentEmployees" :key="employee.id" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="grid h-10 w-10 place-items-center rounded-xl bg-[#132d66] text-sm font-semibold text-white">
                  {{ initialsFromName(employee.fullName) }}
                </div>
                <div>
                  <p class="text-lg font-bold text-slate-800">{{ employee.fullName }}</p>
                  <p class="text-sm text-slate-500 capitalize">{{ employee.role }}</p>
                </div>
              </div>
              <EllipsisHorizontalIcon class="h-5 w-5 text-slate-400" />
            </div>

            <div class="mt-3 space-y-1.5 text-sm text-slate-500">
              <p class="flex items-center gap-2"><EnvelopeIcon class="h-4 w-4" /> {{ employee.email || "N/A" }}</p>
              <p class="flex items-center gap-2"><PhoneIcon class="h-4 w-4" /> {{ phoneFromID(employee.id) }}</p>
            </div>

            <div class="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
              <p class="text-sm text-slate-500">{{ employee.departmentName }}</p>
              <span
                class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                :class="employee.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'"
              >
                {{ employee.status }}
              </span>
            </div>
          </article>
        </div>
      </section>
      <section v-else class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-2xl font-bold text-[#061b4f]">My Leave Snapshot</h2>
        <div class="mt-4 grid gap-3 md:grid-cols-3">
          <div class="rounded-xl bg-amber-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Pending</p>
            <p class="mt-1 text-2xl font-bold text-amber-700">{{ myPendingLeaves }}</p>
          </div>
          <div class="rounded-xl bg-emerald-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">Approved</p>
            <p class="mt-1 text-2xl font-bold text-emerald-700">{{ myApprovedLeaves }}</p>
          </div>
          <div class="rounded-xl bg-red-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-red-700">Rejected</p>
            <p class="mt-1 text-2xl font-bold text-red-700">{{ myRejectedLeaves }}</p>
          </div>
        </div>
        <router-link to="/leaves" class="mt-4 inline-flex rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Open Leave Management
        </router-link>
      </section>

      <aside class="space-y-6">
        <section v-if="canViewDepartments">
          <h2 class="mb-4 text-2xl font-bold text-[#061b4f]">Departments</h2>
          <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div v-for="dept in departmentRows" :key="dept.name" class="flex items-center justify-between border-b border-slate-200 px-4 py-3 last:border-b-0">
              <div class="flex items-start gap-2.5">
                <span class="mt-1.5 h-2.5 w-2.5 rounded-full" :class="dept.dot"></span>
                <div>
                  <p class="text-base font-semibold text-slate-800">{{ dept.name }}</p>
                  <p class="text-sm text-slate-500">{{ dept.lead }}</p>
                </div>
              </div>
              <p class="text-lg font-bold text-slate-800">{{ dept.count }}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 class="mb-4 text-2xl font-bold text-[#061b4f]">Quick Actions</h2>
          <div class="space-y-2.5">
            <router-link
              v-for="action in quickActions"
              :key="action.label"
              :to="action.to"
              class="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm hover:bg-slate-50"
            >
              <div class="flex items-center gap-2 text-slate-700">
                <component :is="action.icon" class="h-4 w-4 text-slate-500" />
                <span class="text-sm font-semibold">{{ action.label }}</span>
              </div>
              <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{{ action.count }}</span>
            </router-link>
          </div>
        </section>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import API from "@/api/axios";
import { useAuthStore } from "@/stores/auth";
import { initialsFromName, normalizeDepartment, normalizeEmployee, phoneFromID } from "@/utils/normalizers";
import { PERMISSIONS, hasAllPermissions } from "@/utils/rbac";
import {
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const employees = ref([]);
const departments = ref([]);
const attendanceRate = ref(0);
const pendingLeaves = ref(0);
const myPendingLeaves = ref(0);
const myApprovedLeaves = ref(0);
const myRejectedLeaves = ref(0);

const departmentDots = ["bg-[#1a2f68]", "bg-blue-500", "bg-amber-500", "bg-emerald-500", "bg-red-500"];

const firstName = computed(() => authStore.user?.first_name || "User");
const userPermissions = computed(() => authStore.permissions || authStore.user?.permissions || []);
const isReviewer = computed(() => hasAllPermissions(userPermissions.value, [PERMISSIONS.REVIEW_LEAVES]));
const canManageEmployees = computed(() =>
  hasAllPermissions(userPermissions.value, [PERMISSIONS.MANAGE_EMPLOYEES])
);
const canViewOrgEmployees = computed(() => hasAllPermissions(userPermissions.value, [PERMISSIONS.MANAGE_EMPLOYEES]));
const canViewDepartments = computed(() => hasAllPermissions(userPermissions.value, [PERMISSIONS.VIEW_DEPARTMENTS]));
const canViewAnalytics = computed(() => hasAllPermissions(userPermissions.value, [PERMISSIONS.VIEW_ANALYTICS]));

const departmentCounts = computed(() => {
  const counts = {};
  for (const employee of employees.value) {
    const key = employee.departmentName || "Unassigned";
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
});

const departmentRows = computed(() =>
  departments.value.slice(0, 5).map((department, idx) => {
    const deptEmployees = employees.value.filter((employee) => employee.departmentName === department.name);
    const manager = deptEmployees.find((employee) => employee.role === "manager");
    return {
      name: department.name,
      lead: manager?.fullName || deptEmployees[0]?.fullName || "Unassigned",
      count: departmentCounts.value[department.name] || 0,
      dot: departmentDots[idx % departmentDots.length],
    };
  })
);

const recentEmployees = computed(() => employees.value.slice(0, 4));

const metrics = computed(() => {
  if (!canViewOrgEmployees.value) {
    return [
      { label: "My Pending Leaves", value: myPendingLeaves.value, trend: "", trendClass: "text-slate-500", icon: CalendarDaysIcon },
      { label: "My Approved Leaves", value: myApprovedLeaves.value, trend: "", trendClass: "text-slate-500", icon: CalendarDaysIcon },
      { label: "My Rejected Leaves", value: myRejectedLeaves.value, trend: "", trendClass: "text-slate-500", icon: CalendarDaysIcon },
      { label: "Attendance", value: "Self-service", trend: "", trendClass: "text-slate-500", icon: ChartBarIcon },
    ];
  }
  return [
    { label: "Total Employees", value: employees.value.length, trend: "", trendClass: "text-slate-500", icon: UsersIcon },
    { label: "Departments", value: departments.value.length, trend: "", trendClass: "text-slate-500", icon: BuildingOffice2Icon },
    { label: "Attendance Rate", value: `${attendanceRate.value.toFixed(1)}%`, trend: "", trendClass: "text-slate-500", icon: ChartBarIcon },
    {
      label: isReviewer.value ? "Pending Leaves" : "My Pending Leaves",
      value: isReviewer.value ? pendingLeaves.value : myPendingLeaves.value,
      trend: "",
      trendClass: "text-slate-500",
      icon: CalendarDaysIcon,
    },
  ];
});

const quickActions = computed(() => {
  if (!isReviewer.value) {
    return [
      { label: "Submit leave request", count: myPendingLeaves.value, icon: CalendarDaysIcon, to: "/leaves" },
      { label: "Clock in/out", count: 0, icon: ClockIcon, to: "/attendance" },
      { label: "View payslips", count: 0, icon: UsersIcon, to: "/payslips" },
    ];
  }
  return [
    { label: "Review pending leaves", count: pendingLeaves.value, icon: ClockIcon, to: "/leaves" },
    { label: "Manage leave requests", count: pendingLeaves.value, icon: CalendarDaysIcon, to: "/leaves" },
    { label: "View attendance", count: 0, icon: ChartBarIcon, to: "/attendance" },
  ];
});

async function loadDashboardData() {
  try {
    const canManage = canViewOrgEmployees.value;

    const requests = {
      mineLeaves: API.get("/leaves/mine?limit=100"),
    };
    if (canManage) {
      requests.employees = API.get("/employees/");
      requests.departments = API.get("/departments/");
      requests.summary = API.get(`/analytics/daily-summary?date=${new Date().toISOString().slice(0, 10)}`);
      requests.pendingLeaves = API.get("/leaves/?status=pending&limit=100");
    }

    const settled = await Promise.allSettled(Object.values(requests));
    const keyOrder = Object.keys(requests);
    const resultMap = {};
    keyOrder.forEach((key, index) => {
      resultMap[key] = settled[index];
    });

    if (resultMap.employees?.status === "fulfilled") {
      employees.value = (resultMap.employees.value.data || []).map(normalizeEmployee);
    } else {
      employees.value = [];
    }

    if (resultMap.departments?.status === "fulfilled") {
      departments.value = (resultMap.departments.value.data || []).map(normalizeDepartment);
    } else {
      departments.value = [];
    }

    if (resultMap.summary?.status === "fulfilled") {
      const present = Number(resultMap.summary.value.data?.present || 0);
      const absent = Number(resultMap.summary.value.data?.absent || 0);
      const total = present + absent;
      attendanceRate.value = total > 0 ? (present / total) * 100 : 0;
    } else {
      attendanceRate.value = 0;
    }

    const myLeaves = resultMap.mineLeaves?.status === "fulfilled" ? resultMap.mineLeaves.value.data || [] : [];
    myPendingLeaves.value = myLeaves.filter((x) => (x.status || "").toLowerCase() === "pending").length;
    myApprovedLeaves.value = myLeaves.filter((x) => (x.status || "").toLowerCase() === "approved").length;
    myRejectedLeaves.value = myLeaves.filter((x) => (x.status || "").toLowerCase() === "rejected").length;
    pendingLeaves.value = resultMap.pendingLeaves?.status === "fulfilled" ? resultMap.pendingLeaves.value.data?.length || 0 : 0;
  } catch (error) {
    console.error("Failed to load dashboard data", error);
  }
}

onMounted(() => {
  loadDashboardData();
});
</script>
