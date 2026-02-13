<template>
  <section class="space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-[#061b4f] md:text-4xl">Departments</h1>
        <p class="mt-1 text-sm text-slate-500">{{ departmentCards.length }} departments</p>
      </div>
      <button class="inline-flex items-center gap-2 rounded-xl bg-[#112c63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c234f]" @click="showCreateModal = true">
        <PlusIcon class="h-5 w-5" />
        Add Department
      </button>
    </div>

    <div v-if="message" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{{ message }}</div>
    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{{ error }}</div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article v-for="department in departmentCards" :key="department.id || department.name" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="h-3.5 w-3.5 rounded-full" :class="department.dotClass"></span>
          <ArrowTopRightOnSquareIcon v-if="department.memberCount > 0" class="h-5 w-5 text-slate-400" />
        </div>

        <h2 class="mt-4 text-2xl font-bold text-slate-800">{{ department.name }}</h2>
        <p class="mt-1 text-sm text-slate-500">Led by {{ department.lead }}</p>

        <div class="mt-5 flex items-center gap-2 border-t border-slate-200 pt-4 text-slate-500">
          <UserGroupIcon class="h-5 w-5" />
          <p class="text-sm">{{ department.memberCount }} members</p>
        </div>
      </article>
    </div>

    <div v-if="showCreateModal" class="fixed inset-0 z-40 grid place-items-center bg-slate-900/45 px-4">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div class="mb-4 flex items-start justify-between">
          <h2 class="text-xl font-bold text-slate-800">Create Department</h2>
          <button class="rounded-md p-1 text-slate-400 hover:bg-slate-100" @click="closeModal">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        <form class="space-y-4" @submit.prevent="createDepartment">
          <div>
            <label class="mb-1 block text-sm font-semibold text-slate-600">Department Name</label>
            <input
              v-model="newDepartmentName"
              required
              class="h-11 w-full rounded-xl border border-slate-200 px-3 outline-none ring-indigo-500 focus:ring-2"
              placeholder="e.g. Engineering"
            />
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" class="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="rounded-xl bg-[#112c63] px-4 py-2 font-semibold text-white hover:bg-[#0c234f]" :disabled="saving">
              {{ saving ? "Creating..." : "Create" }}
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
import { normalizeDepartment, normalizeEmployee } from "@/utils/normalizers";
import { ArrowTopRightOnSquareIcon, PlusIcon, UserGroupIcon, XMarkIcon } from "@heroicons/vue/24/outline";

const departments = ref([]);
const employees = ref([]);
const message = ref("");
const error = ref("");
const saving = ref(false);
const showCreateModal = ref(false);
const newDepartmentName = ref("");
const dots = ["bg-[#1a2f68]", "bg-blue-500", "bg-amber-500", "bg-emerald-500", "bg-red-500"];

const departmentCards = computed(() =>
  departments.value.map((department, idx) => {
    const members = employees.value.filter((employee) => employee.departmentName === department.name);
    const manager = members.find((employee) => employee.role === "manager");

    return {
      ...department,
      dotClass: dots[idx % dots.length],
      memberCount: members.length,
      lead: manager?.fullName || members[0]?.fullName || "Unassigned",
    };
  })
);

function closeModal() {
  showCreateModal.value = false;
  newDepartmentName.value = "";
}

async function loadData() {
  try {
    const [departmentsRes, employeesRes] = await Promise.all([API.get("/departments/"), API.get("/employees/")]);
    departments.value = (departmentsRes.data || []).map(normalizeDepartment);
    employees.value = (employeesRes.data || []).map(normalizeEmployee);
  } catch (loadError) {
    error.value = loadError?.response?.data?.error || "Failed to load departments page";
  }
}

async function createDepartment() {
  saving.value = true;
  message.value = "";
  error.value = "";
  try {
    await API.post("/departments/", { name: newDepartmentName.value.trim() });
    message.value = "Department created successfully";
    closeModal();
    await loadData();
  } catch (createError) {
    error.value = createError?.response?.data?.error || "Failed to create department";
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>
