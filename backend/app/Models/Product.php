<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, SoftDeletes;


    /**
     * @var string[]
     */
    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'code',
        'slug',
        'deleted_at'
    ];

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            $product->uuid = Str::uuid();
        });

        static::saving(function (Product $product) {
            $product->slug = Str::slug($product->name);
        });
    }
    /**
     * @return BelongsTo
     */
    public function productCategories(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable', 'documentable_type');
    }

    /**
     * Get all the variants for the product.
     */
    public function productVariants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    /**
     * Get all the variant combinations for the product.
     */
    public function variantCombinations()
    {
        return $this->hasMany(VariantCombination::class);
    }

    /**
     * Get the product category that owns the product.
     */
    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'product_categories_id');
    }

    /**
     * Method to easily access formatted variant information.
     *
     * @return \Illuminate\Support\Collection
     */
    public function formattedVariants()
    {
        return $this->variants->map(function ($variant) {
            return [
                'name' => $variant->name,
                'options' => 'hehe'
                // 'options' => $variant->options,
            ];
        });
    }

    public function productWithVariantsAndOptions()
    {
        return self::where('id', $this->id)
            ->with(['variants' => function ($query) {
                $query->with('options'); // Eager load options for existing variants
            }]);
    }


    /**
     * Method to easily access variant combinations with their values.
     *
     * @return \Illuminate\Support\Collection
     */
    public function detailedCombinations()
    {
        return $this->variantCombinations->map(function ($combination) {
            return [
                'sku' => $combination->sku,
                'price' => $combination->price,
                'stock' => $combination->stock,
                'options' => $combination->values->mapWithKeys(function ($value) {
                    return [$value->option->variant->name => $value->option->name];
                }),
            ];
        });
    }
}