<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // Optional: for logging errors or info
use Carbon\Carbon; // For timestamps

class UpdateCurrencyRates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'currency:update-rates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update currency exchange rates in the database.';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting currency rate update process...');

        // --- IMPORTANT ---
        // In a real application, you would fetch these rates from a reliable API.
        // These are placeholder rates based on our last discussion (May 7, 2025).
        // Your database column `exchange_rate` is double(8,2).
        // Consider changing to DECIMAL(15,4) or similar for better precision,
        // especially for rates like IDR, VND, etc.
        $latestRates = [
            'AED' => 3.67,
            'AMD' => 387.11, // Ensure this rate is accurate if not from primary source
            'ARS' => 1204.40,
            'AUD' => 1.54,
            'AZN' => 1.70,
            'BDT' => 121.61,
            'BGN' => 1.72,
            'BHD' => 0.376,
            'BRL' => 5.72,
            'BYN' => 3.27,
            'CAD' => 1.38,
            'CHF' => 0.82,
            'CLP' => 939.49,
            'CNY' => 7.22,
            'COP' => 4302.31,
            'CZK' => 21.99,
            'DKK' => 6.58,
            'EUR' => 0.88,
            'GBP' => 0.75,
            'GEL' => 2.74,
            'HKD' => 7.75,
            // HRK is obsolete and replaced by EUR. It should be handled separately.
            // Consider removing it or marking it inactive in your database.
            'HUF' => 356.50,
            'IDR' => 16415.46, // Your column `double(8,2)` might truncate this if it means 8 total digits, 2 after decimal.
            'ILS' => 3.61,
            'INR' => 84.32,
            'ISK' => 129.32,
            'JOD' => 0.709,
            'JPY' => 142.79,
            'KRW' => 1377.30,
            'KWD' => 0.307,
            'KZT' => 448.50, // Ensure this rate is accurate
            'LKR' => 299.74,
            'MMK' => 2100.00, // Ensure this rate is accurate
            'MXN' => 19.69,
            'MYR' => 4.23,
            'NGN' => 1607.80,
            'NOK' => 10.29,
            'NZD' => 1.67,
            'OMR' => 0.385,
            'PHP' => 55.43,
            'PKR' => 281.27,
            'PLN' => 3.77,
            'RON' => 4.48,
            'RUB' => 81.07,
            'SAR' => 3.75,
            'SEK' => 9.58,
            'SGD' => 1.29,
            'THB' => 32.65,
            'TRY' => 38.61,
            'UAH' => 41.59,
            'USD' => 1.00,   // Base currency
            'UZS' => 12916.46, // Your column `double(8,2)` might truncate this
            'VND' => 25961.51, // Your column `double(8,2)` might truncate this
            'ZAR' => 18.18,
        ];

        $currentTimestamp = Carbon::now();
        $updatedCount = 0;
        $notFoundCount = 0;

        foreach ($latestRates as $code => $rate) {
            try {
                $affectedRows = DB::table('currencies')
                    ->where('code', $code)
                    ->update([
                        'exchange_rate' => $rate,
                        'updated_at' => $currentTimestamp,
                    ]);

                if ($affectedRows > 0) {
                    $this->line("Updated: {$code} to {$rate}");
                    $updatedCount++;
                } else {
                    $this->warn("Currency code not found or rate unchanged: {$code}");
                    $notFoundCount++;
                }
            } catch (\Exception $e) {
                $this->error("Error updating {$code}: " . $e->getMessage());
                Log::error("Currency update failed for {$code}: " . $e->getMessage());
            }
        }

        $this->info("\n--- Update Summary ---");
        $this->info("Successfully updated {$updatedCount} currencies.");
        if ($notFoundCount > 0) {
            $this->warn("{$notFoundCount} currency codes were not found or rates were already up-to-date.");
        }

        // Handling HRK (Croatian Kuna) - Obsolete
        $this->info("\n--- Special Handling for HRK (Croatian Kuna) ---");
        $hrkExists = DB::table('currencies')->where('code', 'HRK')->exists();
        if ($hrkExists) {
            $this->warn("HRK (Croatian Kuna) is obsolete and was replaced by EUR.");
            $this->warn("Consider removing HRK from your database or marking it as inactive.");
            $this->warn("Example: DB::table('currencies')->where('code', 'HRK')->delete();");
            $this->warn("Or: DB::table('currencies')->where('code', 'HRK')->update(['is_default' => 0, 'exchange_rate' => 0, 'updated_at' => \$currentTimestamp]); (if you have an 'is_active' column, set that to false)");
        } else {
            $this->info("HRK (Croatian Kuna) not found in the database, no action needed.");
        }
        // Check USD is_default status, if your previous default was IDR
        // And you want USD to be the primary reference.
        $defaultCurrency = DB::table('currencies')->where('is_default', 1)->first();
        if ($defaultCurrency && $defaultCurrency->code !== 'USD' && array_key_exists('USD', $latestRates)) {
             $this->warn("Your current default currency is {$defaultCurrency->code}. Consider if USD should be the default if it's your base for these rates.");
        }
         if ($defaultCurrency && $defaultCurrency->code === 'IDR' && $defaultCurrency->exchange_rate != $latestRates['IDR']) {
             $this->warn("Note: Your default currency IDR's exchange rate is also being updated. Ensure this is intended if your system relies on its 'is_default' status for base calculations differently.");
         }


        $this->info('Currency rate update process finished.');
        return Command::SUCCESS;
    }
}