<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $csv = database_path('seeders/data/provinces.csv'); // path to your CSV file
        $rows = array_map(function ($row) {
            return str_getcsv($row, ';');
        }, file($csv));

        array_shift($rows);
        foreach ($rows as $row) {
            DB::table('provinces')->insert([
                'id' => (int) $row[0],
                'name' => $row[1],
                // add more columns as needed
            ]);
        }
    }
}
