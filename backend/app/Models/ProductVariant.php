<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $guarded = [];

    public function products()
    {
        return $this->belongsTo(Product::class);
    }

    public function productVariantOptions()
    {
        return $this->hasMany(ProductVariantOption::class);
    }
}
