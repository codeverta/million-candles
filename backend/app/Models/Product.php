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

    public function productVariants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
