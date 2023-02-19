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

        // create roles and assign existing permissions
        $role1 = Role::create(['name' => 'merchant']);
        $role1->givePermissionTo('products:*');

        $role2 = Role::create(['name' => 'buyer']);
        $role2->givePermissionTo('products:read');


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

        $merchant->assignRole($role1);
        $buyer->assignRole($role2);
    }
}
