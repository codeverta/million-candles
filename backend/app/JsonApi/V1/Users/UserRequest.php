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
        $user = $this->model();

        $uniqueEmail = Rule::unique('users', 'email');
        $uniqueName = Rule::unique('users', 'name');

        if($user) {
            $uniqueEmail->ignoreModel($user);
            $uniqueName->ignoreModel($uniqueName);
        }
        
        return [
            'name' => ['string', 'nullable', ],
            'email' => ['string', 'nullable', 'email', $uniqueEmail],
            'password' => ['string', 'confirmed', Password::min(8)],
            'is_active' => ['boolean', 'nullable'],
            'deletedAt' => ['nullable', JsonApiRule::dateTime()],
        ];
    }

}
