<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use LaravelJsonApi\Core\Responses\DataResponse;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;

class CurrencyController extends Controller
{
    use Actions\FetchMany;
    use Actions\FetchOne;
    use Actions\Store;
    use Actions\Update;
    use Actions\Destroy;

    /**
     * Update exchange rates from external API
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateRates()
    {
        try {
            // You can implement this using a currency exchange rate API
            // For example, using the Open Exchange Rates API
            $client = new \GuzzleHttp\Client();
            
            // Replace with your API key and preferred API
            $response = $client->get('https://api.exchangerate-api.com/v4/latest/USD');
            $data = json_decode($response->getBody(), true);
            
            if (isset($data['rates'])) {
                foreach ($data['rates'] as $code => $rate) {
                    Currency::updateOrCreate(
                        ['code' => $code],
                        [
                            'name' => $code, // You might want to add a mapping for full names
                            'symbol' => $this->getSymbolForCurrency($code),
                            'exchange_rate' => $rate,
                            'is_default' => $code === 'USD',
                        ]
                    );
                }
                
                return response()->json([
                    'message' => 'Exchange rates updated successfully',
                    'timestamp' => $data['time_last_updated'] ?? now()->timestamp,
                ]);
            }
            
            return response()->json(['error' => 'Failed to parse exchange rate data'], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    /**
     * Get currency symbol for a currency code
     *
     * @param string $code
     * @return string
     */
    private function getSymbolForCurrency(string $code): string
    {
        $symbols = [
            'USD' => '$',
            'EUR' => '€',
            'GBP' => '£',
            'JPY' => '¥',
            'CNY' => '¥',
            'INR' => '₹',
            // Add more as needed
        ];
        
        return $symbols[$code] ?? $code;
    }
}