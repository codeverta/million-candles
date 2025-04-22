<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariantCombinationValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'variant_combination_id',
        'product_variant_option_id',
    ];

    /**
     * Get the variant combination that owns this value.
     */
    public function combination()
    {
        return $this->belongsTo(VariantCombination::class);
    }

    /**
     * Get the product variant option associated with this value.
     */
    public function productVariantOption()
    {
        return $this->belongsTo(ProductVariantOption::class);
    }
}