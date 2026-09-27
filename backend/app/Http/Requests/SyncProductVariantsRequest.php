<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SyncProductVariantsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'variants' => ['present', 'array', 'max:5'],
            'variants.*.id' => ['nullable', 'integer'],
            'variants.*.name' => ['required', 'string', 'max:32', 'distinct:ignore_case'],
            'variants.*.options' => ['required', 'array', 'min:1', 'max:30'],
            'variants.*.options.*.key' => ['required', 'string', 'max:100', 'distinct'],
            'variants.*.options.*.name' => ['required', 'string', 'max:64'],
            'combinations' => ['present', 'array', 'max:500'],
            'combinations.*.id' => ['nullable', 'integer'],
            'combinations.*.sku' => ['nullable', 'string', 'max:255', 'distinct:ignore_case'],
            'combinations.*.price' => ['required', 'numeric', 'min:0'],
            'combinations.*.stock' => ['required', 'integer', 'min:0'],
            'combinations.*.option_keys' => ['required', 'array', 'min:1'],
            'combinations.*.option_keys.*' => ['required', 'string', 'max:100', 'distinct'],
        ];
    }
}
