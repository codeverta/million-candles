<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Spatie\Permission\Models\Permission;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        // create permissions
        Permission::create(['name' => 'products:*']);
        Permission::create(['name' => 'products:create']);
        Permission::create(['name' => 'products:read']);
        Permission::create(['name' => 'products:update']);
        Permission::create(['name' => 'products:delete']);

        Permission::create(['name' => 'orders:*']);
        Permission::create(['name' => 'orders:create']);
        Permission::create(['name' => 'orders:read']);
        Permission::create(['name' => 'orders:update']);
        Permission::create(['name' => 'orders:delete']);

        Permission::create(['name' => 'users:*']);
        Permission::create(['name' => 'users:create']);
        Permission::create(['name' => 'users:read']);
        Permission::create(['name' => 'users:update']);
        Permission::create(['name' => 'users:delete']);

        // create roles and assign existing permissions
        $userMerchant = Role::create(['name' => 'merchant']);
        $userMerchant->givePermissionTo(Permission::all());

        $userBiasa = Role::create(['name' => 'buyer']);
        $userBiasa->givePermissionTo('products:read');


        $merchant = User::factory()->create([
            'name' => 'Uzumaki Naruto',
            'email' => 'naruto@gmail.com',
            'password' => Hash::make('naruto123')
        ]);

        $buyer = User::factory()->create([
            'name' => 'Zenitsu',
            'email' => 'zenitsu@gmail.com',
            'password' => Hash::make('zenitsu123')
        ]);

        $merchant->assignRole($userMerchant);
        $merchant->givePermissionTo(Permission::all());
        $buyer->assignRole($userBiasa);
        $buyer->givePermissionTo(['orders:create', 'orders:read', 'products:read']);
        $buyer = User::factory(20)->create();
        foreach ($buyer as $user) {
            $user->assignRole($userBiasa);
            $user->givePermissionTo(['orders:create', 'orders:read', 'products:read']);
        }
    }
}
