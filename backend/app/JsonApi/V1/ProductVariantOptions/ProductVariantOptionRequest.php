<?php

namespace App\JsonApi\V1\ProductVariantOptions;

use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class ProductVariantOptionRequest extends ResourceRequest
{

    /**
     * Get the validation rules for the resource.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'product_variant_id' => [JsonApiRule::toOne()]
        ];
    }

}
