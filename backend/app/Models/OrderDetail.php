<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class OrderDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'qty',
        'price',
        'products_id',
        'orders_id',
        'variant_combination_id',
        'variant_sku',
        'total_price',
    ];


    protected static function booted(): void
    {
        static::creating(function (OrderDetail $orderDetail) {
            $orderDetail->uuid = Str::uuid();
        });
    }


    public function orders(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function products(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function variantCombination()
    {
        return $this->belongsTo(VariantCombination::class);
    }
}
