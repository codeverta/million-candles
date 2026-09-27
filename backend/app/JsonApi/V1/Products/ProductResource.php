<?php

namespace App\JsonApi\V1\Products;

use Illuminate\Http\Request;
use LaravelJsonApi\Core\Resources\JsonApiResource;

class ProductResource extends JsonApiResource
{
    public function attributes($request): iterable
    {
        $this->resource->loadMissing([
            'productVariants.productVariantOption',
            'variantCombinations.values.productVariantOption.productVariant',
        ]);

        $locale = $request->get('locale');
        $currencyCode = $request->get('currency');
        
        // Get translation once if needed
        $translation = $locale ? $this->resource->translation($locale) : null;
        $variantCombinations = $this->variantCombinations->map(function ($combination) use ($currencyCode) {
            $price = (float) $combination->price;
            $currency = $currencyCode
                ? $this->resource->getCurrency($currencyCode)
                : $this->resource->getCurrency();

            return array_merge($combination->toArray(), [
                'priceInCurrency' => $currencyCode ? $currency->convert($price) : $price,
                'formattedPrice' => $currencyCode
                    ? $currency->convertAndFormat($price)
                    : $currency->format($price),
            ]);
        })->values();
        
        return [
            'name' => $translation?->name ?? $this->name,
            'code' => $this->code,
            'slug' => $this->slug,
            'description' => $translation?->description ?? $this->description,
            'thumbnail' => $this->documents->first()?->filename,
            'price' => (int) $this->price,
            'stock' => (int) $this->stock,
            'views_count' => (int) $this->views_count,
            'amount_sold' => (int) $this->amount_sold,
            'product_reviews' => $this->reviews
                ->where('is_approved', true)
                ->values(),
            'product_variants' => $this->productVariants,
            'variant_combinations' => $variantCombinations,
            'formattedPrice' => $currencyCode ? $this->resource->getFormattedPrice($currencyCode) : null,
            'priceInCurrency' => $currencyCode ? $this->resource->getPriceInCurrency($currencyCode) : $this->price,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'deletedAt' => $this->deleted_at,
        ];
    }

    public function relationships($request): iterable
    {
        return [
            $this->relation('documents'),
            $this->relation('product-categories'),
        ];
    }
}
