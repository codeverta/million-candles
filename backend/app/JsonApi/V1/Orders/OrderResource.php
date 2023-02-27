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
            'snap_token' => $this->snap_token,
            'airwaybill' => $this->airwaybill,
            'is_validate' => (bool) $this->is_validate,
            'is_shipping' => (bool) $this->is_shipping,
            'is_shipped' => (bool) $this->is_shipped,
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
            $this->relation(
            'origin-user'),
            $this->relation('destination-user'),
        ];
    }

}
