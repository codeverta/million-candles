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

function getAccountBalance(accountId) {
  const account = accounts.value.find((a) => a.id === accountId);
  if (!account) return 0;

  return (
    account.initialBalance +
    getAccountIncome(accountId) -
    getAccountExpense(accountId)
  );
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

// New account form
const showAccountForm = ref(false);
const newAccount = ref({
  name: "",
  initialBalance: 0,
  description: "",
});

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
</template>

<style scoped>
/* Your component styles here */
</style>
