<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductVariant;
use App\Models\ProductVariantOption;
use Illuminate\Support\Facades\DB;

use function PHPSTORM_META\map;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ProductCategory::insert($this->productCategories());

        $csv = database_path('seeders/data/products.csv'); // path to your CSV file
        $rows = array_map(function ($row) {
            return str_getcsv($row, ';');
        }, file($csv));

        array_shift($rows);
        foreach ($rows as $row) {
            $product = Product::create([
                'code' => $row[0],
                'name' => $row[1],
                'price' => (int) $row[2],
                // 'size' => $row[3],
                // 'quantity' => $row[4],
                'weight' => (int) $row[5],
                'product_categories_id' => random_int(1, 4),
                'description' => ''
            ]);


            ProductVariant::insert($this->productVariants($product->id));
            ProductVariantOption::insert($this->productVariantOptions(random_int(1, 2)));
        };
    }

    public function productVariants($id)
    {
        return [
            [
                'product_id' => $id,
                'name' => 'Warna'
            ],
            [
                'product_id' => $id,
                'name' => 'Ukuran'
            ],
        ];
    }

    public function productVariantOptions($id)
    {
        return [
            [
                'product_variant_id' => $id,
                'name' => 'Besar'
            ],
            [
                'product_variant_id' => $id,

                'name' => 'Kecil'
            ],
            [
                'product_variant_id' => $id,
                'name' => 'Merah'
            ],
            [
                'product_variant_id' => $id,
                'name' => 'Kuning'
            ],
            [
                'product_variant_id' => $id,
                'name' => 'Hijau'
            ],
            [
                'product_variant_id' => $id,
                'name' => 'Putih'
            ],
            [
                'product_variant_id' => $id,
                'name' => 'Biru'
            ],
        ];
    }

    public function productCategories()
    {
        return [
            ['name' => 'Lilin Warna'],
            ['name' => 'Lilin Kristal'],
            ['name' => 'Lilin Aromaterapi'],
            ['name' => 'Lilin Batang'],
        ];
    }
}
