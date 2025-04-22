<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $fillable = [
        'name',
        'product_id',
    ];

    /**
     * Get the product that owns the variant.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get all the options for this variant.
     */
    public function productVariantOption()
    {
        return $this->hasMany(ProductVariantOption::class);
    }
}