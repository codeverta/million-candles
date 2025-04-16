<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use \DB;
use Carbon\Carbon;

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
            ['id' => 1, 'name' => 'Bank Mandiri'],
            ['id' => 2, 'name' => 'Bank BCA'],
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
