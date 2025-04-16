<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Manajemen Keuangan</h1>

    <!-- Tab Navigation -->
    <div class="border-b mb-6">
      <div class="flex space-x-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="py-2 px-4 font-medium transition-colors"
          :class="
            activeTab === tab.id
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          "
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Transaksi Keuangan -->
    <div v-if="activeTab === 'transactions'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Transaksi Keuangan</h2>
        <button
          @click="showTransactionForm = true"
          class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center"
        >
          <span class="mr-1">+</span> Tambah Transaksi
        </button>
      </div>

      <!-- Filters -->
      <div
        class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/40 rounded-lg"
      >
        <div>
          <label class="block text-sm font-medium mb-1">Tanggal</label>
          <input
            type="date"
            v-model="filters.date"
            class="w-full rounded-md border border-input bg-background px-3 py-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Kategori</label>
          <select
            v-model="filters.category"
            class="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">Semua</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Jenis</label>
          <select
            v-model="filters.type"
            class="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">Semua</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Akun Bank</label>
          <select
            v-model="filters.account"
            class="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">Semua</option>
            <option
              v-for="account in accounts"
              :key="account.id"
              :value="account.id"
            >
              {{ account.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="border rounded-lg overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="bg-muted/50">
              <th class="px-4 py-3 text-left font-medium">Tanggal</th>
              <th class="px-4 py-3 text-left font-medium">Jenis</th>
              <th class="px-4 py-3 text-left font-medium">Kategori</th>
              <th class="px-4 py-3 text-left font-medium">Jumlah</th>
              <th class="px-4 py-3 text-left font-medium">Akun</th>
              <th class="px-4 py-3 text-left font-medium">Catatan</th>
              <th class="px-4 py-3 text-left font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in filteredTransactions"
              :key="transaction.id"
              class="border-t"
            >
              <td class="px-4 py-3">{{ formatDate(transaction.date) }}</td>
              <td class="px-4 py-3">
                <span
                  :class="
                    transaction.type === 'income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ transaction.type === "income" ? "Income" : "Expense" }}
                </span>
              </td>
              <td class="px-4 py-3">{{ transaction.category }}</td>
              <td
                class="px-4 py-3 font-medium"
                :class="
                  transaction.type === 'income'
                    ? 'text-green-600'
                    : 'text-red-600'
                "
              >
                {{ formatCurrency(transaction.amount) }}
              </td>
              <td class="px-4 py-3">
                {{ getAccountName(transaction.accountId) }}
              </td>
              <td class="px-4 py-3 text-muted-foreground">
                {{ transaction.notes }}
              </td>
              <td class="px-4 py-3">
                <button class="text-primary hover:text-primary/80">Edit</button>
              </td>
            </tr>
            <tr v-if="filteredTransactions.length === 0">
              <td
                colspan="7"
                class="px-4 py-8 text-center text-muted-foreground"
              >
                Tidak ada transaksi yang ditemukan
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Transaction Form Modal -->
      <div
        v-if="showTransactionForm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Tambah Transaksi</h3>
            <button
              @click="showTransactionForm = false"
              class="text-muted-foreground hover:text-foreground"
            >
              &times;
            </button>
          </div>

          <form @submit.prevent="addTransaction" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Jenis</label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="newTransaction.type"
                    value="income"
                    class="mr-2"
                  />
                  Income
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="newTransaction.type"
                    value="expense"
                    class="mr-2"
                  />
                  Expense
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Kategori</label>
              <select
                v-model="newTransaction.category"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="" disabled>Pilih kategori</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Tanggal</label>
              <input
                type="date"
                v-model="newTransaction.date"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Jumlah</label>
              <input
                type="number"
                v-model="newTransaction.amount"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1"
                >Akun Bank / Kas</label
              >
              <select
                v-model="newTransaction.accountId"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="" disabled>Pilih akun</option>
                <option
                  v-for="account in accounts"
                  :key="account.id"
                  :value="account.id"
                >
                  {{ account.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Catatan</label>
              <textarea
                v-model="newTransaction.notes"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
                rows="2"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1"
                >Terkait Pesanan (Opsional)</label
              >
              <input
                type="text"
                v-model="newTransaction.relatedOrder"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="ID Pesanan"
              />
            </div>

            <div class="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                @click="showTransactionForm = false"
                class="px-4 py-2 border border-input rounded-md"
              >
                Batal
              </button>
              <button
                type="submit"
                class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Laporan Laba Rugi -->
    <div v-if="activeTab === 'profitLoss'" class="space-y-6">
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
        <div
          class="h-64 bg-muted/60 rounded-md flex items-center justify-center"
        >
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
                <div class="text-sm text-muted-foreground mt-1">
                  Laba Bersih
                </div>
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

    <!-- Akun Bank / Kas -->
    <div v-if="activeTab === 'accounts'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Akun Bank / Kas</h2>
        <button
          @click="showAccountForm = true"
          class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          + Tambah Akun
        </button>
      </div>

      <!-- Accounts Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="account in accounts"
          :key="account.id"
          class="border rounded-lg overflow-hidden"
        >
          <div class="p-4 border-b bg-muted/30">
            <h3 class="font-medium">{{ account.name }}</h3>
          </div>
          <div class="p-4 space-y-2">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Saldo Awal:</span>
              <span>{{ formatCurrency(account.initialBalance) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Total Masuk:</span>
              <span class="text-green-600">{{
                formatCurrency(getAccountIncome(account.id))
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Total Keluar:</span>
              <span class="text-red-600">{{
                formatCurrency(getAccountExpense(account.id))
              }}</span>
            </div>
            <div class="pt-2 border-t flex justify-between font-medium">
              <span>Saldo Akhir:</span>
              <span>{{ formatCurrency(getAccountBalance(account.id)) }}</span>
            </div>
          </div>
          <div class="p-4 border-t bg-muted/20">
            <button class="text-primary hover:text-primary/80 text-sm">
              Lihat Histori Transaksi
            </button>
          </div>
        </div>
      </div>

      <!-- Account Form Modal -->
      <div
        v-if="showAccountForm"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div class="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Tambah Akun Bank / Kas</h3>
            <button
              @click="showAccountForm = false"
              class="text-muted-foreground hover:text-foreground"
            >
              &times;
            </button>
          </div>

          <form @submit.prevent="addAccount" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Nama Akun</label>
              <input
                type="text"
                v-model="newAccount.name"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Saldo Awal</label>
              <input
                type="number"
                v-model="newAccount.initialBalance"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea
                v-model="newAccount.description"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
                rows="2"
              ></textarea>
            </div>

            <div class="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                @click="showAccountForm = false"
                class="px-4 py-2 border border-input rounded-md"
              >
                Batal
              </button>
              <button
                type="submit"
                class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref, computed, onMounted } from "vue";

// Tabs
const tabs = [
  { id: "transactions", name: "Transaksi Keuangan" },
  { id: "profitLoss", name: "Laporan Laba Rugi" },
  { id: "accounts", name: "Akun Bank / Kas" },
];
const activeTab = ref("transactions");

// Categories
const categories = [
  "Penjualan",
  "Pembelian Barang",
  "Gaji Karyawan",
  "Sewa",
  "Utilitas",
  "Pemasaran",
  "Transportasi",
  "Peralatan",
  "Lain-lain",
];

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

// Years for report
const currentYear = new Date().getFullYear();
const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

// Accounts
const accounts = ref([
  {
    id: 1,
    name: "Bank Mandiri",
    initialBalance: 5000000,
    description: "Rekening utama perusahaan",
  },
  {
    id: 2,
    name: "Kas Toko",
    initialBalance: 1000000,
    description: "Kas fisik di toko",
  },
  {
    id: 3,
    name: "Bank BCA",
    initialBalance: 3000000,
    description: "Rekening operasional",
  },
]);

// Transactions
const transactions = ref([
  {
    id: 1,
    date: "2023-04-01",
    type: "income",
    category: "Penjualan",
    amount: 2500000,
    accountId: 1,
    notes: "Penjualan bulan April",
    relatedOrder: "ORD-001",
  },
  {
    id: 2,
    date: "2023-04-05",
    type: "expense",
    category: "Pembelian Barang",
    amount: 1200000,
    accountId: 1,
    notes: "Pembelian stok barang",
    relatedOrder: "",
  },
  {
    id: 3,
    date: "2023-04-10",
    type: "expense",
    category: "Gaji Karyawan",
    amount: 800000,
    accountId: 1,
    notes: "Gaji karyawan bulan April",
    relatedOrder: "",
  },
  {
    id: 4,
    date: "2023-04-15",
    type: "income",
    category: "Penjualan",
    amount: 1800000,
    accountId: 2,
    notes: "Penjualan tengah bulan",
    relatedOrder: "ORD-002",
  },
  {
    id: 5,
    date: "2023-04-20",
    type: "expense",
    category: "Sewa",
    amount: 500000,
    accountId: 3,
    notes: "Sewa toko bulan April",
    relatedOrder: "",
  },
  {
    id: 6,
    date: "2023-04-25",
    type: "expense",
    category: "Utilitas",
    amount: 300000,
    accountId: 3,
    notes: "Tagihan listrik dan air",
    relatedOrder: "",
  },
  {
    id: 7,
    date: "2023-04-30",
    type: "income",
    category: "Penjualan",
    amount: 2200000,
    accountId: 1,
    notes: "Penjualan akhir bulan",
    relatedOrder: "ORD-003",
  },
]);

// Filters
const filters = ref({
  date: "",
  category: "",
  type: "",
  account: "",
});

// Report filters
const reportFilters = ref({
  month: new Date().getMonth() + 1,
  year: currentYear,
});

// New transaction form
const showTransactionForm = ref(false);
const newTransaction = ref({
  type: "income",
  category: "",
  date: new Date().toISOString().split("T")[0],
  amount: 0,
  accountId: "",
  notes: "",
  relatedOrder: "",
});

// New account form
const showAccountForm = ref(false);
const newAccount = ref({
  name: "",
  initialBalance: 0,
  description: "",
});

// Filtered transactions
const filteredTransactions = computed(() => {
  return transactions.value.filter((transaction) => {
    if (filters.value.date && transaction.date !== filters.value.date)
      return false;
    if (
      filters.value.category &&
      transaction.category !== filters.value.category
    )
      return false;
    if (filters.value.type && transaction.type !== filters.value.type)
      return false;
    if (
      filters.value.account &&
      transaction.accountId !== parseInt(filters.value.account)
    )
      return false;
    return true;
  });
});

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

const categoryReport = computed(() => {
  const report = {};

  // Initialize categories
  categories.forEach((cat) => {
    report[cat] = { name: cat, income: 0, expense: 0, difference: 0 };
  });

  // Sum up transactions by category
  transactions.value
    .filter((t) => matchesReportPeriod(t.date))
    .forEach((t) => {
      if (t.type === "income") {
        report[t.category].income += t.amount;
      } else {
        report[t.category].expense += t.amount;
      }
    });

  // Calculate differences
  Object.values(report).forEach((cat) => {
    cat.difference = cat.income - cat.expense;
  });

  return Object.values(report);
});

// Helper functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}

function getAccountName(accountId) {
  const account = accounts.value.find((a) => a.id === accountId);
  return account ? account.name : "";
}

function matchesReportPeriod(dateString) {
  const date = new Date(dateString);
  return (
    date.getMonth() + 1 === reportFilters.value.month &&
    date.getFullYear() === reportFilters.value.year
  );
}

function getAccountIncome(accountId) {
  return transactions.value
    .filter((t) => t.accountId === accountId && t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

function getAccountExpense(accountId) {
  return transactions.value
    .filter((t) => t.accountId === accountId && t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

function getAccountBalance(accountId) {
  const account = accounts.value.find((a) => a.id === accountId);
  if (!account) return 0;

  return (
    account.initialBalance +
    getAccountIncome(accountId) -
    getAccountExpense(accountId)
  );
}

function addTransaction() {
  const id =
    transactions.value.length > 0
      ? Math.max(...transactions.value.map((t) => t.id)) + 1
      : 1;

  transactions.value.push({
    id,
    ...newTransaction.value,
    amount: parseFloat(newTransaction.value.amount),
    accountId: parseInt(newTransaction.value.accountId),
  });

  // Reset form
  newTransaction.value = {
    type: "income",
    category: "",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    accountId: "",
    notes: "",
    relatedOrder: "",
  };

  showTransactionForm.value = false;
}

function addAccount() {
  const id =
    accounts.value.length > 0
      ? Math.max(...accounts.value.map((a) => a.id)) + 1
      : 1;

  accounts.value.push({
    id,
    ...newAccount.value,
    initialBalance: parseFloat(newAccount.value.initialBalance),
  });

  // Reset form
  newAccount.value = {
    name: "",
    initialBalance: 0,
    description: "",
  };

  showAccountForm.value = false;
}

function generateReport() {
  // In a real application, this would fetch data or recalculate based on filters
  console.log(
    "Generating report for",
    reportFilters.value.month,
    reportFilters.value.year
  );
}

// Initialize with current date
onMounted(() => {
  const today = new Date();
  filters.value.date = today.toISOString().split("T")[0];
});
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
