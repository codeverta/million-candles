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
            'airwaybill' => ['string', 'nullable', $uniqueSlug],
            'payments_type' => ['string', 'nullable'],
            'buyer_name' => ['string', 'nullable'],
            'origin-users' => [ JsonApiRule::toOne() ],
            'destination-users' => [ JsonApiRule::toOne() ],
            'discount' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'discount_type' => ['nullable', 'string', 'in:percentage,nominal'],
            'down_payment' => ['nullable', 'numeric', 'min:0', 'max:50000000'],
            'remaining_payment' => ['nullable', 'numeric', 'min:0', 'max:50000000'],
            'shipping_cost' => ['nullable', 'numeric', 'min:0', 'max:50000000'],
            'price_amount' => ['nullable', 'numeric', 'min:1000', 'max:50000000'],
            'is_validate' => ['boolean'],
            'is_shipping' => ['boolean'],
            'is_shipped' => ['boolean'],
            'is_validate_buyer' => ['boolean'],
            'is_validate_seller' => ['boolean'],
            'is_received' => ['boolean'],
            'deletedAt' => ['nullable', JsonApiRule::dateTime()],
        ];
    }

}
