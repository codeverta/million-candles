<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BankAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $bankAccounts = [
            [
                'bank_id' => 1,
                'account_name' => 'Business Checking',
                'account_number' => 'BOFA-1234567890',
                'starting_balance' => 10000.00,
            ],
            [
                'bank_id' => 1,
                'account_name' => 'Business Savings',
                'account_number' => 'BOFA-0987654321',
                'starting_balance' => 25000.00,
            ],
            [
                'bank_id' => 2,
                'account_name' => 'Operations Account',
                'account_number' => 'CHASE-2468101214',
                'starting_balance' => 15000.00,
            ],
            [
                'bank_id' => 3,
                'account_name' => 'Petty Cash Account',
                'account_number' => 'WF-13579113151',
                'starting_balance' => 2000.00,
            ],
        ];

        foreach ($bankAccounts as $account) {
            DB::table('bank_accounts')->insert([
                'bank_id' => $account['bank_id'],
                'account_name' => $account['account_name'],
                'account_number' => $account['account_number'],
                'starting_balance' => $account['starting_balance'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
