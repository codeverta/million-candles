<?php

namespace App\JsonApi\V1\OrderDetails;

use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class OrderDetailRequest extends ResourceRequest
{

    /**
     * Get the validation rules for the resource.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'qty' => ['nullable', 'min:0', 'max:99999', 'numeric'],
            'price' => ['required', 'numeric'],
            'total_price' => ['required', 'numeric'],
            'products' => [JsonApiRule::toOne('products')],
            'variant_combination_id' => ['nullable', 'exists:variant_combinations,id'],
            'variant_sku' => ['nullable', 'exists:variant_combinations,sku'],
            'orders' => [JsonApiRule::toOne('orders')],
        ];
    }
}
