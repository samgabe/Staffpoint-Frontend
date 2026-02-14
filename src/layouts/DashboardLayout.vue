<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <div class="flex min-h-screen">
      <aside
        :class="[
          'fixed inset-y-0 left-0 z-40 w-64 bg-[#071a4a] text-slate-200 transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
      >
        <div class="flex h-full flex-col">
          <div class="border-b border-slate-700/60 px-5 py-5">
            <div class="flex items-center gap-3">
              <div class="grid h-9 w-9 place-items-center rounded-xl bg-amber-400 text-slate-900">
                <UsersIcon class="h-4 w-4" />
              </div>
              <div>
                <p class="text-2xl font-bold tracking-tight text-white">StaffPoint</p>
                <p class="text-xs text-slate-300">Employee Manager</p>
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-4 py-5">
            <p class="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Main Menu</p>
            <nav class="space-y-1">
              <router-link
                v-for="item in menuItems"
                :key="item.to"
                :to="item.to"
                class="nav-item text-sm"
                @click="sidebarOpen = false"
              >
                <component :is="item.icon" class="h-4 w-4" />
                <span>{{ item.label }}</span>
                <span v-if="item.badge !== null" class="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900">
                  {{ item.badge }}
                </span>
              </router-link>
            </nav>

            <p class="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">System</p>
            <router-link to="/app/settings" class="nav-item text-sm" @click="sidebarOpen = false">
              <Cog6ToothIcon class="h-4 w-4" />
              <span>Settings</span>
            </router-link>
          </div>

          <div class="border-t border-slate-700/60 p-4">
            <button class="nav-item w-full text-sm" @click="logout">
              <ArrowRightOnRectangleIcon class="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      <div class="flex min-h-screen flex-1 flex-col lg:ml-64">
        <header class="sticky top-0 z-30 border-b border-slate-200 bg-slate-100/95 backdrop-blur">
          <div class="flex items-center gap-3 px-4 py-3 lg:px-6">
            <button class="rounded-md p-2 text-slate-500 hover:bg-slate-200 lg:hidden" @click="sidebarOpen = !sidebarOpen">
              <Bars3Icon class="h-5 w-5" />
            </button>
            <button class="hidden rounded-md p-2 text-slate-500 hover:bg-slate-200 lg:block">
              <SidebarIcon class="h-4 w-4" />
            </button>

            <div class="relative w-full max-w-sm">
              <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                v-model="search"
                type="text"
                class="h-10 w-full rounded-xl border border-slate-200 bg-slate-200/70 pl-9 pr-4 text-sm outline-none ring-indigo-500 transition focus:ring-2"
                placeholder="Search employees, departments..."
              />
            </div>

            <div class="ml-auto flex items-center gap-3">
              <div class="relative">
                <button class="rounded-md p-1 text-slate-500 hover:bg-slate-200" @click="showNotifications = !showNotifications">
                  <BellIcon class="h-5 w-5" />
                </button>
                <span
                  v-if="unreadNotifications > 0"
                  class="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-amber-400 px-1.5 text-center text-[10px] font-bold text-slate-900"
                >
                  {{ unreadNotifications }}
                </span>

                <div
                  v-if="showNotifications"
                  class="absolute right-0 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                >
                  <div class="border-b border-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700">Notifications</div>
                  <div v-if="notifications.length === 0" class="px-4 py-4 text-sm text-slate-500">No notifications</div>
                  <div v-for="item in notifications" :key="item.id" class="border-b border-slate-100 px-4 py-3 last:border-b-0">
                    <p class="text-sm font-semibold text-slate-800">{{ item.title }}</p>
                    <p class="text-xs text-slate-500">{{ item.message }}</p>
                    <p class="mt-1 text-[11px] text-slate-400">{{ formatDate(item.created_at) }}</p>
                  </div>
                </div>
              </div>

              <div class="grid h-9 w-9 place-items-center rounded-full bg-[#132d66] text-sm text-white font-semibold">
                {{ userInitials }}
              </div>
              <div class="hidden md:block">
                <p class="text-sm font-semibold text-slate-900">{{ displayName }}</p>
                <p class="text-xs text-slate-500 capitalize">{{ authStore.user?.role || "Admin" }}</p>
              </div>
            </div>
          </div>
        </header>

        <main class="flex-1 px-4 py-5 lg:px-6">
          <router-view />
        </main>
      </div>
    </div>

    <div v-if="sidebarOpen" class="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" @click="sidebarOpen = false"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import API from "@/api/axios";
import { useAuthStore } from "@/stores/auth";
import { PERMISSIONS, hasAllPermissions } from "@/utils/rbac";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  BanknotesIcon,
  ChartBarSquareIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/vue/24/outline";
import { RectangleGroupIcon as SidebarIcon } from "@heroicons/vue/24/solid";

const authStore = useAuthStore();
const router = useRouter();
const search = ref("");
const sidebarOpen = ref(false);
const employeeCount = ref(null);
const notifications = ref([]);
const unreadNotifications = ref(0);
const showNotifications = ref(false);
let poller = null;
function canAccess(requiredPermissions = []) {
  return hasAllPermissions(authStore.permissions || authStore.user?.permissions || [], requiredPermissions);
}

const menuItems = computed(() => {
  const items = [
    { label: "Dashboard", to: "/app/dashboard", icon: ChartBarSquareIcon, badge: null, permissions: [] },
    {
      label: "Employees",
      to: "/app/employees",
      icon: UserGroupIcon,
      badge: employeeCount.value,
      permissions: [PERMISSIONS.MANAGE_EMPLOYEES],
    },
    {
      label: "Departments",
      to: "/app/departments",
      icon: BuildingOffice2Icon,
      badge: null,
      permissions: [PERMISSIONS.MANAGE_DEPARTMENTS],
    },
    { label: "Attendance", to: "/app/attendance", icon: ClipboardDocumentListIcon, badge: null, permissions: [] },
    { label: "Leaves", to: "/app/leaves", icon: CalendarDaysIcon, badge: unreadNotifications.value > 0 ? unreadNotifications.value : null, permissions: [] },
    { label: "Payslips", to: "/app/payslips", icon: BanknotesIcon, badge: null, permissions: [PERMISSIONS.VIEW_OWN_PAYSLIPS] },
    {
      label: "Reports",
      to: "/app/reports",
      icon: ClipboardDocumentListIcon,
      badge: null,
      permissions: [PERMISSIONS.EXPORT_REPORTS],
    },
    {
      label: "Audit Logs",
      to: "/app/audit-logs",
      icon: DocumentTextIcon,
      badge: null,
      permissions: [PERMISSIONS.VIEW_AUDIT_LOGS],
    },
  ];

  return items.filter((item) => canAccess(item.permissions));
});

const displayName = computed(() => {
  const first = authStore.user?.first_name || "";
  const last = authStore.user?.last_name || "";
  const full = `${first} ${last}`.trim();
  if (full) return full;
  return authStore.user?.email || "User";
});

const userInitials = computed(() => {
  const parts = displayName.value.split(" ").filter(Boolean);
  return `${parts[0]?.[0] || "U"}${parts[1]?.[0] || "S"}`.toUpperCase();
});

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

async function loadEmployeeCount() {
  if (!canAccess([PERMISSIONS.MANAGE_EMPLOYEES])) {
    employeeCount.value = null;
    return;
  }
  try {
    const res = await API.get("/employees/count");
    employeeCount.value = Number(res.data?.count ?? 0);
  } catch (error) {
    employeeCount.value = null;
  }
}

async function loadNotifications() {
  try {
    const res = await API.get("/notifications/");
    notifications.value = res.data?.items || [];
    unreadNotifications.value = Number(res.data?.unread_count || 0);
  } catch (error) {
    notifications.value = [];
    unreadNotifications.value = 0;
  }
}

const logout = () => {
  authStore.logout();
  router.push("/login");
};

onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.user) {
    await authStore.fetchUser();
  }
  await Promise.all([loadEmployeeCount(), loadNotifications()]);
  poller = window.setInterval(() => {
    loadNotifications();
  }, 30000);
});

onUnmounted(() => {
  if (poller) {
    window.clearInterval(poller);
    poller = null;
  }
});
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.75rem;
  padding: 0.6rem 0.75rem;
  color: #c5d2f2;
  transition: background-color 0.2s ease;
}

.nav-item:hover {
  background: rgba(147, 176, 255, 0.12);
}

.router-link-active.nav-item {
  background: rgba(115, 150, 242, 0.22);
  color: #ffffff;
  font-weight: 600;
}
</style>
