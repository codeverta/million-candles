<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'qty',
        'price',
        'product_id'
    ];


    public function orders(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
