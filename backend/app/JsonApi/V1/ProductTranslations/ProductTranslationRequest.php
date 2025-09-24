<?php

namespace App\JsonApi\V1\ProductTranslations;

use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class ProductTranslationRequest extends ResourceRequest
{

    /**
     * Get the validation rules for the resource.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'locale' => [
                'required',
                'string',
                'max:2',
                // Rule::unique('product_translations')->where(function ($query) {
                //     return $query->where('product_id', $this->input('product.id'));
                // })->ignore($this->route('product_translation')),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'product' => ['required', JsonApiRule::toOne()],
        ];
    }

}
