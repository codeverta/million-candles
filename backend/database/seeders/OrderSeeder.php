<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user1 = User::find(1);
        $user2 = User::find(2);

        Order::factory()->create([
            'airwaybill' => 'INV-001',
            'origin_user_id' => $user1->id,
            'destination_user_id' => $user2->id
        ]);
    }
}
