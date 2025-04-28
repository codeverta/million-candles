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

                        // $locale = $request->query('locale', App::getLocale());
                        // $translation = $resource->translation($locale);
                        // return $translation && $translation->description ? $translation->description : $resource->description;
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
            'formattedPrice' => $this->getFormattedPriceAttribute($request->get('currency')),
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
