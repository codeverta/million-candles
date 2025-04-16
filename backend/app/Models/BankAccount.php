<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BankAccount extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'bank_id',
        'account_name',
        'account_number',
        'starting_balance',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'starting_balance' => 'decimal:2',
    ];

    /**
     * Get the bank that owns the account.
     */
    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class);
    }

    /**
     * Get the transactions for this account.
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(FinancialTransaction::class, 'bank_account_id');
    }

    /**
     * Calculate the current balance of the account.
     */
    public function getCurrentBalance(): float
    {
        $incomeTotal = $this->transactions()
            ->where('type', 'income')
            ->sum('amount');
            
        $expenseTotal = $this->transactions()
            ->where('type', 'expense')
            ->sum('amount');
            
        return $this->starting_balance + $incomeTotal - $expenseTotal;
    }
}