<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use \DB;
use Carbon\Carbon;

class StockMovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $movements = [
            [
                'product_id' => 1,
                'type' => 'in',
                'qty' => 50,
                'reason' => 'Initial stock',
                'date' => Carbon::now()->subDays(30),
            ],
            [
                'product_id' => 2,
                'type' => 'in',
                'qty' => 100,
                'reason' => 'Initial stock',
                'date' => Carbon::now()->subDays(30),
            ],
            [
                'product_id' => 3,
                'type' => 'in',
                'qty' => 75,
                'reason' => 'Initial stock',
                'date' => Carbon::now()->subDays(30),
            ],
            [
                'product_id' => 4,
                'type' => 'in',
                'qty' => 60,
                'reason' => 'Initial stock',
                'date' => Carbon::now()->subDays(30),
            ],
            [
                'product_id' => 5,
                'type' => 'in',
                'qty' => 200,
                'reason' => 'Initial stock',
                'date' => Carbon::now()->subDays(30),
            ],
            [
                'product_id' => 1,
                'type' => 'out',
                'qty' => 5,
                'reason' => 'Sale #123',
                'date' => Carbon::now()->subDays(20),
            ],
            [
                'product_id' => 2,
                'type' => 'out',
                'qty' => 10,
                'reason' => 'Sale #124',
                'date' => Carbon::now()->subDays(15),
            ],
            [
                'product_id' => 3,
                'type' => 'adjustment',
                'qty' => -2,
                'reason' => 'Damaged inventory',
                'date' => Carbon::now()->subDays(10),
            ],
            [
                'product_id' => 4,
                'type' => 'in',
                'qty' => 20,
                'reason' => 'Restock',
                'date' => Carbon::now()->subDays(5),
            ],
            [
                'product_id' => 5,
                'type' => 'out',
                'qty' => 25,
                'reason' => 'Sale #125',
                'date' => Carbon::now()->subDays(3),
            ],
        ];

        foreach ($movements as $movement) {
            DB::table('stock_movements')->insert([
                'product_id' => $movement['product_id'],
                'type' => $movement['type'],
                'qty' => $movement['qty'],
                'reason' => $movement['reason'],
                'date' => $movement['date'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
