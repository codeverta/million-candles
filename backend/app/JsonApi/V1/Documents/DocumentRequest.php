<?php

namespace App\JsonApi\V1\Documents;

use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class DocumentRequest extends ResourceRequest
{

    /**
     * Get the validation rules for the resource.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'documentable_id' => [ JsonApiRule::toOne(), 'required' ],
            'filename' => [ 'string', 'required']
        ];
    }

}
