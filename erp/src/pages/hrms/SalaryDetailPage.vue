<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b border-border">
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold">HR Management System</h1>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <div class="flex items-center mb-6">
        <button
          @click="goBack"
          class="mr-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
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
            class="h-5 w-5"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </button>
        <h2 class="text-xl font-semibold">Salary Detail</h2>
        <button
          @click="printSalarySlip"
          class="ml-auto px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center"
        >
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
            class="h-4 w-4 mr-2"
          >
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path
              d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
            ></path>
            <rect width="12" height="8" x="6" y="14"></rect>
          </svg>
          Print Slip
        </button>
      </div>

      <!-- Salary Slip -->
      <div
        id="salary-slip"
        class="bg-card rounded-lg border border-border shadow-sm p-6 max-w-3xl mx-auto"
      >
        <div class="text-center mb-6">
          <h3 class="text-xl font-bold">SALARY SLIP</h3>
          <p class="text-muted-foreground">Period: {{ salaryData.period }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="font-medium mb-2">Employee Information</h4>
            <div class="space-y-1">
              <div class="flex">
                <span class="w-32 text-muted-foreground">Name:</span>
                <span class="font-medium">{{ salaryData.employee.name }}</span>
              </div>
              <div class="flex">
                <span class="w-32 text-muted-foreground">Position:</span>
                <span>{{ salaryData.employee.position }}</span>
              </div>
              <div class="flex">
                <span class="w-32 text-muted-foreground">Employee ID:</span>
                <span>{{ salaryData.employee.id }}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="font-medium mb-2">Payment Information</h4>
            <div class="space-y-1">
              <div class="flex">
                <span class="w-32 text-muted-foreground">Payment Date:</span>
                <span>{{ salaryData.paymentDate }}</span>
              </div>
              <div class="flex">
                <span class="w-32 text-muted-foreground">Payment Method:</span>
                <span>Bank Transfer</span>
              </div>
              <div class="flex">
                <span class="w-32 text-muted-foreground">Reference:</span>
                <span>{{ salaryData.reference }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="font-medium mb-2">Attendance Summary</h4>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-muted/30 p-3 rounded-md">
              <div class="text-muted-foreground text-sm">Working Days</div>
              <div class="text-xl font-medium">
                {{ salaryData.workingDays }}
              </div>
            </div>
            <div class="bg-muted/30 p-3 rounded-md">
              <div class="text-muted-foreground text-sm">Present</div>
              <div class="text-xl font-medium">
                {{ salaryData.daysPresent }}
              </div>
            </div>
            <div class="bg-muted/30 p-3 rounded-md">
              <div class="text-muted-foreground text-sm">Absent</div>
              <div class="text-xl font-medium">{{ salaryData.daysAbsent }}</div>
            </div>
            <div class="bg-muted/30 p-3 rounded-md">
              <div class="text-muted-foreground text-sm">Leave</div>
              <div class="text-xl font-medium">{{ salaryData.daysLeave }}</div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="font-medium mb-2">Earnings</h4>
          <div class="border-t border-border">
            <div class="flex justify-between py-2 border-b border-border">
              <span
                >Basic Salary ({{ salaryData.daysPresent }} days ×
                {{ formatCurrency(salaryData.dailyRate) }})</span
              >
              <span class="font-medium">{{
                formatCurrency(salaryData.basicSalary)
              }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-border">
              <span>Overtime</span>
              <span class="font-medium">{{
                formatCurrency(salaryData.overtime)
              }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-border">
              <span>Bonus</span>
              <span class="font-medium">{{
                formatCurrency(salaryData.bonus)
              }}</span>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="font-medium mb-2">Deductions</h4>
          <div class="border-t border-border">
            <div class="flex justify-between py-2 border-b border-border">
              <span>Tax</span>
              <span class="font-medium">{{
                formatCurrency(salaryData.tax)
              }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-border">
              <span>Absence Deduction</span>
              <span class="font-medium">{{
                formatCurrency(salaryData.absenceDeduction)
              }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-border">
              <span>Other Deductions</span>
              <span class="font-medium">{{
                formatCurrency(salaryData.otherDeductions)
              }}</span>
            </div>
          </div>
        </div>

        <div class="bg-muted/30 p-4 rounded-md">
          <div class="flex justify-between items-center">
            <span class="text-lg font-medium">Net Salary</span>
            <span class="text-xl font-bold">{{
              formatCurrency(salaryData.netSalary)
            }}</span>
          </div>
        </div>

        <div
          class="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground"
        >
          <p>
            This is a computer-generated document. No signature is required.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Mock salary data - in a real app, this would come from an API based on the employee ID and period
const salaryData = ref({
  employee: {
    id: "EMP001",
    name: "John Doe",
    position: "Software Engineer",
  },
  period: "March 1-31, 2023",
  paymentDate: "April 5, 2023",
  reference: "SAL-2023-03-001",
  workingDays: 23,
  daysPresent: 21,
  daysAbsent: 1,
  daysLeave: 1,
  dailyRate: 100000,
  basicSalary: 2100000,
  overtime: 150000,
  bonus: 200000,
  tax: 245000,
  absenceDeduction: 100000,
  otherDeductions: 50000,
  netSalary: 2055000,
});

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Go back to previous page
const goBack = () => {
  // In a real app, you would use router.back() or similar
  console.log("Go back");
};

// Print salary slip
const printSalarySlip = () => {
  window.print();
};
</script>

<style>
/* Same styles as in AttendancePage.vue */

@media print {
  header,
  button {
    display: none !important;
  }

  #salary-slip {
    box-shadow: none !important;
    border: none !important;
  }

  body {
    background: white !important;
  }
}
</style>
