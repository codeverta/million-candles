<?php

namespace App\JsonApi\V1;

use App\JsonApi\V1\Carts\CartSchema;
use App\JsonApi\V1\Districts\DistrictSchema;
use App\JsonApi\V1\Documents\DocumentSchema;
use App\JsonApi\V1\OrderDetails\OrderDetailSchema;
use App\JsonApi\V1\Orders\OrderSchema;
use App\JsonApi\V1\ProductCategories\ProductCategorySchema;
use App\JsonApi\V1\Products\ProductSchema;
use App\JsonApi\V1\ProductVariantOptions\ProductVariantOptionSchema;
use App\JsonApi\V1\Provinces\ProvinceSchema;
use App\JsonApi\V1\Regencies\RegencySchema;
use App\JsonApi\V1\Users\UserSchema;
use App\JsonApi\V1\Villages\VillageSchema;
use App\Models\Cart;
use LaravelJsonApi\Core\Server\Server as BaseServer;
use Illuminate\Support\Facades\Auth;

class Server extends BaseServer
{

    /**
     * The base URI namespace for this server.
     *
     * @var string
     */
    protected string $baseUri = '/api/v1';

    /**
     * Bootstrap the server when it is handling an HTTP request.
     *
     * @return void
     */
    public function serving(): void
    {
        Auth::shouldUse('sanctum');
        Cart::creating(static function (Cart $cart): void {
            $cart->users()->associate(Auth::user());
        });
    }

    /**
     * Get the server's list of schemas.
     *
     * @return array
     */
    protected function allSchemas(): array
    {
        return [
            ProductSchema::class,
            ProductCategorySchema::class,
            ProvinceSchema::class,
            RegencySchema::class,
            DistrictSchema::class,
            VillageSchema::class,
            OrderSchema::class,
            OrderDetailSchema::class,
            UserSchema::class,
            DocumentSchema::class,
            CartSchema::class,
            ProductVariantOptionSchema::class
        ];
    }
}
