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
            'qty' => ['nullable', 'min:0', 'max:1000', 'numeric'],
            'price' => ['required', 'numeric'],
            'products' => [JsonApiRule::toOne('products')],
            'orders' => [JsonApiRule::toOne('orders')],
        ];
    }

}
