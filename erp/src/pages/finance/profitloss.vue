<script setup>
import { formatCurrency } from "@/lib/utils";
import { computed, ref, onMounted } from "vue";
import financialApi from "@/services/financial-api";
// Months for report
const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// Data state
const loading = ref(false);
const error = ref(null);
const categories = ref([]);
const transactions = ref([]);
const pagination = ref({
  current_page: 1,
  per_page: 15,
  total: 0,
});

// Filters
const filters = ref({
  start_date: null,
  end_date: null,
  date: null,
  category_id: "",
  type: "",
  bank_account_id: "",
  page: 1,
  per_page: 15,
});

onMounted(async () => {
  // Load transactions
  await loadTransactions();
});

// Load transactions based on current filters
async function loadTransactions() {
  try {
    loading.value = true;
    error.value = null;

    // Convert date filter to start_date and end_date as expected by API
    const params = { ...filters.value };
    if (params.date) {
      params.start_date = params.date;
      params.end_date = params.date;
      delete params.date;
    }

    const response = await financialApi.getTransactions(params);
    transactions.value = response.data.data || [];

    // Set pagination data if available
    if (response.data.meta) {
      pagination.value = {
        current_page: response.data.meta.current_page,
        per_page: response.data.meta.per_page,
        total: response.data.meta.total,
      };
    }
  } catch (err) {
    error.value =
      "Failed to load transactions: " +
      (err.response?.data?.message || err.message);
    console.error("API Error:", err);
  } finally {
    loading.value = false;
  }
}

// Report calculations
const totalIncome = computed(() => {
  return transactions.value
    .filter((t) => t.type === "income" && matchesReportPeriod(t.date))
    .reduce((sum, t) => sum + t.amount, 0);
});

const totalExpense = computed(() => {
  return transactions.value
    .filter((t) => t.type === "expense" && matchesReportPeriod(t.date))
    .reduce((sum, t) => sum + t.amount, 0);
});

const netProfit = computed(() => {
  return totalIncome.value - totalExpense.value;
});

function matchesReportPeriod(dateString) {
  const date = new Date(dateString);
  return (
    date.getMonth() + 1 === reportFilters.value.month &&
    date.getFullYear() === reportFilters.value.year
  );
}

const categoryReport = computed(() => {
  const report = {};

  // Initialize categories
  categories.value.forEach((cat) => {
    report[cat] = { name: cat, income: 0, expense: 0, difference: 0 };
  });

  // Sum up transactions by category
  transactions.value
    .filter((t) => matchesReportPeriod(t.date))
    .forEach((t) => {
      if (t.type === "income") {
        if (report[t.category]) {
          report[t.category].income += t.amount;
        } else {
          report[t.category] = {
            name: t.category,
            income: t.amount,
            expense: 0,
            difference: 0,
          };
        }
      } else {
        if (report[t.category]) {
          report[t.category].expense += t.amount;
        } else {
          report[t.category] = {
            name: t.category,
            income: 0,
            expense: t.amount,
            difference: 0,
          };
        }
      }
    });

  // Calculate differences
  Object.values(report).forEach((cat) => {
    cat.difference = cat.income - cat.expense;
  });

  return Object.values(report);
});

// Years for report
const currentYear = new Date().getFullYear();
const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

// Report filters
const reportFilters = ref({
  month: new Date().getMonth() + 1,
  year: currentYear,
});

function generateReport() {
  // In a real application, this would fetch data or recalculate based on filters
  console.log(
    "Generating report for",
    reportFilters.value.month,
    reportFilters.value.year
  );
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">Laporan Laba Rugi</h2>

    <!-- Date Filter -->
    <div class="flex space-x-4 items-end">
      <div>
        <label class="block text-sm font-medium mb-1">Bulan</label>
        <select
          v-model="reportFilters.month"
          class="rounded-md border border-input bg-background px-3 py-2"
        >
          <option
            v-for="(month, index) in months"
            :key="index"
            :value="index + 1"
          >
            {{ month }}
          </option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Tahun</label>
        <select
          v-model="reportFilters.year"
          class="rounded-md border border-input bg-background px-3 py-2"
        >
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
      <div>
        <button
          class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          @click="generateReport"
        >
          Tampilkan
        </button>
      </div>
      <div class="ml-auto flex space-x-2">
        <button
          class="border border-input bg-background hover:bg-muted px-4 py-2 rounded-md flex items-center"
        >
          <span class="mr-2">Export PDF</span>
        </button>
        <button
          class="border border-input bg-background hover:bg-muted px-4 py-2 rounded-md flex items-center"
        >
          <span class="mr-2">Export Excel</span>
        </button>
      </div>
    </div>

    <!-- Summary Chart -->
    <div class="bg-muted/40 rounded-lg p-6">
      <h3 class="text-lg font-medium mb-4">
        Ringkasan Pendapatan vs Pengeluaran
      </h3>
      <div class="h-64 bg-muted/60 rounded-md flex items-center justify-center">
        <!-- Chart would go here - using placeholder -->
        <div class="text-center">
          <div class="flex justify-center space-x-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">
                {{ formatCurrency(totalIncome) }}
              </div>
              <div class="text-sm text-muted-foreground mt-1">
                Total Pendapatan
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-red-600">
                {{ formatCurrency(totalExpense) }}
              </div>
              <div class="text-sm text-muted-foreground mt-1">
                Total Pengeluaran
              </div>
            </div>
            <div class="text-center">
              <div
                class="text-3xl font-bold"
                :class="netProfit >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatCurrency(netProfit) }}
              </div>
              <div class="text-sm text-muted-foreground mt-1">Laba Bersih</div>
            </div>
          </div>
          <div class="mt-6 text-muted-foreground">
            Grafik pendapatan vs pengeluaran akan ditampilkan di sini
          </div>
        </div>
      </div>
    </div>

    <!-- Category Details -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium">Rincian Kategori</h3>

      <div class="border rounded-lg overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="bg-muted/50">
              <th class="px-4 py-3 text-left font-medium">Kategori</th>
              <th class="px-4 py-3 text-right font-medium">Pendapatan</th>
              <th class="px-4 py-3 text-right font-medium">Pengeluaran</th>
              <th class="px-4 py-3 text-right font-medium">Selisih</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="category in categoryReport"
              :key="category.name"
              class="border-t"
            >
              <td class="px-4 py-3">{{ category.name }}</td>
              <td class="px-4 py-3 text-right text-green-600">
                {{ formatCurrency(category.income) }}
              </td>
              <td class="px-4 py-3 text-right text-red-600">
                {{ formatCurrency(category.expense) }}
              </td>
              <td
                class="px-4 py-3 text-right font-medium"
                :class="
                  category.difference >= 0 ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ formatCurrency(category.difference) }}
              </td>
            </tr>
            <tr class="border-t bg-muted/30 font-medium">
              <td class="px-4 py-3">Total</td>
              <td class="px-4 py-3 text-right text-green-600">
                {{ formatCurrency(totalIncome) }}
              </td>
              <td class="px-4 py-3 text-right text-red-600">
                {{ formatCurrency(totalExpense) }}
              </td>
              <td
                class="px-4 py-3 text-right font-medium"
                :class="netProfit >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatCurrency(netProfit) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Your component styles here */
</style>
