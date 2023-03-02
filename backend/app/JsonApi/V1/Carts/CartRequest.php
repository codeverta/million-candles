<?php

namespace App\JsonApi\V1\Carts;

use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class CartRequest extends ResourceRequest
{

    /**
     * Get the validation rules for the resource.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'products' => [JsonApiRule::toOne()],
            'quantity' => 'required'
        ];
    }

}
