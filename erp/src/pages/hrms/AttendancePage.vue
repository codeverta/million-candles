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
        <h2 class="text-xl font-semibold mb-4 md:mb-0">Employee Attendance</h2>

        <!-- Date Picker -->
        <div class="w-full md:w-auto">
          <div class="flex items-center space-x-2">
            <label for="date" class="text-sm font-medium">Date:</label>
            <input
              type="date"
              id="date"
              v-model="selectedDate"
              class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              @change="loadEmployees"
            />
          </div>
        </div>
      </div>

      <!-- Attendance Table -->
      <div class="bg-card rounded-lg border border-border shadow-sm">
        <div class="p-4 border-b border-border">
          <div class="flex justify-between items-center">
            <h3 class="font-medium">Attendance Record</h3>
            <button
              @click="saveAttendance"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Save Attendance
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
                <th class="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th class="px-4 py-3 text-left text-sm font-medium">Notes</th>
                <th class="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(employee, index) in employees"
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
                    <div>
                      <div class="font-medium">{{ employee.name }}</div>
                      <div class="text-sm text-muted-foreground">
                        {{ employee.position }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <select
                    v-model="employee.status"
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="present">Present</option>
                    <option value="sick">Sick</option>
                    <option value="leave">Leave</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </td>
                <td class="px-4 py-3">
                  <input
                    type="text"
                    v-model="employee.notes"
                    placeholder="Add notes..."
                    class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </td>
                <td class="px-4 py-3">
                  <button
                    @click="resetEmployeeStatus(index)"
                    class="px-2 py-1 text-sm bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
                  >
                    Reset
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 flex justify-end">
          <div class="text-sm text-muted-foreground">
            Total Employees: {{ employees.length }} | Present:
            {{ getPresentCount() }}
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

// State
const selectedDate = ref(new Date().toISOString().split("T")[0]);
const employees = ref([]);
const savedAttendance = ref({});

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

// Load employees with their attendance status for the selected date
const loadEmployees = () => {
  // In a real app, you would fetch this data from an API based on the selected date
  const dateKey = selectedDate.value;
  const savedData = savedAttendance.value[dateKey] || {};

  employees.value = mockEmployees.map((emp) => {
    const savedEmployee = savedData[emp.id] || {};
    return {
      ...emp,
      status: savedEmployee.status || "present",
      notes: savedEmployee.notes || "",
    };
  });
};

// Save attendance data
const saveAttendance = () => {
  const dateKey = selectedDate.value;
  const attendanceData = {};

  employees.value.forEach((emp) => {
    attendanceData[emp.id] = {
      status: emp.status,
      notes: emp.notes,
    };
  });

  savedAttendance.value[dateKey] = attendanceData;

  // In a real app, you would send this data to an API
  console.log("Saved attendance for", dateKey, attendanceData);

  // Show success message
  alert("Attendance saved successfully!");
};

// Reset an employee's status to default
const resetEmployeeStatus = (index) => {
  employees.value[index].status = "present";
  employees.value[index].notes = "";
};

// Get employee initials for the avatar
const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
};

// Count present employees
const getPresentCount = () => {
  return employees.value.filter((emp) => emp.status === "present").length;
};

// Initialize
onMounted(() => {
  loadEmployees();
});
</script>

<style></style>
