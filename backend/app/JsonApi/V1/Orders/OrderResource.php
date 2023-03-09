<?php

namespace App\JsonApi\V1\Orders;

use Illuminate\Http\Request;
use LaravelJsonApi\Core\Resources\JsonApiResource;

class OrderResource extends JsonApiResource
{

    /**
     * Get the resource's attributes.
     *
     * @param Request|null $request
     * @return iterable
     */
    public function attributes($request): iterable
    {
        return [
            'code' => $this->code,
            'snap_token' => $this->snap_token,
            'airwaybill' => $this->airwaybill,
            'payments_type' => $this->
            payments_type,
            'buyer_name' => $this->buyer_name,
            'price_amount' => $this->price_amount,
            'is_validate_seller' => (bool) $this->is_validate_seller,
            'is_validate_buyer' => (bool) $this->is_validate_buyer,
            'is_shipping' => (bool) $this->is_shipping,
            'is_shipped' => (bool) $this->is_shipped,
            'is_received' => (bool) $this->is_received,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
    }

    /**
     * Get the resource's relationships.
     *
     * @param Request|null $request
     * @return iterable
     */
    public function relationships($request): iterable
    {
        return [
            $this->relation('order-details'),
            $this->relation('destination-users', 'destinationUser'),
            $this->relation('origin-users', 'originUser'),
        ];
    }

}
