<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FinancialCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            'Rent',
            'Utilities',
            'Salary',
            'Sales',
            'Transportation',
            'Inventory',
            'Marketing',
            'Office Supplies',
            'Insurance',
            'Taxes',
            'Maintenance',
            'Miscellaneous Income',
            'Miscellaneous Expense',
        ];

        foreach ($categories as $category) {
            DB::table('financial_categories')->insert([
                'name' => $category,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
