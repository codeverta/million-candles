<?php

namespace App\Models;

use App\Scopes\OrderScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected static function booted(): void
    {
        static::addGlobalScope(new OrderScope);
        static::creating(function (Order $order) {
            $order->uuid = Str::uuid();
        });
        static::created(function (Order $order) {
            $order->code = "INV" . Str::upper(Str::random(6)) . $order->id;
            $order->save();
        });
        static::updating(function(Order $order)
        {
            // dd($order);
        });
    }

    public function originUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'origin_user_id');
    }

    public function destinationUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'destination_user_id');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'orders_id');
    }
}
