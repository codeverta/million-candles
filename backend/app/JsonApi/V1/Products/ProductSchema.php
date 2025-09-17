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

class ProductSchema extends Schema
{
    use SoftDeletes;
    
    public static string $model = Product::class;
    
    public array $with = [
        'productTranslations',
        'productVariants.productVariantOption',
        'variantCombinations.values.productVariantOption.productVariant',
        'reviews.user',
        'productCategories',
        'documents'
    ];
    
    protected int $maxDepth = 3;
    
    public function fields(): array
    {
        return [
            ID::make(),
            Str::make('name'),
            Str::make('description'),
            Str::make('code'),
            Str::make('slug'),
            Number::make('stock'),
            Number::make('view_count'),
            Number::make('price'),
            BelongsTo::make('product-categories'),
            BelongsTo::make('documents'),
            HasMany::make('reviews'),
            HasMany::make('product-variants'),
            HasMany::make('variant-combinations'),
            DateTime::make('createdAt')->sortable()->readOnly(),
            DateTime::make('updatedAt')->sortable()->readOnly(),
            SoftDelete::make('deletedAt'),
        ];
    }

    public function filters(): array
    {
        return [
            WhereIdIn::make($this),
            Where::make("slug"),
            Where::make('category_id', 'product_categories_id'),
        ];
    }

    public function pagination(): ?Paginator
    {
        return PagePagination::make();
    }
}