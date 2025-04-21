<?php

namespace App\JsonApi\V1\OrderDetails;

use Illuminate\Http\Request;
use LaravelJsonApi\Core\Resources\JsonApiResource;

class OrderDetailResource extends JsonApiResource
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
            'id' => $this->id,
            'qty' => $this->qty,
            'price' => $this->price,
            'totalPrice' => $this->total_price,
            'variantCombinationId' => $this->variant_combination_id,
            'variantSku' => $this->variant_sku,
            'variantCombination' => $this->loadMissing('variantCombination.values.productVariantOption'),
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
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
            $this->relation('products'),
            $this->relation('orders'),
        ];
    }

}
