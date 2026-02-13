export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  EMPLOYEE: "employee",
};

export const PERMISSIONS = {
  MANAGE_EMPLOYEES: "manage_employees",
  MANAGE_DEPARTMENTS: "manage_departments",
  VIEW_DEPARTMENTS: "view_departments",
  VIEW_ANALYTICS: "view_analytics",
  EXPORT_REPORTS: "export_reports",
  VIEW_AUDIT_LOGS: "view_audit_logs",
  REVIEW_LEAVES: "review_leaves",
  REQUEST_LEAVE: "request_leave",
  VIEW_OWN_LEAVES: "view_own_leaves",
  CLOCK_ATTENDANCE: "clock_attendance",
  VIEW_NOTIFICATIONS: "view_notifications",
  VIEW_PROFILE: "view_profile",
  UPDATE_PROFILE: "update_profile",
  MANAGE_PAYSLIPS: "manage_payslips",
  VIEW_OWN_PAYSLIPS: "view_own_payslips",
};

const rolePermissions = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [
    PERMISSIONS.MANAGE_EMPLOYEES,
    PERMISSIONS.VIEW_DEPARTMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.REVIEW_LEAVES,
    PERMISSIONS.REQUEST_LEAVE,
    PERMISSIONS.VIEW_OWN_LEAVES,
    PERMISSIONS.CLOCK_ATTENDANCE,
    PERMISSIONS.VIEW_NOTIFICATIONS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.UPDATE_PROFILE,
    PERMISSIONS.MANAGE_PAYSLIPS,
    PERMISSIONS.VIEW_OWN_PAYSLIPS,
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.REQUEST_LEAVE,
    PERMISSIONS.VIEW_OWN_LEAVES,
    PERMISSIONS.CLOCK_ATTENDANCE,
    PERMISSIONS.VIEW_NOTIFICATIONS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.UPDATE_PROFILE,
    PERMISSIONS.VIEW_OWN_PAYSLIPS,
  ],
};

export function permissionsForRole(role) {
  return [...(rolePermissions[role] || [])];
}

export function hasPermission(permissions, requiredPermission) {
  return (permissions || []).includes(requiredPermission);
}

export function hasAllPermissions(permissions, requiredPermissions = []) {
  if (!requiredPermissions.length) return true;
  return requiredPermissions.every((permission) => hasPermission(permissions, permission));
}
