<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use \DB;
use Carbon\Carbon;

class FinancialCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            'Sewa',
            'Utilitas',
            'Gaji',
            'Penjualan',
            'Transportasi',
            'Inventaris',
            'Pemasaran',
            'Perlengkapan Kantor',
            'Asuransi',
            'Pajak',
            'Pemeliharaan',
            'Pendapatan Lain-lain',
            'Pengeluaran Lain-lain',
            'Bahan Baku',
            'Biaya Produksi',
        ];

        foreach ($categories as $category) {
            DB::table('financial_categories')->insert([
                'name' => $category,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
