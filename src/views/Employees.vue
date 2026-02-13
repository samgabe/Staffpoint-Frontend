<template>
  <section class="space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-[#061b4f] md:text-4xl">Employees</h1>
        <p class="mt-1 text-sm text-slate-500">{{ filteredEmployees.length }} team members</p>
      </div>
      <button
        class="inline-flex items-center gap-2 rounded-xl bg-[#112c63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c234f]"
        @click="openCreateModal"
      >
        <UserPlusIcon class="h-5 w-5" />
        Add Employee
      </button>
    </div>

    <div v-if="message" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{{ message }}</div>
    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{{ error }}</div>

    <div class="flex flex-wrap items-center gap-3">
      <div class="relative min-w-[280px] flex-1">
        <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          v-model="searchText"
          type="text"
          placeholder="Search by name or role..."
          class="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 shadow-sm outline-none ring-indigo-500 focus:ring-2"
        />
      </div>

      <select
        v-model="selectedDepartment"
        class="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none ring-indigo-500 focus:ring-2"
      >
        <option value="">All Departments</option>
        <option v-for="dept in departments" :key="dept.id || dept.name" :value="dept.name">{{ dept.name }}</option>
      </select>

      <div class="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        <button class="rounded-lg p-2" :class="viewMode === 'grid' ? 'bg-slate-100 text-slate-800' : 'text-slate-500'" @click="viewMode = 'grid'">
          <Squares2X2Icon class="h-5 w-5" />
        </button>
        <button class="rounded-lg p-2" :class="viewMode === 'list' ? 'bg-slate-100 text-slate-800' : 'text-slate-500'" @click="viewMode = 'list'">
          <ListBulletIcon class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div v-if="viewMode === 'grid'" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article v-for="employee in filteredEmployees" :key="employee.id" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="grid h-10 w-10 place-items-center rounded-xl bg-[#132d66] text-sm font-semibold text-white">
              {{ initialsFromName(employee.fullName) }}
            </div>
            <div>
              <p class="text-base font-bold text-slate-800">{{ employee.fullName }}</p>
              <p class="text-sm text-slate-500 capitalize">{{ employee.role }}</p>
            </div>
          </div>
          <EllipsisHorizontalIcon class="h-5 w-5 text-slate-400" />
        </div>

        <div class="mt-4 space-y-2 text-sm text-slate-500">
          <p class="flex items-center gap-2"><EnvelopeIcon class="h-4 w-4" /> {{ employee.email || "N/A" }}</p>
          <p class="flex items-center gap-2"><PhoneIcon class="h-4 w-4" /> {{ phoneFromID(employee.id) }}</p>
        </div>

        <div class="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
          <p class="text-sm text-slate-500">{{ employee.departmentName }}</p>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold" :class="employee.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'">
            {{ employee.status }}
          </span>
        </div>

        <div class="mt-4 flex gap-2">
          <button class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="openEditModal(employee)">
            Edit
          </button>
          <button class="flex-1 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700" @click="deactivateEmployee(employee)">
            Deactivate
          </button>
        </div>
      </article>
    </div>

    <div v-else class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        <p class="col-span-3">Employee</p>
        <p class="col-span-2">Department</p>
        <p class="col-span-2">Role</p>
        <p class="col-span-2">Status</p>
        <p class="col-span-3">Actions</p>
      </div>
      <div v-for="employee in filteredEmployees" :key="employee.id" class="grid grid-cols-12 items-center border-b border-slate-100 px-4 py-3 last:border-b-0">
        <div class="col-span-3 flex items-center gap-3">
          <div class="grid h-10 w-10 place-items-center rounded-xl bg-[#132d66] text-sm font-semibold text-white">
            {{ initialsFromName(employee.fullName) }}
          </div>
          <div>
            <p class="font-semibold text-slate-800">{{ employee.fullName }}</p>
            <p class="text-sm text-slate-500">{{ employee.email || "N/A" }}</p>
          </div>
        </div>
        <p class="col-span-2 text-slate-600">{{ employee.departmentName }}</p>
        <p class="col-span-2 capitalize text-slate-600">{{ employee.role }}</p>
        <div class="col-span-2">
          <span class="rounded-full px-3 py-1 text-sm font-semibold" :class="employee.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'">
            {{ employee.status }}
          </span>
        </div>
        <div class="col-span-3 flex gap-2">
          <button class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="openEditModal(employee)">
            Edit
          </button>
          <button class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700" @click="deactivateEmployee(employee)">
            Deactivate
          </button>
        </div>
      </div>
    </div>

    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-40 grid place-items-center bg-slate-900/45 px-4">
      <div class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-start justify-between">
          <h2 class="text-xl font-bold text-slate-800">{{ showCreateModal ? "Add Employee" : "Edit Employee" }}</h2>
          <button class="rounded-md p-1 text-slate-400 hover:bg-slate-100" @click="closeModals">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <form class="space-y-4" @submit.prevent="submitForm">
          <div class="grid gap-3 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-semibold text-slate-600">First Name</label>
              <input v-model="form.first_name" required class="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none ring-indigo-500 focus:ring-2" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-semibold text-slate-600">Last Name</label>
              <input v-model="form.last_name" required class="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none ring-indigo-500 focus:ring-2" />
            </div>
          </div>

          <div v-if="showCreateModal">
            <label class="mb-1 block text-sm font-semibold text-slate-600">Email</label>
            <input v-model="form.email" type="email" required class="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none ring-indigo-500 focus:ring-2" />
          </div>

          <div v-if="showCreateModal">
            <label class="mb-1 block text-sm font-semibold text-slate-600">Password</label>
            <input v-model="form.password" type="password" minlength="8" required class="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none ring-indigo-500 focus:ring-2" />
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-semibold text-slate-600">Role</label>
              <select v-model="form.role" class="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none ring-indigo-500 focus:ring-2">
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-semibold text-slate-600">Department</label>
              <select v-model="form.department_id" required class="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none ring-indigo-500 focus:ring-2">
                <option disabled value="">Select department</option>
                <option v-for="dept in departments" :key="dept.id || dept.name" :value="dept.id">{{ dept.name }}</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50" @click="closeModals">
              Cancel
            </button>
            <button type="submit" class="rounded-xl bg-[#112c63] px-4 py-2 font-semibold text-white hover:bg-[#0c234f]" :disabled="saving">
              {{ saving ? "Saving..." : showCreateModal ? "Create Employee" : "Save Changes" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import API from "@/api/axios";
import { initialsFromName, normalizeDepartment, normalizeEmployee, phoneFromID } from "@/utils/normalizers";
import {
  EllipsisHorizontalIcon,
  EnvelopeIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  Squares2X2Icon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const employees = ref([]);
const departments = ref([]);
const searchText = ref("");
const selectedDepartment = ref("");
const viewMode = ref("grid");
const message = ref("");
const error = ref("");
const saving = ref(false);

const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingEmployeeId = ref("");

const form = ref({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  role: "employee",
  department_id: "",
});

const filteredEmployees = computed(() =>
  employees.value.filter((employee) => {
    const query = searchText.value.trim().toLowerCase();
    const searchable = `${employee.fullName} ${employee.email} ${employee.role}`.toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesDepartment = !selectedDepartment.value || employee.departmentName === selectedDepartment.value;
    return matchesQuery && matchesDepartment;
  })
);

function resetForm() {
  form.value = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "employee",
    department_id: "",
  };
}

function openCreateModal() {
  resetForm();
  showEditModal.value = false;
  showCreateModal.value = true;
}

function openEditModal(employee) {
  form.value.first_name = employee.firstName;
  form.value.last_name = employee.lastName;
  form.value.role = employee.role;
  form.value.department_id = employee.departmentId;
  form.value.email = employee.email;
  form.value.password = "";
  editingEmployeeId.value = employee.id;
  showCreateModal.value = false;
  showEditModal.value = true;
}

function closeModals() {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingEmployeeId.value = "";
  resetForm();
}

async function loadData() {
  try {
    const [employeesRes, departmentsRes] = await Promise.all([API.get("/employees/"), API.get("/departments/")]);
    employees.value = (employeesRes.data || []).map(normalizeEmployee);
    departments.value = (departmentsRes.data || []).map(normalizeDepartment);
  } catch (loadError) {
    error.value = loadError?.response?.data?.error || "Failed to load employees page";
  }
}

async function submitForm() {
  saving.value = true;
  message.value = "";
  error.value = "";
  try {
    if (showCreateModal.value) {
      await API.post("/employees/", {
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        email: form.value.email,
        password: form.value.password,
        role: form.value.role,
        department_id: form.value.department_id,
      });
      message.value = "Employee created successfully";
    } else if (showEditModal.value && editingEmployeeId.value) {
      await API.put(`/employees/${editingEmployeeId.value}`, {
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        role: form.value.role,
        department_id: form.value.department_id,
      });
      message.value = "Employee updated successfully";
    }
    closeModals();
    await loadData();
  } catch (submitError) {
    error.value = submitError?.response?.data?.error || "Failed to save employee";
  } finally {
    saving.value = false;
  }
}

async function deactivateEmployee(employee) {
  message.value = "";
  error.value = "";
  try {
    await API.delete(`/employees/${employee.id}`);
    message.value = `${employee.fullName} has been deactivated`;
    await loadData();
  } catch (deactivateError) {
    error.value = deactivateError?.response?.data?.error || "Failed to deactivate employee";
  }
}

onMounted(() => {
  loadData();
});
</script>
