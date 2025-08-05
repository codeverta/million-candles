<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use \DB;
use Carbon\Carbon;

class FinancialTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Get all category IDs
        $categories = DB::table('financial_categories')->pluck('id', 'name')->toArray();
        
        // Get all bank account IDs
        $bankAccounts = DB::table('bank_accounts')->pluck('id')->toArray();

        $transactions = [
            [
            'type' => 'expense',
            'category_id' => $categories['Sewa'] ?? null,
            'amount' => 2500.00,
            'bank_account_id' => 2,
            'date' => Carbon::now()->subDays(28),
            'description' => 'Monthly office rent',
            'related_order_id' => null,
            ],
            [
            'type' => 'expense',
            'category_id' => $categories['Utilitas'] ?? null,
            'amount' => 350.00,
            'bank_account_id' => 2,
            'date' => Carbon::now()->subDays(25),
            'description' => 'Electricity bill',
            'related_order_id' => null,
            ],
            [
            'type' => 'income',
            'category_id' => $categories['Penjualan'] ?? null,
            'amount' => 4500.00,
            'bank_account_id' => 2,
            'date' => Carbon::now()->subDays(20),
            'description' => 'Product sales',
            'related_order_id' => null,
            ],
            [
            'type' => 'expense',
            'category_id' => $categories['Pemasaran'] ?? null,
            'amount' => 1000.00,
            'bank_account_id' => 2,
            'date' => Carbon::now()->subDays(18),
            'description' => 'Facebook ad campaign',
            'related_order_id' => null,
            ],
            [
            'type' => 'income',
            'category_id' => $categories['Penjualan'] ?? null,
            'amount' => 3200.00,
            'bank_account_id' => 2,
            'date' => Carbon::now()->subDays(15),
            'description' => 'Product sales',
            'related_order_id' => null,
            ],
            [
            'type' => 'expense',
            'category_id' => $categories['Inventaris'] ?? null,
            'amount' => 5000.00,
            'bank_account_id' => 2,
            'date' => Carbon::now()->subDays(12),
            'description' => 'Stock replenishment',
            'related_order_id' => null,
            ],
            [
            'type' => 'expense',
            'category_id' => $categories['Perlengkapan Kantor'] ?? null,
            'amount' => 250.00,
            'bank_account_id' => 2,
            'date' => Carbon::now()->subDays(10),
            'description' => 'Office supplies purchase',
            'related_order_id' => null,
            ],
            [
            'type' => 'income',
            'category_id' => $categories['Penjualan'] ?? null,
            'amount' => 1800.00,
            'bank_account_id' => 2,
            'date' => Carbon::now()->subDays(7),
            'description' => 'Product sales',
            'related_order_id' => null,
            ],
            [
            'type' => 'expense',
            'category_id' => $categories['Asuransi'] ?? null,
            'amount' => 950.00,
            'bank_account_id' => 2,
            'date' => Carbon::now()->subDays(5),
            'description' => 'Business insurance premium',
            'related_order_id' => null,
            ],
            [
            'type' => 'income',
            'category_id' => $categories['Pendapatan Lain-lain'] ?? null,
            'amount' => 300.00,
            'bank_account_id' => 2,
            'date' => Carbon::now()->subDays(3),
            'description' => 'Refund from supplier',
            'related_order_id' => null,
            ],
        ];

        // foreach ($transactions as $transaction) {
        //     DB::table('financial_transactions')->insert([
        //         'type' => $transaction['type'],
        //         'category_id' => $transaction['category_id'],
        //         'amount' => $transaction['amount'],
        //         'bank_account_id' => $transaction['bank_account_id'],
        //         'date' => $transaction['date'],
        //         'description' => $transaction['description'],
        //         'related_order_id' => $transaction['related_order_id'],
        //         'created_at' => Carbon::now(),
        //         'updated_at' => Carbon::now(),
        //     ]);
        // }
    }
}
