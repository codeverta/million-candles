<template>
  <div class="min-h-screen bg-background text-foreground p-4 md:p-8">
    <header class="mb-8">
      <h1 class="text-3xl font-bold">Financial Report</h1>
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-4"
      >
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-semibold">{{ companyName }}</h2>
          <p class="text-muted-foreground">Period: {{ reportPeriod }}</p>
        </div>
        <div class="flex gap-2">
          <select
            v-model="selectedReport"
            class="px-3 py-2 rounded-md border border-input bg-background"
          >
            <option value="income">Income Statement</option>
            <option value="balance">Balance Sheet</option>
            <option value="cashflow">Cash Flow</option>
          </select>
          <button
            @click="printReport"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <printer-icon class="w-4 h-4 inline mr-2" />
            Print
          </button>
        </div>
      </div>
    </header>

    <main class="space-y-8">
      <!-- Financial Summary Card -->
      <div class="bg-card text-card-foreground rounded-lg border shadow-sm">
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Financial Summary</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-background p-4 rounded-md border">
              <p class="text-muted-foreground text-sm">Total Revenue</p>
              <p class="text-2xl font-bold">
                {{ formatCurrency(summary.revenue) }}
              </p>
              <p
                class="text-sm"
                :class="
                  summary.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'
                "
              >
                <trending-up-icon
                  v-if="summary.revenueChange >= 0"
                  class="w-4 h-4 inline"
                />
                <trending-down-icon v-else class="w-4 h-4 inline" />
                {{ summary.revenueChange }}% from last period
              </p>
            </div>
            <div class="bg-background p-4 rounded-md border">
              <p class="text-muted-foreground text-sm">Net Profit</p>
              <p class="text-2xl font-bold">
                {{ formatCurrency(summary.netProfit) }}
              </p>
              <p
                class="text-sm"
                :class="
                  summary.profitChange >= 0 ? 'text-green-500' : 'text-red-500'
                "
              >
                <trending-up-icon
                  v-if="summary.profitChange >= 0"
                  class="w-4 h-4 inline"
                />
                <trending-down-icon v-else class="w-4 h-4 inline" />
                {{ summary.profitChange }}% from last period
              </p>
            </div>
            <div class="bg-background p-4 rounded-md border">
              <p class="text-muted-foreground text-sm">Cash Balance</p>
              <p class="text-2xl font-bold">
                {{ formatCurrency(summary.cashBalance) }}
              </p>
              <p
                class="text-sm"
                :class="
                  summary.cashChange >= 0 ? 'text-green-500' : 'text-red-500'
                "
              >
                <trending-up-icon
                  v-if="summary.cashChange >= 0"
                  class="w-4 h-4 inline"
                />
                <trending-down-icon v-else class="w-4 h-4 inline" />
                {{ summary.cashChange }}% from last period
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Income Statement -->
      <div
        v-if="selectedReport === 'income'"
        class="bg-card text-card-foreground rounded-lg border shadow-sm"
      >
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Income Statement</h3>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4">Item</th>
                  <th class="text-right py-3 px-4">Current Period</th>
                  <th class="text-right py-3 px-4">Previous Period</th>
                  <th class="text-right py-3 px-4">Change (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in incomeStatement"
                  :key="index"
                  class="border-b"
                >
                  <td
                    class="py-3 px-4 font-medium"
                    :class="{ 'pl-8': item.isSubItem }"
                  >
                    {{ item.name }}
                  </td>
                  <td class="text-right py-3 px-4">
                    {{ formatCurrency(item.current) }}
                  </td>
                  <td class="text-right py-3 px-4">
                    {{ formatCurrency(item.previous) }}
                  </td>
                  <td
                    class="text-right py-3 px-4"
                    :class="getChangeClass(item.change)"
                  >
                    {{ item.change }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Balance Sheet -->
      <div
        v-if="selectedReport === 'balance'"
        class="bg-card text-card-foreground rounded-lg border shadow-sm"
      >
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Balance Sheet</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium mb-2">Assets</h4>
              <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-3 px-4">Item</th>
                      <th class="text-right py-3 px-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in balanceSheet.assets"
                      :key="index"
                      class="border-b"
                    >
                      <td
                        class="py-3 px-4 font-medium"
                        :class="{
                          'pl-8': item.isSubItem,
                          'font-semibold': item.isTotal,
                        }"
                      >
                        {{ item.name }}
                      </td>
                      <td
                        class="text-right py-3 px-4"
                        :class="{ 'font-semibold': item.isTotal }"
                      >
                        {{ formatCurrency(item.amount) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 class="font-medium mb-2">Liabilities & Equity</h4>
              <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-3 px-4">Item</th>
                      <th class="text-right py-3 px-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in balanceSheet.liabilities"
                      :key="index"
                      class="border-b"
                    >
                      <td
                        class="py-3 px-4 font-medium"
                        :class="{
                          'pl-8': item.isSubItem,
                          'font-semibold': item.isTotal,
                        }"
                      >
                        {{ item.name }}
                      </td>
                      <td
                        class="text-right py-3 px-4"
                        :class="{ 'font-semibold': item.isTotal }"
                      >
                        {{ formatCurrency(item.amount) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cash Flow Statement -->
      <div
        v-if="selectedReport === 'cashflow'"
        class="bg-card text-card-foreground rounded-lg border shadow-sm"
      >
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">Cash Flow Statement</h3>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-3 px-4">Item</th>
                  <th class="text-right py-3 px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in cashFlow"
                  :key="index"
                  class="border-b"
                >
                  <td
                    class="py-3 px-4 font-medium"
                    :class="{
                      'pl-8': item.isSubItem,
                      'font-semibold': item.isTotal,
                    }"
                  >
                    {{ item.name }}
                  </td>
                  <td
                    class="text-right py-3 px-4"
                    :class="{ 'font-semibold': item.isTotal }"
                  >
                    {{ formatCurrency(item.amount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <footer class="mt-8 text-center text-sm text-muted-foreground">
      <p>Generated on {{ new Date().toLocaleDateString() }}</p>
      <p>
        © {{ new Date().getFullYear() }} {{ companyName }} - All Rights Reserved
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { PrinterIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-vue-next";

// Company information
const companyName = ref("PT Example Corporation");
const reportPeriod = ref("January 1 - March 31, 2025");
const selectedReport = ref("income");

// Financial summary data
const summary = ref({
  revenue: 1250000,
  revenueChange: 12.5,
  netProfit: 320000,
  profitChange: 8.2,
  cashBalance: 750000,
  cashChange: -3.1,
});

// Income statement data
const incomeStatement = ref([
  { name: "Revenue", current: 1250000, previous: 1111111, change: 12.5 },
  {
    name: "Cost of Goods Sold",
    current: 500000,
    previous: 450000,
    change: 11.1,
    isSubItem: true,
  },
  { name: "Gross Profit", current: 750000, previous: 661111, change: 13.4 },
  {
    name: "Operating Expenses",
    current: 350000,
    previous: 330000,
    change: 6.1,
    isSubItem: true,
  },
  {
    name: "Salaries",
    current: 200000,
    previous: 180000,
    change: 11.1,
    isSubItem: true,
  },
  { name: "Rent", current: 50000, previous: 50000, change: 0, isSubItem: true },
  {
    name: "Utilities",
    current: 30000,
    previous: 28000,
    change: 7.1,
    isSubItem: true,
  },
  {
    name: "Other Expenses",
    current: 70000,
    previous: 72000,
    change: -2.8,
    isSubItem: true,
  },
  { name: "Operating Income", current: 400000, previous: 331111, change: 20.8 },
  {
    name: "Interest Expense",
    current: 20000,
    previous: 22000,
    change: -9.1,
    isSubItem: true,
  },
  {
    name: "Income Before Tax",
    current: 380000,
    previous: 309111,
    change: 22.9,
  },
  {
    name: "Income Tax",
    current: 60000,
    previous: 50000,
    change: 20.0,
    isSubItem: true,
  },
  { name: "Net Income", current: 320000, previous: 259111, change: 23.5 },
]);

// Balance sheet data
const balanceSheet = ref({
  assets: [
    { name: "Current Assets", amount: 1200000 },
    { name: "Cash and Cash Equivalents", amount: 750000, isSubItem: true },
    { name: "Accounts Receivable", amount: 300000, isSubItem: true },
    { name: "Inventory", amount: 150000, isSubItem: true },
    { name: "Non-Current Assets", amount: 2500000 },
    { name: "Property, Plant and Equipment", amount: 2000000, isSubItem: true },
    { name: "Intangible Assets", amount: 500000, isSubItem: true },
    { name: "Total Assets", amount: 3700000, isTotal: true },
  ],
  liabilities: [
    { name: "Current Liabilities", amount: 500000 },
    { name: "Accounts Payable", amount: 200000, isSubItem: true },
    { name: "Short-term Loans", amount: 300000, isSubItem: true },
    { name: "Non-Current Liabilities", amount: 1200000 },
    { name: "Long-term Debt", amount: 1200000, isSubItem: true },
    { name: "Total Liabilities", amount: 1700000, isTotal: true },
    { name: "Equity", amount: 2000000 },
    { name: "Share Capital", amount: 1000000, isSubItem: true },
    { name: "Retained Earnings", amount: 1000000, isSubItem: true },
    { name: "Total Equity", amount: 2000000, isTotal: true },
    { name: "Total Liabilities and Equity", amount: 3700000, isTotal: true },
  ],
});

// Cash flow data
const cashFlow = ref([
  { name: "Cash Flow from Operating Activities", amount: 0 },
  { name: "Net Income", amount: 320000, isSubItem: true },
  { name: "Depreciation and Amortization", amount: 50000, isSubItem: true },
  { name: "Changes in Working Capital", amount: -70000, isSubItem: true },
  { name: "Net Cash from Operating Activities", amount: 300000, isTotal: true },

  { name: "Cash Flow from Investing Activities", amount: 0 },
  { name: "Purchase of Equipment", amount: -150000, isSubItem: true },
  { name: "Sale of Investments", amount: 50000, isSubItem: true },
  {
    name: "Net Cash from Investing Activities",
    amount: -100000,
    isTotal: true,
  },

  { name: "Cash Flow from Financing Activities", amount: 0 },
  { name: "Loan Repayments", amount: -100000, isSubItem: true },
  { name: "Dividends Paid", amount: -125000, isSubItem: true },
  {
    name: "Net Cash from Financing Activities",
    amount: -225000,
    isTotal: true,
  },

  { name: "Net Increase in Cash", amount: -25000, isTotal: true },
  { name: "Cash at Beginning of Period", amount: 775000 },
  { name: "Cash at End of Period", amount: 750000, isTotal: true },
]);

// Helper functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getChangeClass = (change) => {
  if (change > 0) return "text-green-500";
  if (change < 0) return "text-red-500";
  return "";
};

const printReport = () => {
  window.print();
};
</script>

<style>
@media print {
  body {
    background-color: white;
  }

  button {
    display: none;
  }

  select {
    display: none;
  }

  @page {
    margin: 2cm;
  }
}
</style>
