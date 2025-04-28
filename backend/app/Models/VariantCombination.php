<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class VariantCombination extends Model
{
    use HasFactory;
    public $timestamps = false;
    
    protected $fillable = [
        'product_id',
        'sku',
        'price',
        'stock',
        'hello'
    ];
    protected $appends = ['formatted_price'];

    public function getFormattedPriceAttribute(?string $currencyCode = null)
    {
        // dd($currencyCode);
        // If no currency specified, use default
        if (!$currencyCode) {
            $currency = Currency::getDefault();
            return $currency->format($this->price);
        }

        $currency = Currency::find($currencyCode);
        if (!$currency) {
            return Currency::getDefault()->format($this->price);
        }

        return $currency->convertAndFormat($this->price);
    }

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