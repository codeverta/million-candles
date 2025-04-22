<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariantOption extends Model
{
    use HasFactory;

    public $timestamps = false;
    
    protected $fillable = [
        'name',
        'product_variant_id',
    ];

    /**
     * Get the variant that owns this option.
     */
    public function variant()
    {
        return $this->belongsTo(ProductVariant::class);
    }

    public function productVariant()
    {
        return $this->belongsTo(ProductVariant::class);
    }

    /**
     * Get all the variant combination values associated with this option.
     */
    public function combinationValues()
    {
        return $this->hasMany(VariantCombinationValue::class);
    }
}