# 🕯️ www.souvenirlilin.id Platform

**Souvenirlilin.id** adalah platform e-commerce terintegrasi untuk jual beli produk lilin dan souvenir. Proyek ini tidak hanya menangani transaksi penjualan, tetapi juga mencakup manajemen stok bahan baku (raw materials), pencatatan keuangan, dan dukungan multibahasa (16 bahasa).

Dikembangkan oleh **[codeverta.com](https://bikinwebsitejogja.com)**.

## 🛠️ Tech Stack

### Frontend

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI Library:** [shadcn/ui](https://ui.shadcn.com/)
- **Styling:** Tailwind CSS
- **Internationalization:** i18n support

### Backend

- **Framework:** [Laravel](https://laravel.com/)
- **Database:** MySQL / MariaDB
- **ORM:** Eloquent
- **Monitoring:** Laravel Telescope
- **Authentication:** Laravel Sanctum / Spatie Permission

---

## ✨ Key Features

Berdasarkan struktur database dan kontroler yang tersedia, berikut adalah fitur utama sistem ini:

### 1. 🛒 E-Commerce & Order Management

- **Product Management:** Dukungan varian produk yang kompleks (`product_variants`, `variant_combinations`, `product_translations`).
- **Shopping Cart & Checkout:** Alur pembelian terintegrasi.
- **Payment Gateway:** Integrasi pembayaran otomatis (`payment_details`).
- **Review System:** Ulasan produk oleh user (`product_reviews`).

### 2. 📦 Inventory & Manufacturing Logic

Berbeda dengan e-commerce biasa, sistem ini melacak pergerakan bahan baku:

- **Material Tracking:** Manajemen stok bahan baku lilin (`materials`, `material_stock_movements`).
- **Product Stock:** Manajemen stok produk jadi (`stocks`, `stock_movements`).

### 3. 💰 Financial & Accounting

- **Financial Recording:** Pencatatan transaksi keuangan masuk/keluar (`financial_transactions`, `financial_categories`).
- **Bank Accounts:** Manajemen akun bank untuk mutasi (`bank_accounts`).

### 4. 🌍 Localization (i18n)

Sistem mendukung blog dan konten produk dalam **16 Bahasa**:
`ar` (Arabic), `bn` (Bengali), `de` (German), `en` (English), `es` (Spanish), `fr` (French), `hi` (Hindi), `id` (Indonesian), `ja` (Japanese), `kr` (Korean), `ms` (Malay), `ru` (Russian), `pt` (Portuguese), `th` (Thai), `vi` (Vietnamese), `zh` (Chinese).

### 5. 📍 Regional Data (Indonesia)

Integrasi penuh data wilayah administratif Indonesia untuk pengiriman:

- Provinces, Regencies, Districts, Villages.

---

## 📂 Database Schema Overview

Sistem menggunakan relasi database yang kuat untuk menangani integritas data. Berikut adalah grup tabel utama:

| Category        | Tables Involved                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| **Auth & RBAC** | `users`, `roles`, `permissions`, `model_has_roles`, `personal_access_tokens`                            |
| **Products**    | `products`, `product_categories`, `product_variants`, `product_variant_options`, `variant_combinations` |
| **Orders**      | `orders`, `order_details`, `carts`, `payment_details`                                                   |
| **Inventory**   | `materials`, `stocks`, `stock_movements`, `material_stock_movements`                                    |
| **Finance**     | `financial_transactions`, `financial_categories`, `banks`, `bank_accounts`, `currencies`                |
| **System**      | `migrations`, `telescope_entries`, `notifications`, `failed_jobs`                                       |

---

## 🔌 API Endpoints (Core Controllers)

Backend menyediakan RESTful API yang dikonsumsi oleh Next.js Frontend. Controller utama meliputi:

- **Auth:** `AuthController` (Login/Register/Reset Password)
- **Products:** `ProductVariantController`, `ProductVariantOptionController`, `VariantCombinationController`
- **Transactions:** `FinancialTransactionController`, `FinancialCategoryController`
- **Inventory:** `MaterialController`, `MaterialStockMovementController`, `StockMovementController`
- **User Interaction:** `ProductReviewController`, `EmailController`

---

## 🚀 Getting Started

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js & npm/pnpm
- MySQL

### Backend Setup (Laravel)

```bash
# 1. Clone repository
git clone https://github.com/codeverta/million-candles.git

# 2. Install dependencies
composer install

# 3. Setup Environment
cp .env.example .env
# (Konfigurasi DB_DATABASE, DB_USERNAME, dll di .env)

# 4. Generate Key & Migrate
php artisan key:generate
php artisan migrate --seed

# 5. Run Server
php artisan serve

```

### Frontend Setup (Next.js)

```bash
# 1. Install dependencies
pnpm install

# 2. Setup Environment
cp .env.example .env.local
# (Pastikan NEXT_PUBLIC_API_URL mengarah ke Laravel backend)

# 3. Run Development Server
pnpm run dev

```

---

## 📝 Credits

Developed and Maintained by **[codeverta.com](https://bikinwebsitejogja.com)**.

> _Professional Web Development Services in Yogyakarta._

---

**Apakah Anda ingin saya buatkan juga file `.env.example` atau dokumentasi khusus untuk struktur `variant_combinations` (karena sepertinya logikanya cukup kompleks)?**
