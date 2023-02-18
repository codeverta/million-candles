<?php

namespace App\JsonApi\V1\Products;

use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class ProductRequest extends ResourceRequest
{

    /**
     * Get the validation rules for the resource.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'product-categories' => JsonApiRule::toOne('product-categories'),
            'price' => ['required', JsonApiRule::number()],
            'stock' => ['required', JsonApiRule::number()]
        ];
    }

}
