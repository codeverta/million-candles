<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductTranslation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'product_id',
        'locale',
        'name',
        'description',
    ];

    /**
     * Get the product that this translation belongs to.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}