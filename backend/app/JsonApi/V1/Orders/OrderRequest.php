<?php

namespace App\JsonApi\V1\Orders;

use Illuminate\Validation\Rule;
use LaravelJsonApi\Laravel\Http\Requests\ResourceRequest;
use LaravelJsonApi\Validation\Rule as JsonApiRule;

class OrderRequest extends ResourceRequest
{

    /**
     * Get the validation rules for the resource.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'airwaybill' => ['string', 'required'],
            'origin-users' => [ 'required', JsonApiRule::toOne() ],
            'destination-users' => [ 'required', JsonApiRule::toOne() ]
        ];
    }

}
