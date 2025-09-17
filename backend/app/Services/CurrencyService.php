<?php

// app/Services/CurrencyService.php

namespace App\Services;

use App\Models\Currency;

class CurrencyService
{
    private array $cache = [];

    public function getDefault(): Currency
    {
        if (!isset($this->cache['default'])) {
            $this->cache['default'] = Currency::where('is_default', 1)->firstOrFail();
        }
        return $this->cache['default'];
    }

    public function getByCode(string $code): Currency
    {
        if (!isset($this->cache[$code])) {
            $this->cache[$code] = Currency::where('code', $code)->first() ?? $this->getDefault();
        }
        return $this->cache[$code];
    }
}