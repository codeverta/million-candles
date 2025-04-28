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

        $locale = $request->get('locale');
        $currency = $request->get('currency');
        $translatedDescription = null;
        $translatedName = null;
        $formattedPrice = null;

        if($locale) {
            $translation = $this->resource->translation($locale);
            if(isset($translation)) {
                $translatedName = $translation->name;
                $translatedDescription = $translation->description;
            }
        }

        if($currency) {
            $formattedPrice = $this->resource->getFormattedPriceAttribute();
        }

        // dd($translation->description);
        return [
            'name' => $translatedName ? $translatedName : $this->name,
            'code' => $this->code,
            'slug' => $this->slug,
            'description' => $translatedDescription ? $translatedDescription : $this->description,
            'price' => (int) $this->price,
            'stock' => (int) $this->stock,
            // 'variants' => $this->variants->load('options'),
            'product_variants' => $this->productVariants->loadMissing('productVariantOption.productVariant'),
            'variant_combinations' => $this->variantCombinations->loadMissing('values.productVariantOption.productVariant'),
            'formattedPrice' => $formattedPrice,
            'priceInCurrency' => $this->resource->getPriceInCurrencyAttribute($request->get('currency')),
            // 'translatedName' => $this->translatedName,
            // 'translatedDescription' => $this->translatedDescription,
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
