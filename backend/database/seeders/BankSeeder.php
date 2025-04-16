<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $banks = [
            ['id' => 1, 'name' => 'Bank of America'],
            ['id' => 2, 'name' => 'Chase Bank'],
            ['id' => 3, 'name' => 'Wells Fargo'],
            ['id' => 4, 'name' => 'Citibank'],
        ];

        foreach ($banks as $bank) {
            DB::table('banks')->insert([
                'id' => $bank['id'],
                'name' => $bank['name'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
