<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariantCombination extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'sku',
        'price',
        'stock',
    ];

    /**
     * Get the product that owns this combination.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get all the values for this variant combination.
     */
    public function values()
    {
        return $this->hasMany(VariantCombinationValue::class);
    }
}