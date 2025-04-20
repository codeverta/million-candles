<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVariantCombinationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'sku' => 'nullable|string',
            'price' => 'nullable|numeric',
            'stock' => 'required|integer',
            'option_ids' => 'required|array',
            'option_ids.*' => 'exists:product_variant_options,id',
        ];
    }
}
