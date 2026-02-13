export function pick(obj, keys, fallback = "") {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }
  return fallback;
}

export function normalizeEmployee(raw) {
  const firstName = pick(raw, ["first_name", "FirstName"], "");
  const lastName = pick(raw, ["last_name", "LastName"], "");
  const user = pick(raw, ["user", "User"], {});
  const department = pick(raw, ["department", "Department"], {});
  const role = pick(user, ["role", "Role"], "employee");

  return {
    id: String(pick(raw, ["id", "ID"], "")),
    userId: String(pick(raw, ["user_id", "UserID"], "")),
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    email: pick(user, ["email", "Email"], ""),
    role,
    status: pick(raw, ["status", "Status"], "active"),
    departmentId: String(pick(department, ["id", "ID"], "")),
    departmentName: pick(department, ["name", "Name"], "Unassigned"),
  };
}

export function normalizeDepartment(raw) {
  return {
    id: String(pick(raw, ["id", "ID"], "")),
    name: pick(raw, ["name", "Name"], ""),
  };
}

export function initialsFromName(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "NA";
  const first = parts[0][0] || "";
  const second = parts[1]?.[0] || "";
  return `${first}${second}`.toUpperCase();
}

export function phoneFromID(id = "") {
  const digits = String(id).replace(/\D/g, "").slice(-10).padStart(10, "0");
  return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}
