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
        'deleted_at'
    ];

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            $order->uuid = Str::uuid();
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
