<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b border-border">
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold">HR Management System</h1>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
      >
        <h2 class="text-xl font-semibold mb-4 md:mb-0">
          Salary Rate Management
        </h2>

        <button
          @click="showAddEmployeeModal = true"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Add Employee
        </button>
      </div>

      <!-- Salary Rates Table -->
      <div class="bg-card rounded-lg border border-border shadow-sm">
        <div class="p-4 border-b border-border">
          <div class="flex justify-between items-center">
            <h3 class="font-medium">Employee Daily Rates</h3>
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search employees..."
                class="px-3 py-2 pl-9 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border bg-muted/50">
                <th class="px-4 py-3 text-left text-sm font-medium">
                  Employee
                </th>
                <th class="px-4 py-3 text-left text-sm font-medium">
                  Position
                </th>
                <th class="px-4 py-3 text-left text-sm font-medium">
                  Daily Rate
                </th>
                <th class="px-4 py-3 text-left text-sm font-medium">
                  Last Updated
                </th>
                <th class="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="employee in filteredEmployees"
                :key="employee.id"
                class="border-b border-border"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3"
                    >
                      {{ getInitials(employee.name) }}
                    </div>
                    <div class="font-medium">{{ employee.name }}</div>
                  </div>
                </td>
                <td class="px-4 py-3">{{ employee.position }}</td>
                <td class="px-4 py-3">
                  {{ formatCurrency(employee.dailyRate) }}
                </td>
                <td class="px-4 py-3">{{ employee.lastUpdated || "N/A" }}</td>
                <td class="px-4 py-3">
                  <div class="flex space-x-2">
                    <button
                      @click="editEmployee(employee)"
                      class="px-2 py-1 text-sm bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteEmployee(employee.id)"
                      class="px-2 py-1 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Employee Modal -->
      <div
        v-if="showAddEmployeeModal || showEditEmployeeModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-background rounded-lg shadow-lg w-full max-w-md mx-4">
          <div class="p-4 border-b border-border">
            <h3 class="text-lg font-medium">
              {{ showEditEmployeeModal ? "Edit Employee" : "Add New Employee" }}
            </h3>
          </div>

          <div class="p-4">
            <form @submit.prevent="saveEmployee" class="space-y-4">
              <div>
                <label for="name" class="block text-sm font-medium mb-1"
                  >Name</label
                >
                <input
                  type="text"
                  id="name"
                  v-model="currentEmployee.name"
                  required
                  class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label for="position" class="block text-sm font-medium mb-1"
                  >Position</label
                >
                <input
                  type="text"
                  id="position"
                  v-model="currentEmployee.position"
                  required
                  class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label for="dailyRate" class="block text-sm font-medium mb-1"
                  >Daily Rate (IDR)</label
                >
                <input
                  type="number"
                  id="dailyRate"
                  v-model="currentEmployee.dailyRate"
                  required
                  min="0"
                  class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// State
const employees = ref([
  {
    id: 1,
    name: "John Doe",
    position: "Software Engineer",
    dailyRate: 100000,
    lastUpdated: "2023-05-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "UI/UX Designer",
    dailyRate: 90000,
    lastUpdated: "2023-06-20",
  },
  {
    id: 3,
    name: "Robert Johnson",
    position: "Project Manager",
    dailyRate: 120000,
    lastUpdated: "2023-04-10",
  },
  {
    id: 4,
    name: "Emily Davis",
    position: "Marketing Specialist",
    dailyRate: 85000,
    lastUpdated: "2023-07-05",
  },
  {
    id: 5,
    name: "Michael Brown",
    position: "Data Analyst",
    dailyRate: 95000,
    lastUpdated: "2023-06-30",
  },
]);

const searchQuery = ref("");
const showAddEmployeeModal = ref(false);
const showEditEmployeeModal = ref(false);
const currentEmployee = ref({
  id: null,
  name: "",
  position: "",
  dailyRate: 0,
});

// Filtered employees based on search query
const filteredEmployees = computed(() => {
  if (!searchQuery.value) return employees.value;

  const query = searchQuery.value.toLowerCase();
  return employees.value.filter(
    (employee) =>
      employee.name.toLowerCase().includes(query) ||
      employee.position.toLowerCase().includes(query)
  );
});

// Edit employee
const editEmployee = (employee) => {
  currentEmployee.value = { ...employee };
  showEditEmployeeModal.value = true;
};

// Delete employee
const deleteEmployee = (id) => {
  if (confirm("Are you sure you want to delete this employee?")) {
    employees.value = employees.value.filter((emp) => emp.id !== id);
    // In a real app, you would send a delete request to an API
  }
};

// Save employee (add or update)
const saveEmployee = () => {
  const now = new Date().toISOString().split("T")[0];

  if (showEditEmployeeModal.value) {
    // Update existing employee
    const index = employees.value.findIndex(
      (emp) => emp.id === currentEmployee.value.id
    );
    if (index !== -1) {
      employees.value[index] = {
        ...currentEmployee.value,
        lastUpdated: now,
      };
    }
  } else {
    // Add new employee
    const newId = Math.max(0, ...employees.value.map((emp) => emp.id)) + 1;
    employees.value.push({
      ...currentEmployee.value,
      id: newId,
      lastUpdated: now,
    });
  }

  // Close modal and reset form
  closeModal();
};

// Close modal
const closeModal = () => {
  showAddEmployeeModal.value = false;
  showEditEmployeeModal.value = false;
  currentEmployee.value = {
    id: null,
    name: "",
    position: "",
    dailyRate: 0,
  };
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Get employee initials for the avatar
const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
};
</script>

<style>
/* Same styles as in AttendancePage.vue */
</style>
