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
        $order = $this->model();
        $uniqueSlug = Rule::unique('orders', 'airwaybill');

        if ($order) {
            $uniqueSlug->ignoreModel($order);
        }

        return [
            'airwaybill' => ['string', $uniqueSlug],
            'origin-users' => [ JsonApiRule::toOne() ],
            'destination-users' => [ JsonApiRule::toOne() ],
            'is_validate' => ['boolean'],
            'is_shipping' => ['boolean'],
            'is_shipped' => ['boolean'],
        ];
    }

}
