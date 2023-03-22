<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariantOption extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $guarded = [];

    public function productVariants()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
