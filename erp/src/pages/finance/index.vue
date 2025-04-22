<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Manajemen Keuangan</h1>

    <!-- Tab Navigation -->
    <div class="border-b mb-6">
      <div class="flex space-x-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="setTab(tab.id)"
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
    <TransactionsTab
      v-if="activeTab == 'transactions'"
      :active-tab="activeTab"
    />

    <!-- Laporan Laba Rugi -->
    <Profitloss v-if="activeTab == 'profitLoss'" />

    <!-- Akun Bank / Kas -->
    <AccountsTab v-if="activeTab == 'accounts'" :active-tab="activeTab" />
  </div>
</template>

<script setup>
import TransactionsTab from "./transactions.vue";
import Profitloss from "./profitloss.vue";
import AccountsTab from "./accounts.vue";
import { ref, computed, onMounted } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";

const route = useRoute();
// Tabs
const tabs = [
  { id: "transactions", name: "Transaksi Keuangan" },
  { id: "profitLoss", name: "Laporan Laba Rugi" },
  { id: "accounts", name: "Akun Bank / Kas" },
];
const activeTab = computed(() => route.query.tab || "home");

// Years for report
const currentYear = new Date().getFullYear();

function setTab(tabName) {
  router.replace({ query: { ...route.query, tab: tabName } });
}

// Report filters
const reportFilters = ref({
  month: new Date().getMonth() + 1,
  year: currentYear,
});
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
