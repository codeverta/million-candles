<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $csv = database_path('seeders/data/regencies.csv'); // path to your CSV file
        $rows = array_map(function ($row) {
            return str_getcsv($row, ';');
        }, file($csv));

        array_shift($rows);
        foreach ($rows as $row) {
            DB::table('regencies')->insert([
                'id' => (int) $row[0],
                'provinces_id' => (int) $row[1],
                'name' => $row[2],
                // add more columns as needed
            ]);
        }
    }
}
