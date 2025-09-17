<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;

    // Add a static property to hold the cached default currency
    protected static ?Currency $defaultCurrencyCache = null;

    protected $primaryKey = 'code';
    protected $keyType = 'string';
    public $incrementing = false;
    
    protected $fillable = [
        'code',
        'name',
        'symbol',
        'exchange_rate',
        'is_default',
    ];

    protected $casts = [
        'exchange_rate' => 'float',
        'is_default' => 'boolean',
    ];

    /**
     * Get the default currency with caching.
     *
     * @return self
     */
    public static function getDefault()
    {
        // If the cache is empty, fetch the default currency and store it
        if (is_null(self::$defaultCurrencyCache)) {
            self::$defaultCurrencyCache = static::where('is_default', true)->first();
        }
        
        // Return the cached instance
        return self::$defaultCurrencyCache;
    }

    /**
     * Convert amount from base currency to this currency
     *
     * @param float $amount
     * @return float
     */
    public function convert(float $amount): float
    {
        // Now calling getDefault() will only query the database once
        $defaultCurrency = self::getDefault();
        
        if ($this->is_default) {
            return $amount;
        }
        
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