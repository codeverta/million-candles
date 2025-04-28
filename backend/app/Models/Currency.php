<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'code';

    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'code',
        'name',
        'symbol',
        'exchange_rate',
        'is_default',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'exchange_rate' => 'float',
        'is_default' => 'boolean',
    ];

    /**
     * Get the default currency
     *
     * @return self
     */
    public static function getDefault()
    {
        return static::where('is_default', true)->first();
    }

    /**
     * Convert amount from base currency to this currency
     *
     * @param float $amount
     * @return float
     */
    public function convert(float $amount): float
    {
        $defaultCurrency = self::getDefault();
        
        // If this is the default currency, no conversion needed
        if ($this->is_default) {
            return $amount;
        }
        
        // Convert from default currency to the target currency
        // For IDR to USD: divide the IDR amount by the IDR/USD rate
        return $amount / $defaultCurrency->exchange_rate * $this->exchange_rate;
    }

    /**
     * Format amount with currency symbol
     *
     * @param float $amount
     * @return string
     */
    public function format(float $amount): string
    {
        return $this->symbol . number_format($amount, 2);
    }

    /**
     * Convert and format amount
     *
     * @param float $amount
     * @return string
     */
    public function convertAndFormat(float $amount): string
    {
        return $this->format($this->convert($amount));
    }
}