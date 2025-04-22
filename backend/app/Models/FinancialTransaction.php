<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FinancialTransaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'category_id',
        'amount',
        'bank_account_id',
        'date',
        'description',
        'related_order_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'date',
    ];

    /**
     * Get the category that owns the transaction.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(FinancialCategory::class, 'category_id');
    }

    /**
     * Get the bank account that owns the transaction.
     */
    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class, 'bank_account_id');
    }

    /**
     * Get the related order if any.
     */
    public function relatedOrder(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'related_order_id');
    }

    /**
     * Scope a query to filter by date range.
     */
    public function scopeDateBetween($query, $startDate, $endDate)
    {
        if ($startDate && $endDate) {
            return $query->whereBetween('date', [$startDate, $endDate]);
        }
        
        if ($startDate) {
            return $query->where('date', '>=', $startDate);
        }
        
        if ($endDate) {
            return $query->where('date', '<=', $endDate);
        }
        
        return $query;
    }
}
