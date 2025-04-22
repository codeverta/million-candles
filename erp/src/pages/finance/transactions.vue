<script setup>
import { formatCurrency } from "@/lib/utils";
import { onMounted, ref, computed, watch } from "vue";
import { formatDate } from "@/lib/utils";
import { financialApi } from "@/services/financial-api";

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
  },
});

// Data state
const loading = ref(false);
const error = ref(null);
const accounts = ref([]);
const categories = ref([]);
const orders = ref([]);
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

// New transaction form
const showTransactionForm = ref(false);
const formLoading = ref(false);
const formError = ref(null);
const newTransaction = ref({
  type: "income",
  category_id: "",
  date: new Date().toISOString().split("T")[0],
  amount: 0,
  bank_account_id: "",
  description: "",
  related_order_id: "",
});

// Report calculations
const summaryData = ref({
  total_income: 0,
  total_expenses: 0,
  balance: 0,
  income_by_category: {},
  expenses_by_category: {},
});

const totalIncome = computed(() => summaryData.value.total_income);
const totalExpense = computed(() => summaryData.value.total_expenses);
const netProfit = computed(() => summaryData.value.balance);

// Initialize with current date and load data
onMounted(async () => {
  const today = new Date();
  filters.value.date = today.toISOString().split("T")[0];

  // Load dropdown data (categories, bank accounts, etc.)
  await loadDropdownData();

  // Load transactions
  await loadTransactions();

  // Load summary data
  await loadSummary();
});

// Watch for filter changes to reload data
watch(
  [
    () => filters.value.date,
    () => filters.value.type,
    () => filters.value.category_id,
    () => filters.value.bank_account_id,
  ],
  async () => {
    await loadTransactions();
  }
);

// Load dropdown data (categories, bank accounts, orders)
async function loadDropdownData() {
  try {
    loading.value = true;
    error.value = null;

    const response = await financialApi.getDropdownData();
    categories.value = response.data.categories || [];
    accounts.value = response.data.bank_accounts || [];
    orders.value = response.data.orders || [];
  } catch (err) {
    error.value =
      "Failed to load dropdown data: " +
      (err.response?.data?.message || err.message);
    console.error("API Error:", err);
  } finally {
    loading.value = false;
  }
}

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

// Load summary data
async function loadSummary() {
  try {
    const params = {};
    if (filters.value.date) {
      params.start_date = filters.value.date;
      params.end_date = filters.value.date;
    }

    const response = await financialApi.getSummary(params);
    summaryData.value = response.data;
  } catch (err) {
    console.error("Failed to load summary:", err);
  }
}

// Page change handler
async function handlePageChange(page) {
  filters.value.page = page;
  await loadTransactions();
}

// Add new transaction
async function addTransaction() {
  try {
    formLoading.value = true;
    formError.value = null;

    // Format the transaction data as expected by the API
    const transactionData = {
      ...newTransaction.value,
      amount: parseFloat(newTransaction.value.amount),
    };

    // If related_order_id is empty, set it to null
    if (!transactionData.related_order_id) {
      transactionData.related_order_id = null;
    }

    const response = await financialApi.createTransaction(transactionData);

    // Reset form
    newTransaction.value = {
      type: "income",
      category_id: "",
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      bank_account_id: "",
      description: "",
      related_order_id: "",
    };

    showTransactionForm.value = false;

    // Reload transactions
    await loadTransactions();
    // Reload summary
    await loadSummary();
  } catch (err) {
    formError.value =
      err.response?.data?.errors || err.response?.data?.message || err.message;
    console.error("API Error:", err);
  } finally {
    formLoading.value = false;
  }
}

// Update transaction
async function updateTransaction(id, data) {
  try {
    await financialApi.updateTransaction(id, data);
    await loadTransactions();
    await loadSummary();
  } catch (err) {
    console.error("Failed to update transaction:", err);
  }
}

// Delete transaction
async function deleteTransaction(id) {
  if (!confirm("Are you sure you want to delete this transaction?")) return;

  try {
    await financialApi.deleteTransaction(id);
    await loadTransactions();
    await loadSummary();
  } catch (err) {
    console.error("Failed to delete transaction:", err);
  }
}

function getAccountName(accountId) {
  const account = accounts.value.find((a) => a.id === accountId);
  return account ? account.account_name : "";
}

function getCategoryName(categoryId) {
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.name : "";
}
</script>

<template>
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

    <!-- Error Alert -->
    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    >
      {{ error }}
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
          v-model="filters.category_id"
          class="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="">Semua</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
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
          v-model="filters.bank_account_id"
          class="w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="">Semua</option>
          <option
            v-for="account in accounts"
            :key="account.id"
            :value="account.id"
          >
            {{ account.account_name }} ({{ account.bank.name }})
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-8 text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"
      ></div>
      <p class="mt-2 text-muted-foreground">Loading transactions...</p>
    </div>

    <!-- Transactions Table -->
    <div v-else class="border rounded-lg overflow-hidden">
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
            v-for="transaction in transactions"
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
            <td class="px-4 py-3">
              {{
                transaction.category?.name ||
                getCategoryName(transaction.category_id)
              }}
            </td>
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
              {{
                transaction.bankAccount?.account_name ||
                getAccountName(transaction.bank_account_id)
              }}
            </td>
            <td class="px-4 py-3 text-muted-foreground">
              {{ transaction.description }}
            </td>
            <td class="px-4 py-3">
              <div class="flex space-x-2">
                <button
                  class="text-primary hover:text-primary/80"
                  @click="deleteTransaction(transaction.id)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="transactions.length === 0">
            <td colspan="7" class="px-4 py-8 text-center text-muted-foreground">
              Tidak ada transaksi yang ditemukan
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination.total > pagination.per_page"
      class="flex justify-center mt-4"
    >
      <div class="flex space-x-1">
        <button
          v-for="page in Math.ceil(pagination.total / pagination.per_page)"
          :key="page"
          @click="handlePageChange(page)"
          :class="[
            'px-3 py-1 rounded',
            pagination.current_page === page
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80',
          ]"
        >
          {{ page }}
        </button>
      </div>
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

        <!-- Form Errors -->
        <div
          v-if="formError"
          class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          <p v-if="typeof formError === 'string'">{{ formError }}</p>
          <ul v-else class="list-disc pl-5">
            <li v-for="(errors, field) in formError" :key="field">
              {{ errors.join(", ") }}
            </li>
          </ul>
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
              v-model="newTransaction.category_id"
              class="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="" disabled>Pilih kategori</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
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
              min="0.01"
              step="0.01"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1"
              >Akun Bank / Kas</label
            >
            <select
              v-model="newTransaction.bank_account_id"
              class="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="" disabled>Pilih akun</option>
              <option
                v-for="account in accounts"
                :key="account.id"
                :value="account.id"
              >
                {{ account.account_name }} ({{ account.bank.name }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Catatan</label>
            <textarea
              v-model="newTransaction.description"
              class="w-full rounded-md border border-input bg-background px-3 py-2"
              rows="2"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1"
              >Pesanan Terkait (Opsional)</label
            >
            <select
              v-model="newTransaction.related_order_id"
              class="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="">Tidak ada</option>
              <option v-for="order in orders" :key="order.id" :value="order.id">
                {{ order.id }} - {{ order.reference || "Order" }}
              </option>
            </select>
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
              :disabled="formLoading"
            >
              <span v-if="formLoading">Menyimpan...</span>
              <span v-else>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
