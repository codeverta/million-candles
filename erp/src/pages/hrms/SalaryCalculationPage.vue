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
        <h2 class="text-xl font-semibold mb-4 md:mb-0">Salary Calculation</h2>

        <!-- Period Selection -->
        <div class="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div class="flex items-center space-x-2">
            <label for="start-date" class="text-sm font-medium">Start:</label>
            <input
              type="date"
              id="start-date"
              v-model="startDate"
              class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div class="flex items-center space-x-2">
            <label for="end-date" class="text-sm font-medium">End:</label>
            <input
              type="date"
              id="end-date"
              v-model="endDate"
              class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            @click="calculateSalaries"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Calculate
          </button>
        </div>
      </div>

      <!-- Salary Table -->
      <div class="bg-card rounded-lg border border-border shadow-sm">
        <div class="p-4 border-b border-border">
          <div class="flex justify-between items-center">
            <h3 class="font-medium">Salary Period: {{ formattedPeriod }}</h3>
            <button
              @click="markAsPaid"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              :disabled="!salariesCalculated"
            >
              Mark All as Paid
            </button>
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
                  Days Present
                </th>
                <th class="px-4 py-3 text-left text-sm font-medium">
                  Daily Rate
                </th>
                <th class="px-4 py-3 text-left text-sm font-medium">
                  Deductions
                </th>
                <th class="px-4 py-3 text-left text-sm font-medium">
                  Total Salary
                </th>
                <th class="px-4 py-3 text-left text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="salary in salaries"
                :key="salary.employeeId"
                class="border-b border-border"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3"
                    >
                      {{ getInitials(salary.employeeName) }}
                    </div>
                    <div>
                      <div class="font-medium">{{ salary.employeeName }}</div>
                      <div class="text-sm text-muted-foreground">
                        {{ salary.position }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">{{ salary.daysPresent }}</td>
                <td class="px-4 py-3">
                  {{ formatCurrency(salary.dailyRate) }}
                </td>
                <td class="px-4 py-3">
                  {{ formatCurrency(salary.deductions) }}
                </td>
                <td class="px-4 py-3 font-medium">
                  {{ formatCurrency(salary.totalSalary) }}
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="{
                      'px-2 py-1 text-xs rounded-full': true,
                      'bg-green-100 text-green-800': salary.status === 'Paid',
                      'bg-yellow-100 text-yellow-800':
                        salary.status === 'Pending',
                    }"
                  >
                    {{ salary.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 flex justify-between items-center">
          <div class="text-sm text-muted-foreground">
            Total Employees: {{ salaries.length }}
          </div>
          <div class="font-medium">
            Total Payroll: {{ formatCurrency(totalPayroll) }}
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// State
const startDate = ref("");
const endDate = ref("");
const salaries = ref([]);
const salariesCalculated = ref(false);

// Mock data - in a real app, this would come from an API
const mockEmployees = [
  { id: 1, name: "John Doe", position: "Software Engineer", dailyRate: 100000 },
  { id: 2, name: "Jane Smith", position: "UI/UX Designer", dailyRate: 90000 },
  {
    id: 3,
    name: "Robert Johnson",
    position: "Project Manager",
    dailyRate: 120000,
  },
  {
    id: 4,
    name: "Emily Davis",
    position: "Marketing Specialist",
    dailyRate: 85000,
  },
  { id: 5, name: "Michael Brown", position: "Data Analyst", dailyRate: 95000 },
];

// Mock attendance data - in a real app, this would come from an API
const mockAttendance = {
  // This would be populated with actual attendance data
};

// Initialize dates to current month
onMounted(() => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  startDate.value = firstDay.toISOString().split("T")[0];
  endDate.value = lastDay.toISOString().split("T")[0];
});

// Format the period for display
const formattedPeriod = computed(() => {
  if (!startDate.value || !endDate.value) return "";

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
});

// Calculate total payroll
const totalPayroll = computed(() => {
  return salaries.value.reduce((sum, salary) => sum + salary.totalSalary, 0);
});

// Calculate salaries for the selected period
const calculateSalaries = () => {
  // In a real app, you would fetch attendance data for the period from an API
  // and calculate salaries based on that data

  // For this demo, we'll generate random attendance data
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

  salaries.value = mockEmployees.map((employee) => {
    // Simulate random attendance (between 70% and 100% of days)
    const daysPresent = Math.floor(totalDays * (0.7 + Math.random() * 0.3));
    const deductions = 0; // In a real app, calculate based on sick days, leave, etc.
    const totalSalary = daysPresent * employee.dailyRate;

    return {
      employeeId: employee.id,
      employeeName: employee.name,
      position: employee.position,
      dailyRate: employee.dailyRate,
      daysPresent,
      deductions,
      totalSalary,
      status: "Pending",
    };
  });

  salariesCalculated.value = true;
};

// Mark all salaries as paid
const markAsPaid = () => {
  salaries.value = salaries.value.map((salary) => ({
    ...salary,
    status: "Paid",
    paidDate: new Date().toISOString().split("T")[0],
  }));

  // In a real app, you would send this data to an API
  console.log("Marked salaries as paid:", salaries.value);

  // Show success message
  alert("All salaries marked as paid!");
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
