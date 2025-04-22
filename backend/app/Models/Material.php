<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = [
        'code', 'name', 'description', 'unit',
        'stock', 'minimum_stock', 'price_per_unit', 'supplier_id'
    ];

    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }

    public function stockMovements()
    {
        return $this->hasMany(MaterialStockMovement::class);
    }
}
