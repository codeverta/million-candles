<?php

namespace App\JsonApi\V1\Products;

use Illuminate\Http\Request;
use LaravelJsonApi\Core\Resources\JsonApiResource;
use App\Models\Product;

class ProductResource extends JsonApiResource
{

    /**
     * Get the resource's attributes.
     *
     * @param Request|null $request
     * @return iterable
     */
    public function attributes($request): iterable
    {
        return [
            'name' => $this->name,
            'code' => $this->code,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (int) $this->price,
            'stock' => (int) $this->stock,
            // 'variants' => $this->variants->load('options'),
            'product_variants' => $this->productVariants->loadMissing('productVariantOption.productVariant'),
            'variant_combinations' => $this->variantCombinations->loadMissing('values.productVariantOption.productVariant'),
        // 'variant_combinations' => $this->variantCombinations->loadMissing('values.productVariantOption.productVariant')->map(function ($combination) {
        //     // dd($combination);
        //     return [
        //         'id' => $combination->id,
        //         'type' => 'variant_combinations',
        //         'values' => $combination->values->map(function ($value) use ($combination) {
        //             // dd($combination);
        //             $option = $value?->productVariantOption;
        //             $variant = $option?->productVariant;
        //             return [
        //                 'id' => $value->id,
        //                 'type' => 'variant_combination_values',
        //                 'sku' => $combination->sku,
        //                 'price' => (int) $combination->price,
        //                 'stock' => (int) $combination->stock,
        //                 'option' => [
        //                     'id' => $option?->id,
        //                     'type' => 'product_variant_options',
        //                     'name' => $option?->name,
        //                     'variantId' => $variant?->id,
        //                     'variantName' => $variant?->name,
        //                 ],
        //             ];
        //         }),
        //     ];
        // }),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'deletedAt' => $this->deleted_at,
        ];
    }

    /**
     * Get the resource's relationships.
     *
     * @param Request|null $request
     * @return iterable
     */
    public function relationships($request): iterable
    {
        return [
            $this->relation('documents'),
            $this->relation('product-categories'),
        ];
    }

}
