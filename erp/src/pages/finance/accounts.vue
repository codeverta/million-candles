<script setup>
import { ref, computed, onMounted } from "vue";
import { formatCurrency } from "@/lib/utils";
import financialApi from "@/services/financial-api";

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
  // Load bank accounts
  await loadBankAccounts();
});

// Load bank accounts from API
async function loadBankAccounts() {
  try {
    loading.value = true;
    error.value = null;

    const response = await financialApi.getBankAccounts();
    accounts.value = response.data.data || [];

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
      "Failed to load bank accounts: " +
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

// New account form
const showAccountForm = ref(false);
const newAccount = ref({
  name: "",
  starting_balance: 0,
  description: "",
  account_number: "",
  bank_id: null,
});

// Add new bank account
async function addAccount() {
  try {
    loading.value = true;
    error.value = null;

    // Create the account via API
    const response = await financialApi.createBankAccount({
      ...newAccount.value,
      starting_balance: parseFloat(newAccount.value.starting_balance),
    });

    // Add the new account to the list
    accounts.value.push(response.data.data);

    // Reset form
    newAccount.value = {
      name: "",
      starting_balance: 0,
      description: "",
      account_number: "",
      bank_id: null,
    };

    showAccountForm.value = false;
  } catch (err) {
    error.value =
      "Failed to create bank account: " +
      (err.response?.data?.message || err.message);

    // Show validation errors if any
    if (err.response?.data?.errors) {
      // You can handle validation errors here
      console.error("Validation errors:", err.response.data.errors);
    }
  } finally {
    loading.value = false;
  }
}

// Delete a bank account
async function deleteAccount(accountId) {
  if (!confirm("Are you sure you want to delete this account?")) {
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    await financialApi.deleteBankAccount(accountId);

    // Remove the account from the list
    accounts.value = accounts.value.filter(
      (account) => account.id !== accountId
    );
  } catch (err) {
    error.value =
      "Failed to delete bank account: " +
      (err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
}

// Get account transactions
async function viewAccountTransactions(accountId) {
  filters.value.bank_account_id = accountId;
  await loadTransactions();
}

// Computed properties for account balances
function getAccountIncome(accountId) {
  return transactions.value
    .filter((t) => t.bank_account_id === accountId && t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
}

function getAccountExpense(accountId) {
  return transactions.value
    .filter((t) => t.bank_account_id === accountId && t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
}

function getAccountBalance(accountId) {
  const account = accounts.value.find((a) => a.id === accountId);
  if (!account) return 0;

  return (
    parseFloat(account.starting_balance) +
    getAccountIncome(accountId) -
    getAccountExpense(accountId)
  );
}
</script>
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Akun Bank / Kas</h2>
      <button
        @click="showAccountForm = true"
        class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
      >
        + Tambah Akun
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="bg-red-100 text-red-700 p-4 rounded-md">
      {{ error }}
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="flex justify-center p-4">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
      ></div>
    </div>

    <!-- Accounts Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="account in accounts"
        :key="account.id"
        class="border rounded-lg overflow-hidden"
      >
        <div class="p-4 border-b bg-muted/30">
          <h3 class="font-medium">
            {{ account.account_name }} ({{ account.bank.name }})
          </h3>
          <p
            v-if="account.account_number"
            class="text-sm text-muted-foreground"
          >
            {{ account.account_number }}
          </p>
        </div>
        <div class="p-4 space-y-2">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Saldo Awal:</span>
            <span>{{ formatCurrency(account.starting_balance) }}</span>
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
        <div class="p-4 border-t bg-muted/20 flex justify-between">
          <button
            @click="viewAccountTransactions(account.id)"
            class="text-primary hover:text-primary/80 text-sm"
          >
            Lihat Histori Transaksi
          </button>
          <button
            @click="deleteAccount(account.id)"
            class="text-red-600 hover:text-red-800 text-sm"
          >
            Hapus
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
            <label class="block text-sm font-medium mb-1">Nomor Rekening</label>
            <input
              type="text"
              v-model="newAccount.account_number"
              class="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Optional"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Saldo Awal</label>
            <input
              type="number"
              v-model="newAccount.starting_balance"
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
              placeholder="Optional"
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
              :disabled="loading"
            >
              <span v-if="loading">Menyimpan...</span>
              <span v-else>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional component styles here */
</style>
