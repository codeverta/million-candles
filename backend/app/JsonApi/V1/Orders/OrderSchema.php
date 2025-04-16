<?php

namespace App\JsonApi\V1\Orders;

use App\Models\Order;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\Boolean;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Fields\Relations\HasMany;
use LaravelJsonApi\Eloquent\Fields\Relations\HasOne;
use LaravelJsonApi\Eloquent\Filters\Where;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Schema;

class OrderSchema extends Schema
{

    /**
     * The model the schema corresponds to.
     *
     * @var string
     */
    public static string $model = Order::class;

    /**
     * The maximum include path depth.
     *
     * @var int
     */
    protected int $maxDepth = 3;
    /**
     * Get the resource fields.
     *
     * @return array
     */
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('airwaybill'),
            Str::make('snap_token'),
            Str::make('payments_type'),
            Str::make('buyer_name'),
            Boolean::make('is_validate_buyer'),
            Number::make('price_amount'),
            Boolean::make('is_validate_seller'),
            Boolean::make('is_shipping'),
            Boolean::make('is_shipped'),
            Boolean::make('is_received'),
            Number::make('discount'),
            Number::make('shipping_cost'),
            Str::make('discount_type'),
            Number::make('down_payment'),
            Number::make('remaining_payment'),
            HasMany::make('order-details'),
            BelongsTo::make('origin-users', 'originUser')->type('users'),
            BelongsTo::make('destination-users', 'destinationUser')->type('users'),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
        ];
    }

    /**
     * Get the resource filters.
     *
     * @return array
     */
    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
            Where::make('is_shipping')->asBoolean(),
            Where::make(
            'is_shipped')->asBoolean(),
            Where::make(
            'is_validate_seller')->asBoolean(),
            Where::make(
            'is_validate_buyer')->asBoolean(),
            Where::make('is_received')->asBoolean(),
            Where::make('order_type')
        ];
    }

    /**
     * Get the resource paginator.
     *
     * @return Paginator|null
     */
    public function pagination(): ?Paginator
    {
        return PagePagination::make();
    }

}
