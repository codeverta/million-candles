<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VillageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ini_set('memory_limit', '512M');
        $csv = database_path('seeders/data/villages.csv'); // path to your CSV file
        $rows = array_map(function ($row) {
            return str_getcsv($row, ';');
        }, file($csv));

        array_shift($rows);
        foreach ($rows as $row) {
            DB::table('villages')->insert([
                'id' => (int) $row[0],
                'districts_id' => (int) $row[1],
                'name' => $row[2],
                // add more columns as needed
            ]);
        }
    }
}
