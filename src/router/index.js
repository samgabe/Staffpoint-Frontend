import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import Employees from "@/views/Employees.vue";
import Departments from "@/views/Departments.vue";
import Attendance from "@/views/Attendance.vue";
import Leaves from "@/views/Leaves.vue";
import Reports from "@/views/Reports.vue";
import AuditLogs from "@/views/AuditLogs.vue";
import Settings from "@/views/Settings.vue";
import Payslips from "@/views/Payslips.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { PERMISSIONS, hasAllPermissions } from "@/utils/rbac";

const routes = [
  { path: "/login", component: Login, meta: { guestOnly: true } },
  {
    path: "/",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "/dashboard" },
      { path: "dashboard", component: Dashboard },
      { path: "employees", component: Employees, meta: { permissions: [PERMISSIONS.MANAGE_EMPLOYEES] } },
      { path: "departments", component: Departments, meta: { permissions: [PERMISSIONS.MANAGE_DEPARTMENTS] } },
      { path: "attendance", component: Attendance },
      { path: "leaves", component: Leaves },
      { path: "payslips", component: Payslips, meta: { permissions: [PERMISSIONS.VIEW_OWN_PAYSLIPS] } },
      { path: "reports", component: Reports, meta: { permissions: [PERMISSIONS.EXPORT_REPORTS] } },
      { path: "audit-logs", component: AuditLogs, meta: { permissions: [PERMISSIONS.VIEW_AUDIT_LOGS] } },
      { path: "settings", component: Settings },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function defaultRouteForRole(role) {
  if (role === "admin" || role === "manager") return "/dashboard";
  return "/attendance";
}

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  if (!authStore.isHydrated) {
    authStore.hydrateFromStorage();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return "/login";
  }

  if (authStore.isAuthenticated && !authStore.user) {
    await authStore.fetchUser();
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return defaultRouteForRole(authStore.user?.role);
  }

  const requiredPermissions = to.meta?.permissions || [];
  if (requiredPermissions.length > 0) {
    const permissions = authStore.permissions || authStore.user?.permissions || [];
    if (!hasAllPermissions(permissions, requiredPermissions)) {
      return defaultRouteForRole(authStore.user?.role);
    }
  }
});

export default router;
