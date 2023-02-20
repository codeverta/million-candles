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
        $csv = database_path('seeders/data/villages.csv'); // path to your CSV file
        $rows = array_map(function ($row) {
            return str_getcsv($row, ';');
        }, file($csv));

        array_shift($rows);

        $result = array_map(function ($item) {
            [$id, $districts_id, $name] = $item;
            return ["id" => $id, "districts_id" => $districts_id, "name" => $name];
        }, $rows);
        $chunkSize = 2000;
        $totalChunks = ceil(count($result) / $chunkSize);
        for ($i = 0; $i < $totalChunks; $i++) {
            $chunk = array_slice($result, $i * $chunkSize, $chunkSize, true);
            DB::table('villages')->insert($chunk);
        }
    }
}
