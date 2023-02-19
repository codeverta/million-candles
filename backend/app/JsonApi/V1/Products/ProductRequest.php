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
        $product = $this->model();
        $uniquePost = Rule::unique('products', 'name');

        if ($product) {
            $uniquePost->ignoreModel($product);
        }
        return [
            'name' => ['required', 'string', $uniquePost],
            'description' => ['required', 'string'],
            'product-categories' => JsonApiRule::toOne('product-categories'),
            'price' => ['required', JsonApiRule::number()],
            'stock' => ['required', JsonApiRule::number()]
        ];
    }

}
