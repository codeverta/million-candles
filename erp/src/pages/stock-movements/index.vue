<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Manajemen Inventori</h1>

    <!-- Tabs -->
    <div class="border-b mb-6">
      <div class="flex space-x-4">
        <button
          @click="activeTab = 'products'"
          class="py-2 px-4 font-medium transition-colors relative"
          :class="
            activeTab === 'products'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          "
        >
          Produk & Stok
          <div
            v-if="activeTab === 'products'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          ></div>
        </button>
        <button
          @click="activeTab = 'movements'"
          class="py-2 px-4 font-medium transition-colors relative"
          :class="
            activeTab === 'movements'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          "
        >
          Pergerakan Stok
          <div
            v-if="activeTab === 'movements'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          ></div>
        </button>
        <button
          @click="activeTab = 'reports'"
          class="py-2 px-4 font-medium transition-colors relative"
          :class="
            activeTab === 'reports'
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          "
        >
          Laporan Stok
          <div
            v-if="activeTab === 'reports'"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          ></div>
        </button>
      </div>
    </div>

    <!-- Products & Stock Tab -->
    <div v-if="activeTab === 'products'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Produk & Stok</h2>
        <button
          class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Tambah Produk
        </button>
      </div>

      <!-- Products Table -->
      <div class="border rounded-lg overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="bg-muted/50">
              <th class="text-left p-3 font-medium">Produk</th>
              <th class="text-left p-3 font-medium">Varian</th>
              <th class="text-left p-3 font-medium">Stok</th>
              <th class="text-left p-3 font-medium">Status</th>
              <th class="text-left p-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <!-- Lilin Souvernir A -->
            <tr class="border-t">
              <td class="p-3" rowspan="3">Lilin Souvernir A</td>
              <td class="p-3">Merah / Kecil / Vanilla</td>
              <td class="p-3">25</td>
              <td class="p-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  Tersedia
                </span>
              </td>
              <td class="p-3">
                <button class="text-muted-foreground hover:text-foreground">
                  <PencilIcon class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr class="border-t">
              <td class="p-3">Biru / Sedang / Lavender</td>
              <td class="p-3">8</td>
              <td class="p-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                >
                  Stok Menipis
                </span>
              </td>
              <td class="p-3">
                <button class="text-muted-foreground hover:text-foreground">
                  <PencilIcon class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr class="border-t">
              <td class="p-3">Putih / Besar / Jasmine</td>
              <td class="p-3">15</td>
              <td class="p-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  Tersedia
                </span>
              </td>
              <td class="p-3">
                <button class="text-muted-foreground hover:text-foreground">
                  <PencilIcon class="w-4 h-4" />
                </button>
              </td>
            </tr>

            <!-- Lilin Aroma B -->
            <tr class="border-t">
              <td class="p-3" rowspan="2">Lilin Aroma B</td>
              <td class="p-3">Hijau / Kecil / Mint</td>
              <td class="p-3">5</td>
              <td class="p-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  Kritis
                </span>
              </td>
              <td class="p-3">
                <button class="text-muted-foreground hover:text-foreground">
                  <PencilIcon class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr class="border-t">
              <td class="p-3">Kuning / Besar / Lemon</td>
              <td class="p-3">18</td>
              <td class="p-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  Tersedia
                </span>
              </td>
              <td class="p-3">
                <button class="text-muted-foreground hover:text-foreground">
                  <PencilIcon class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stock Movements Tab -->
    <div v-if="activeTab === 'movements'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Pergerakan Stok</h2>
        <button
          class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon class="w-4 h-4 mr-2" />
          Tambah Pergerakan Stok
        </button>
      </div>

      <!-- Movements Table -->
      <div class="border rounded-lg overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="bg-muted/50">
              <th class="text-left p-3 font-medium">Tanggal</th>
              <th class="text-left p-3 font-medium">Produk</th>
              <th class="text-left p-3 font-medium">Varian</th>
              <th class="text-left p-3 font-medium">Tipe</th>
              <th class="text-left p-3 font-medium">Jumlah</th>
              <th class="text-left p-3 font-medium">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t">
              <td class="p-3">15/04/2025</td>
              <td class="p-3">Lilin Souvernir A</td>
              <td class="p-3">Merah / Kecil / Vanilla</td>
              <td class="p-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  Masuk
                </span>
              </td>
              <td class="p-3">+30</td>
              <td class="p-3">Pengadaan baru</td>
            </tr>
            <tr class="border-t">
              <td class="p-3">14/04/2025</td>
              <td class="p-3">Lilin Souvernir A</td>
              <td class="p-3">Merah / Kecil / Vanilla</td>
              <td class="p-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  Keluar
                </span>
              </td>
              <td class="p-3">-5</td>
              <td class="p-3">Penjualan #INV-2025041</td>
            </tr>
            <tr class="border-t">
              <td class="p-3">13/04/2025</td>
              <td class="p-3">Lilin Aroma B</td>
              <td class="p-3">Hijau / Kecil / Mint</td>
              <td class="p-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                >
                  Rusak
                </span>
              </td>
              <td class="p-3">-2</td>
              <td class="p-3">Pecah saat pengiriman</td>
            </tr>
            <tr class="border-t">
              <td class="p-3">12/04/2025</td>
              <td class="p-3">Lilin Aroma B</td>
              <td class="p-3">Kuning / Besar / Lemon</td>
              <td class="p-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  Retur
                </span>
              </td>
              <td class="p-3">+3</td>
              <td class="p-3">Retur dari pelanggan</td>
            </tr>
            <tr class="border-t">
              <td class="p-3">10/04/2025</td>
              <td class="p-3">Lilin Souvernir A</td>
              <td class="p-3">Biru / Sedang / Lavender</td>
              <td class="p-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  Masuk
                </span>
              </td>
              <td class="p-3">+15</td>
              <td class="p-3">Pengadaan baru</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Movement Dialog (Hidden by default) -->
      <div
        class="hidden fixed inset-0 bg-black/50 flex items-center justify-center"
      >
        <div class="bg-background rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold mb-4">Tambah Pergerakan Stok</h3>
          <form class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Produk</label>
              <select class="w-full border rounded-md p-2">
                <option>Lilin Souvernir A</option>
                <option>Lilin Aroma B</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Varian</label>
              <select class="w-full border rounded-md p-2">
                <option>Merah / Kecil / Vanilla</option>
                <option>Biru / Sedang / Lavender</option>
                <option>Putih / Besar / Jasmine</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1"
                >Tipe Pergerakan</label
              >
              <select class="w-full border rounded-md p-2">
                <option>Masuk</option>
                <option>Keluar</option>
                <option>Retur</option>
                <option>Rusak</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Jumlah</label>
              <input type="number" class="w-full border rounded-md p-2" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Keterangan</label>
              <textarea
                class="w-full border rounded-md p-2"
                rows="3"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-2">
              <button
                type="button"
                class="border bg-muted/50 hover:bg-muted px-4 py-2 rounded-md"
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

    <!-- Stock Reports Tab -->
    <div v-if="activeTab === 'reports'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Laporan Stok</h2>
        <div class="flex space-x-2">
          <select class="border rounded-md p-2">
            <option>April 2025</option>
            <option>Maret 2025</option>
            <option>Februari 2025</option>
          </select>
          <button
            class="bg-muted hover:bg-muted/80 px-4 py-2 rounded-md flex items-center"
          >
            <DownloadIcon class="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <!-- Monthly Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="border rounded-lg p-4 bg-muted/20">
          <h3 class="text-sm font-medium text-muted-foreground mb-2">
            Total Barang Masuk
          </h3>
          <p class="text-2xl font-bold">45 unit</p>
          <p class="text-sm text-muted-foreground">April 2025</p>
        </div>
        <div class="border rounded-lg p-4 bg-muted/20">
          <h3 class="text-sm font-medium text-muted-foreground mb-2">
            Total Barang Keluar
          </h3>
          <p class="text-2xl font-bold">28 unit</p>
          <p class="text-sm text-muted-foreground">April 2025</p>
        </div>
        <div class="border rounded-lg p-4 bg-muted/20">
          <h3 class="text-sm font-medium text-muted-foreground mb-2">
            Nilai Stok Akhir
          </h3>
          <p class="text-2xl font-bold">Rp 3.450.000</p>
          <p class="text-sm text-muted-foreground">Metode FIFO</p>
        </div>
      </div>

      <!-- Stock Value Chart (Placeholder) -->
      <div class="border rounded-lg p-4">
        <h3 class="text-sm font-medium mb-4">Pergerakan Stok Bulanan</h3>
        <div
          class="h-64 bg-muted/20 rounded-md flex items-center justify-center"
        >
          <p class="text-muted-foreground">Grafik Pergerakan Stok</p>
        </div>
      </div>

      <!-- Stock Value Table -->
      <div class="border rounded-lg overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="bg-muted/50">
              <th class="text-left p-3 font-medium">Produk</th>
              <th class="text-left p-3 font-medium">Stok Awal</th>
              <th class="text-left p-3 font-medium">Masuk</th>
              <th class="text-left p-3 font-medium">Keluar</th>
              <th class="text-left p-3 font-medium">Retur</th>
              <th class="text-left p-3 font-medium">Rusak</th>
              <th class="text-left p-3 font-medium">Stok Akhir</th>
              <th class="text-left p-3 font-medium">Nilai (Rp)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t">
              <td class="p-3">Lilin Souvernir A</td>
              <td class="p-3">35</td>
              <td class="p-3 text-green-600">+30</td>
              <td class="p-3 text-red-600">-15</td>
              <td class="p-3 text-blue-600">+2</td>
              <td class="p-3 text-amber-600">-4</td>
              <td class="p-3 font-medium">48</td>
              <td class="p-3">2.400.000</td>
            </tr>
            <tr class="border-t">
              <td class="p-3">Lilin Aroma B</td>
              <td class="p-3">18</td>
              <td class="p-3 text-green-600">+15</td>
              <td class="p-3 text-red-600">-13</td>
              <td class="p-3 text-blue-600">+5</td>
              <td class="p-3 text-amber-600">-2</td>
              <td class="p-3 font-medium">23</td>
              <td class="p-3">1.050.000</td>
            </tr>
            <tr class="border-t bg-muted/20">
              <td class="p-3 font-medium">Total</td>
              <td class="p-3">53</td>
              <td class="p-3 text-green-600">+45</td>
              <td class="p-3 text-red-600">-28</td>
              <td class="p-3 text-blue-600">+7</td>
              <td class="p-3 text-amber-600">-6</td>
              <td class="p-3 font-medium">71</td>
              <td class="p-3 font-medium">3.450.000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { PlusIcon, PencilIcon, DownloadIcon } from "lucide-vue-next";

const activeTab = ref("products");
</script>
