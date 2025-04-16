<template>
  <div class="min-h-screen bg-background">
    <header class="border-b">
      <div class="container flex h-16 items-center px-4">
        <h1 class="text-xl font-semibold">Dashboard Bisnis</h1>
        <div class="ml-auto flex items-center gap-4">
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            <BellIcon class="h-4 w-4 mr-2" />
            <span>Notifikasi</span>
          </button>
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0"
          >
            <UserIcon class="h-4 w-4" />
            <span class="sr-only">User</span>
          </button>
        </div>
      </div>
    </header>
    <main class="container px-4 py-6 md:py-8 lg:py-10">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <!-- Pendapatan bulan ini -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="p-6 flex flex-col space-y-2">
            <div class="flex items-center space-x-2">
              <TrendingUpIcon class="h-4 w-4 text-emerald-500" />
              <h3 class="text-sm font-medium">Pendapatan Bulan Ini</h3>
            </div>
            <div class="text-2xl font-bold">Rp 12.500.000</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-emerald-500">↑ 12%</span> dibanding bulan lalu
            </p>
          </div>
        </div>

        <!-- Pengeluaran bulan ini -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="p-6 flex flex-col space-y-2">
            <div class="flex items-center space-x-2">
              <TrendingDownIcon class="h-4 w-4 text-rose-500" />
              <h3 class="text-sm font-medium">Pengeluaran Bulan Ini</h3>
            </div>
            <div class="text-2xl font-bold">Rp 7.800.000</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-rose-500">↑ 5%</span> dibanding bulan lalu
            </p>
          </div>
        </div>

        <!-- Profit/Laba bersih -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="p-6 flex flex-col space-y-2">
            <div class="flex items-center space-x-2">
              <DollarSignIcon class="h-4 w-4 text-primary" />
              <h3 class="text-sm font-medium">Profit/Laba Bersih</h3>
            </div>
            <div class="text-2xl font-bold">Rp 4.700.000</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-emerald-500">↑ 18%</span> dibanding bulan lalu
            </p>
          </div>
        </div>

        <!-- Stok bahan baku/lilin jadi -->
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="p-6 flex flex-col space-y-2">
            <div class="flex items-center space-x-2">
              <PackageIcon class="h-4 w-4 text-amber-500" />
              <h3 class="text-sm font-medium">Stok Bahan Baku/Lilin Jadi</h3>
            </div>
            <div class="text-2xl font-bold">245 unit</div>
            <p class="text-xs text-muted-foreground">
              <span class="text-amber-500">↓ 8%</span> dibanding bulan lalu
            </p>
          </div>
        </div>
      </div>

      <!-- Alert stok menipis -->
      <div class="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <AlertTriangleIcon class="h-5 w-5 text-amber-500" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-amber-800">
              Alert Stok Menipis
            </h3>
            <div class="mt-2 text-sm text-amber-700">
              <ul class="list-disc space-y-1 pl-5">
                <li>Lilin Aromaterapi Lavender (5 unit tersisa)</li>
                <li>Minyak Esensial Vanilla (2 unit tersisa)</li>
                <li>Pewarna Lilin Merah (3 unit tersisa)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="p-6">
            <h3 class="text-lg font-medium mb-4">Pendapatan vs Pengeluaran</h3>
            <div class="h-80 overflow-hidden">
              <BarChart :chart-data="revenueData" :options="chartOptions" />
            </div>
          </div>
        </div>
        <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div class="p-6">
            <h3 class="text-lg font-medium mb-4">Stok Produk</h3>
            <div class="h-80">
              <DoughnutChart
                :chartData="stockData"
                :options="doughnutOptions"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Buttons -->
      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <button
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <PlusCircleIcon class="h-4 w-4 mr-2" />
          <span>Tambah Transaksi Keuangan</span>
        </button>
        <button
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2"
        >
          <FileTextIcon class="h-4 w-4 mr-2" />
          <span>Lihat Laporan Lengkap</span>
        </button>
        <button
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2"
        >
          <PackagePlusIcon class="h-4 w-4 mr-2" />
          <span>Tambah Stok Baru</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  BellIcon,
  UserIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  DollarSignIcon,
  PackageIcon,
  AlertTriangleIcon,
  PlusCircleIcon,
  FileTextIcon,
  PackagePlusIcon,
} from "lucide-vue-next";
import { BarChart, DoughnutChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

// Revenue vs Expenses Data
const revenueData = ref({
  labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
  datasets: [
    {
      label: "Pendapatan",
      data: [8500000, 9200000, 10500000, 11000000, 11800000, 12500000],
      backgroundColor: "rgba(34, 197, 94, 0.5)",
      borderColor: "rgb(34, 197, 94)",
      borderWidth: 1,
    },
    {
      label: "Pengeluaran",
      data: [5200000, 5800000, 6300000, 7000000, 7500000, 7800000],
      backgroundColor: "rgba(239, 68, 68, 0.5)",
      borderColor: "rgb(239, 68, 68)",
      borderWidth: 1,
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return "Rp " + (value / 1000000).toFixed(1) + " jt";
        },
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(context.parsed.y);
          }
          return label;
        },
      },
    },
  },
});

// Stock Data
const stockData = ref({
  labels: [
    "Lilin Aromaterapi",
    "Lilin Dekoratif",
    "Lilin Tealight",
    "Bahan Baku",
  ],
  datasets: [
    {
      label: "Stok Produk",
      data: [65, 80, 50, 50], // Ensure this matches the expected format
      backgroundColor: [
        "rgba(34, 197, 94, 0.7)",
        "rgba(59, 130, 246, 0.7)",
        "rgba(245, 158, 11, 0.7)",
        "rgba(99, 102, 241, 0.7)",
      ],
      borderColor: [
        "rgb(34, 197, 94)",
        "rgb(59, 130, 246)",
        "rgb(245, 158, 11)",
        "rgb(99, 102, 241)",
      ],
      borderWidth: 1,
    },
  ],
});

const doughnutOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
    },
  },
});

onMounted(() => {
  // Any initialization code can go here
});
</script>

<style></style>
