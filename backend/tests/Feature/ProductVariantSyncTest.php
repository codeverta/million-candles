<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductVariantSyncTest extends TestCase
{
    use RefreshDatabase;

    private function product(): Product
    {
        $category = ProductCategory::factory()->create();
        $product = new Product([
            'code' => 'VAR-01',
            'name' => 'Lilin Variant',
            'description' => 'Produk untuk pengujian variant.',
            'price' => 10000,
            'stock' => 20,
        ]);
        $product->product_categories_id = $category->id;
        $product->save();

        return $product;
    }

    public function test_admin_can_sync_variants_and_all_combinations(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $product = $this->product();

        $response = $this->putJson(
            "/api/v1/products/{$product->id}/variants/-actions/sync",
            [
                'variants' => [
                    [
                        'name' => 'Warna',
                        'options' => [
                            ['key' => 'red', 'name' => 'Merah'],
                            ['key' => 'blue', 'name' => 'Biru'],
                        ],
                    ],
                    [
                        'name' => 'Ukuran',
                        'options' => [
                            ['key' => 'small', 'name' => 'Kecil'],
                            ['key' => 'large', 'name' => 'Besar'],
                        ],
                    ],
                ],
                'combinations' => [
                    ['sku' => 'RED-S', 'price' => 10000, 'stock' => 5, 'option_keys' => ['red', 'small']],
                    ['sku' => 'RED-L', 'price' => 12000, 'stock' => 4, 'option_keys' => ['red', 'large']],
                    ['sku' => 'BLUE-S', 'price' => 11000, 'stock' => 3, 'option_keys' => ['blue', 'small']],
                    ['sku' => 'BLUE-L', 'price' => 13000, 'stock' => 2, 'option_keys' => ['blue', 'large']],
                ],
            ]
        );

        $response->assertOk();
        $this->assertDatabaseCount('product_variants', 2);
        $this->assertDatabaseCount('product_variant_options', 4);
        $this->assertDatabaseCount('variant_combinations', 4);
        $this->assertDatabaseCount('variant_combination_values', 8);
        $this->assertDatabaseHas('variant_combinations', [
            'product_id' => $product->id,
            'sku' => 'BLUE-L',
            'price' => 13000,
            'stock' => 2,
        ]);
    }

    public function test_incomplete_combination_matrix_is_rejected_without_deleting_existing_data(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $product = $this->product();

        $validPayload = [
            'variants' => [[
                'name' => 'Warna',
                'options' => [
                    ['key' => 'red', 'name' => 'Merah'],
                    ['key' => 'blue', 'name' => 'Biru'],
                ],
            ]],
            'combinations' => [
                ['sku' => 'RED', 'price' => 10000, 'stock' => 5, 'option_keys' => ['red']],
                ['sku' => 'BLUE', 'price' => 11000, 'stock' => 5, 'option_keys' => ['blue']],
            ],
        ];

        $this->putJson(
            "/api/v1/products/{$product->id}/variants/-actions/sync",
            $validPayload
        )->assertOk();

        $invalidPayload = $validPayload;
        array_pop($invalidPayload['combinations']);
        $this->putJson(
            "/api/v1/products/{$product->id}/variants/-actions/sync",
            $invalidPayload
        )->assertUnprocessable();

        $this->assertDatabaseCount('variant_combinations', 2);
        $this->assertDatabaseHas('variant_combinations', ['sku' => 'BLUE']);
    }

    public function test_sync_updates_existing_records_without_changing_their_ids(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $product = $this->product();

        $this->putJson(
            "/api/v1/products/{$product->id}/variants/-actions/sync",
            [
                'variants' => [[
                    'name' => 'Warna',
                    'options' => [
                        ['key' => 'red', 'name' => 'Merah'],
                        ['key' => 'blue', 'name' => 'Biru'],
                    ],
                ]],
                'combinations' => [
                    ['sku' => 'RED', 'price' => 10000, 'stock' => 5, 'option_keys' => ['red']],
                    ['sku' => 'BLUE', 'price' => 11000, 'stock' => 4, 'option_keys' => ['blue']],
                ],
            ]
        )->assertOk();

        $variant = $product->productVariants()->with('productVariantOption')->firstOrFail();
        $redOption = $variant->productVariantOption->firstWhere('name', 'Merah');
        $blueOption = $variant->productVariantOption->firstWhere('name', 'Biru');
        $redCombination = $product->variantCombinations()->where('sku', 'RED')->firstOrFail();
        $blueCombination = $product->variantCombinations()->where('sku', 'BLUE')->firstOrFail();

        $this->putJson(
            "/api/v1/products/{$product->id}/variants/-actions/sync",
            [
                'variants' => [[
                    'id' => $variant->id,
                    'name' => 'Warna Produk',
                    'options' => [
                        ['key' => (string) $redOption->id, 'name' => 'Merah Tua'],
                        ['key' => (string) $blueOption->id, 'name' => 'Biru'],
                    ],
                ]],
                'combinations' => [
                    [
                        'id' => $redCombination->id,
                        'sku' => 'RED-NEW',
                        'price' => 12500,
                        'stock' => 7,
                        'option_keys' => [(string) $redOption->id],
                    ],
                    [
                        'id' => $blueCombination->id,
                        'sku' => 'BLUE',
                        'price' => 11000,
                        'stock' => 4,
                        'option_keys' => [(string) $blueOption->id],
                    ],
                ],
            ]
        )->assertOk();

        $this->assertDatabaseHas('product_variants', [
            'id' => $variant->id,
            'name' => 'Warna Produk',
        ]);
        $this->assertDatabaseHas('product_variant_options', [
            'id' => $redOption->id,
            'name' => 'Merah Tua',
        ]);
        $this->assertDatabaseHas('variant_combinations', [
            'id' => $redCombination->id,
            'sku' => 'RED-NEW',
            'price' => 12500,
            'stock' => 7,
        ]);
        $this->assertDatabaseCount('product_variants', 1);
        $this->assertDatabaseCount('product_variant_options', 2);
        $this->assertDatabaseCount('variant_combinations', 2);
    }
}
