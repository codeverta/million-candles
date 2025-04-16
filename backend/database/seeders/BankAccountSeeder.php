<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use \DB;
use Carbon\Carbon;

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
                'account_name' => 'SRI WIDYAWATI',
                'account_number' => 'BOFA-1234567890',
                'starting_balance' => 10000.00,
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
