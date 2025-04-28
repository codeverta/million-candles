<?php

namespace App\JsonApi\V1\Products;

use App\Models\Product;
use LaravelJsonApi\Eloquent\Contracts\Paginator;
use LaravelJsonApi\Eloquent\Fields\DateTime;
use LaravelJsonApi\Eloquent\Fields\ID;
use LaravelJsonApi\Eloquent\Fields\Relations\BelongsTo;
use LaravelJsonApi\Eloquent\Fields\Str;
use LaravelJsonApi\Eloquent\Fields\Number;
use LaravelJsonApi\Eloquent\Fields\Relations\HasMany;
use LaravelJsonApi\Eloquent\SoftDeletes;
use LaravelJsonApi\Eloquent\Filters\WhereIdIn;
use LaravelJsonApi\Eloquent\Pagination\PagePagination;
use LaravelJsonApi\Eloquent\Fields\SoftDelete;
use LaravelJsonApi\Eloquent\Filters\Where;
use LaravelJsonApi\Eloquent\Schema;
use LaravelJsonApi\Eloquent\Fields\Attribute;
use LaravelJsonApi\Eloquent\Fields\Map;


class ProductSchema extends Schema
{

    use SoftDeletes;
    /**
     * The model the schema corresponds to.
     *
     * @var string
     */
    public static string $model = Product::class;

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
            Str::make('name'),
            Str::make('description'),
            Str::make('code'),
            Str::make('slug'),
            Number::make('stock'),
            Number::make('price'),
            BelongsTo::make('product-categories'),
            BelongsTo::make('documents'),
            Str::make('formattedPrice')
                ->readOnly()
                ->serializeUsing(
                    static function ($value, $resource, $request) {
                        $currencyCode = $request->query('currency');
                        return $resource->getFormattedPrice($currencyCode);
                    }
                ),
            // Number::make('priceInCurrency')
            //     ->readOnly()
            //     ->serializeUsing(
            //         static function ($value, $resource, $request) {
            //             $currencyCode = $request->query('currency');
            //             return $resource->getPriceInCurrency($currencyCode);
            //         }
            //     ),
            // Str::make('translatedName')
            //     ->readOnly()
            //     ->serializeUsing(
            //         static function ($value, $resource, $request) {
            //             dd("hree");
            //             $locale = $request->query('locale', App::getLocale());
            //             $translation = $resource->translation($locale);
            //             return $translation && $translation->name ? $translation->name : $resource->name;
            //         }
            //     ),
            // Str::make('translatedDescription')
            //     ->readOnly()
            //     ->serializeUsing(
            //         static function ($value, $resource, $request) {
            //             $locale = $request->query('locale', App::getLocale());
            //             $translation = $resource->translation($locale);
            //             return $translation && $translation->description ? $translation->description : $resource->description;
            //         }
            //     ),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
            SoftDelete::make('deletedAt'),
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
            Where::make("slug"),
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
