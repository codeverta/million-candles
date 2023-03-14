<?php

namespace App\JsonApi\V1\Users;

use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;
use Illuminate\Validation\Rules\Password;

class UserRequest extends ResourceRequest
{

    /**
     * Get the validation rules for the resource.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'name' => ['string', 'nullable'],
            'email' => ['string', 'nullable', 'email'],
            'password' => ['string', 'confirmed', Password::min(8)],
            'is_active' => ['boolean', 'nullable'],
            'deletedAt' => ['nullable', JsonApiRule::dateTime()],
        ];
    }

}
