<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\OrderCreated;
use App\Http\Controllers\Controller;
use App\JsonApi\V1\Orders\OrderQuery;
use App\JsonApi\V1\Orders\OrderRequest;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Facades\DB;
use LaravelJsonApi\Core\Responses\DataResponse;

class OrderController extends Controller
{

    use Actions\FetchMany;
    use Actions\FetchOne;
    use Actions\Store;
    use Actions\Update;
    use Actions\Destroy;
    use Actions\FetchRelated;
    use Actions\FetchRelationship;
    use Actions\UpdateRelationship;
    use Actions\AttachRelationship;
    use Actions\DetachRelationship;

    public function __construct()
    {
        // Set your Merchant Server Key
        Config::$serverKey = config('midtrans.MIDTRANS_SERVER_KEY');
        // Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
        Config::$isProduction = config('midtrans.MIDTRANS_IS_PRODUCTION');
        // Set sanitization on (default)
        Config::$isSanitized = config('midtrans.MIDTRANS_IS_SANITIZED');
        // Set 3DS transaction for credit card to true
        Config::$is3ds = config('midtrans.MIDTRANS_IS_3DS');
    }

    public function creating(OrderRequest $request, OrderQuery $query): void
    {
        $user = Auth::user();
        Order::creating(function (Order $order) use ($user)
        {
            $order->order_type =  $user->getRoleNames()->first() == "merchant" ? "sell" : "buy";
        });
    }

    public function created(Order $order): void
    {
        OrderCreated::dispatch($order);
    }

    public function updating(Order $order, OrderRequest $request, OrderQuery $query): void
    {
        // do something only on updating...
        if(isset($request->data['attributes']['is_validate_buyer']) && $request->data['attributes']['payments_type'] == "midtrans") {
            // compute amount
            $user = Auth::user();
            $total_price = (int) $order->price_amount;
            $orderDetails = $order->orderDetails()->get();
            $snap_token = '';

            if($total_price <= 0) {
                dd("Harga Tidak boleh kurang dari atau sama dengan 0");
            }

            // Required
            $transaction_details = array(
                'order_id' => $order->id,
                'gross_amount' => $total_price, // no decimal allowed for creditcard
            );

            // dd($transaction_details);

            $item_details = [];
            foreach ($orderDetails as $key => $orderDetail) {
                $item_details[] = array(
                    'id' => $orderDetail->id,
                    'price' => $orderDetail->price,
                    'quantity' => $orderDetail->qty,
                    'name' => $orderDetail->products->name
                );
            }

            $customer_details = array(
                'first_name'    => $user->name,
                'email'         => $user->email
            );

            // Fill transaction details
            $transaction = array(
                'transaction_details' => $transaction_details,
                'item_details' => $item_details,
                'customer_details' => $customer_details,
            );


            try {
                $snap_token = Snap::getSnapToken($transaction);

                Order::updating(function (Order $model) use ($snap_token, $total_price) {
                    $model->snap_token = $snap_token;
                    $model->is_validate_buyer = true;
                });
            } catch (\Exception $e) {
             	dd($e);  
		dd($e->getMessage());
            }
            Order::creating(function ($model) use ($total_price, $snap_token)
            {
                $model->price_amount = (int) $total_price;
                $model->snap_token = $snap_token;
            });
        }
    }

    public function totalSales(Request $request)
    {
        $validatedData = $request->validate([
            'start_date' => 'required',
            'end_date' => 'required'
        ]);

        $startDate = $validatedData['start_date'];
        $endDate = $validatedData['end_date'];
        $total = DB::table('orders')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('price_amount');

        return response()->json((int) $total);
    }

    public function searchOrder(Request $request)
    {
        $validatedData = $request->validate([
            'code' => 'required',
        ]);
        $result = DB::table('orders')
        ->leftJoin('order_details', 'orders.id', '=', 'order_details.orders_id')
        ->where('code', '=', $validatedData['code'])->get();

        return response()->json($result);
    }

    public function midtransWebhook(Request $request) {
        $input = $request->all();
        OrderCreated::dispatch($input);
    }




    public function storeOrderFromLandingPage(Request $request)
    {
        // Validate input including order details
        $validated = $request->validate([
            'code' => 'required|string|max:255',
            'order_type' => 'required|in:buy,sell',
            'airwaybill' => 'nullable|string|max:255',
            'snap_token' => 'nullable|string|max:255',
            'buyer_name' => 'nullable|string|max:255',
            'payments_type' => 'nullable|in:cash,transfer,midtrans',
            'is_validate_buyer' => 'nullable|boolean',
            'is_validate_seller' => 'nullable|boolean',
            'is_shipping' => 'nullable|boolean',
            'is_shipped' => 'nullable|boolean',
            'is_received' => 'nullable|boolean',
            'address' => 'nullable|string|max:255',
            'price_amount' => 'required|integer|min:0',
            'origin_user_id' => 'required|integer|exists:users,id',
            'destination_user_id' => 'nullable|integer|exists:users,id',
            'discount' => 'nullable|numeric',
            'shipping_cost' => 'nullable|numeric',
            'discount_type' => 'nullable|string|max:255',
            'down_payment' => 'nullable|numeric',
            'remaining_payment' => 'nullable|numeric',
            
            // Order details validation
            'order_details' => 'required|array|min:1',
            'order_details.*.product_id' => 'required|integer|exists:products,id',
            'order_details.*.qty' => 'required|integer|min:1',
            'order_details.*.price' => 'required|numeric|min:0',
            'order_details.*.notes' => 'nullable|string|max:255',
        ]);

        // Validate products and calculate total
        $validationResult = $this->validateProductsAndCalculateTotal($validated['order_details']);
        if (!$validationResult['success']) {
            return response()->json([
                'message' => 'Product validation failed',
                'errors' => $validationResult['errors']
            ], 422);
        }

        // Check if calculated total matches provided price_amount
        $calculatedTotal = $validationResult['calculated_total'];
        $providedTotal = $validated['price_amount'];
        
        // Allow for discount and shipping cost adjustments
        $adjustedTotal = $calculatedTotal;
        if (isset($validated['discount']) && $validated['discount'] > 0) {
            $adjustedTotal -= $validated['discount'];
        }
        if (isset($validated['shipping_cost']) && $validated['shipping_cost'] > 0) {
            $adjustedTotal += $validated['shipping_cost'];
        }

        if (abs($adjustedTotal - $providedTotal) > 0.01) { // Allow small floating point differences
            return response()->json([
                'message' => 'Price amount mismatch',
                'errors' => [
                    'price_amount' => [
                        "Provided price amount ({$providedTotal}) doesn't match calculated total ({$adjustedTotal})",
                        "Calculated from products: {$calculatedTotal}",
                        "Discount: " . ($validated['discount'] ?? 0),
                        "Shipping cost: " . ($validated['shipping_cost'] ?? 0)
                    ]
                ]
            ], 422);
        }

        DB::beginTransaction();
        
        try {
            // Create order
            $order = Order::create([
                'uuid' => (string) Str::uuid(),
                'code' => $validated['code'],
                'order_type' => $validated['order_type'],
                'airwaybill' => $validated['airwaybill'] ?? null,
                'snap_token' => null, // Will be set later if using Midtrans
                'buyer_name' => $validated['buyer_name'] ?? null,
                'payments_type' => $validated['payments_type'] ?? null,
                'is_validate_buyer' => $validated['is_validate_buyer'] ?? 0,
                'is_validate_seller' => $validated['is_validate_seller'] ?? 0,
                'is_shipping' => $validated['is_shipping'] ?? 0,
                'is_shipped' => $validated['is_shipped'] ?? 0,
                'is_received' => $validated['is_received'] ?? 0,
                'address' => $validated['address'] ?? null,
                'price_amount' => $validated['price_amount'],
                'origin_user_id' => $validated['origin_user_id'],
                'destination_user_id' => $validated['destination_user_id'] ?? null,
                'discount' => $validated['discount'] ?? null,
                'shipping_cost' => $validated['shipping_cost'] ?? null,
                'discount_type' => $validated['discount_type'] ?? null,
                'down_payment' => $validated['down_payment'] ?? null,
                'remaining_payment' => $validated['remaining_payment'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create order details using validated product prices
            $orderDetails = [];
            $products = $validationResult['products'];
            
            foreach ($validated['order_details'] as $detailData) {
                $product = $products->get($detailData['product_id']);
                
                $orderDetail = OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $detailData['product_id'],
                    'qty' => $detailData['qty'],
                    'price' => $product->price, // Use actual product price for consistency
                    'notes' => $detailData['notes'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $orderDetails[] = $orderDetail;

                // Update product stock and amount_sold
                $product->decrement('stock', $detailData['qty']);
                $product->increment('amount_sold', $detailData['qty']);
            }

            // Generate Snap Token if payment type is Midtrans
            $snap_token = null;
            if ($validated['payments_type'] === 'midtrans') {
                $snap_token = $this->generateSnapToken($order, $orderDetails, $validated);
                
                // Update order with snap token
                $order->update(['snap_token' => $snap_token]);
            }

            DB::commit();

            // Dispatch order created event
            OrderCreated::dispatch($order);

            return response()->json([
                'message' => 'Order created successfully!',
                'data' => [
                    'order' => $order->fresh(),
                    'order_details' => $orderDetails,
                    'snap_token' => $snap_token,
                    'price_breakdown' => [
                        'subtotal' => $calculatedTotal,
                        'discount' => $validated['discount'] ?? 0,
                        'shipping_cost' => $validated['shipping_cost'] ?? 0,
                        'total' => $validated['price_amount']
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate products pricing, stock, and calculate total
     */
    private function validateProductsAndCalculateTotal(array $orderDetails)
    {
        $errors = [];
        $calculatedTotal = 0;
        $productIds = array_column($orderDetails, 'product_id');
        
        // Get all products in one query for efficiency
        $products = \App\Models\Product::whereIn('id', $productIds)
            ->whereNull('deleted_at') // Only active products
            ->get()
            ->keyBy('id');

        foreach ($orderDetails as $index => $detail) {
            $productId = $detail['product_id'];
            $requestedQty = $detail['qty'];
            $requestedPrice = $detail['price'];

            // Check if product exists and is not deleted
            if (!$products->has($productId)) {
                $errors["order_details.{$index}.product_id"] = [
                    "Product with ID {$productId} not found or has been deleted"
                ];
                continue;
            }

            $product = $products->get($productId);

            // Check stock availability
            if ($product->stock < $requestedQty) {
                $errors["order_details.{$index}.qty"] = [
                    "Insufficient stock for product '{$product->name}'. Available: {$product->stock}, Requested: {$requestedQty}"
                ];
            }

            // Check if price matches product price
            $productPrice = (float) $product->price;
            $requestedPriceFloat = (float) $requestedPrice;
            
            if (abs($productPrice - $requestedPriceFloat) > 0.01) { // Allow small floating point differences
                $errors["order_details.{$index}.price"] = [
                    "Price mismatch for product '{$product->name}'. Expected: {$productPrice}, Provided: {$requestedPrice}"
                ];
            }

            // Calculate total (use product price for accuracy)
            $calculatedTotal += $productPrice * $requestedQty;
        }

        return [
            'success' => empty($errors),
            'errors' => $errors,
            'calculated_total' => $calculatedTotal,
            'products' => $products
        ];
    }

    /**
     * Generate Midtrans Snap Token
     */
    private function generateSnapToken(Order $order, array $orderDetails, array $validated)
    {
        try {
            $total_price = (int) $validated['price_amount'];

            if ($total_price <= 0) {
                throw new \Exception("Price amount must be greater than 0");
            }

            // Transaction details
            $transaction_details = [
                'order_id' => $order->code, // Use order code as transaction ID
                'gross_amount' => $total_price,
            ];

            // Item details from order details
            $item_details = [];
            foreach ($orderDetails as $orderDetail) {
                // Load product relationship if not already loaded
                $product = $orderDetail->product ?? \App\Models\Product::find($orderDetail->product_id);
                
                $item_details[] = [
                    'id' => $orderDetail->product_id,
                    'price' => (int) $orderDetail->price,
                    'quantity' => (int) $orderDetail->qty,
                    'name' => $product ? $product->name : 'Product #' . $orderDetail->product_id
                ];
            }

            // Add discount as negative item if applicable
            if (isset($validated['discount']) && $validated['discount'] > 0) {
                $item_details[] = [
                    'id' => 'DISCOUNT',
                    'price' => -(int) $validated['discount'],
                    'quantity' => 1,
                    'name' => 'Discount'
                ];
            }

            // Add shipping cost as separate item if applicable
            if (isset($validated['shipping_cost']) && $validated['shipping_cost'] > 0) {
                $item_details[] = [
                    'id' => 'SHIPPING',
                    'price' => (int) $validated['shipping_cost'],
                    'quantity' => 1,
                    'name' => 'Shipping Cost'
                ];
            }

            // Customer details
            $originUser = \App\Models\User::find($validated['origin_user_id']);
            $customer_details = [
                'first_name' => $validated['buyer_name'] ?? $originUser->name ?? 'Customer',
                'email' => $originUser->email ?? 'customer@example.com'
            ];

            // Optional: Add billing and shipping address if available
            if (!empty($validated['address'])) {
                $customer_details['billing_address'] = [
                    'address' => $validated['address'],
                ];
                $customer_details['shipping_address'] = [
                    'address' => $validated['address'],
                ];
            }

            // Build transaction array
            $transaction = [
                'transaction_details' => $transaction_details,
                'item_details' => $item_details,
                'customer_details' => $customer_details,
            ];

            // Get snap token from Midtrans
            $snap_token = Snap::getSnapToken($transaction);

            return $snap_token;

        } catch (\Exception $e) {
            throw new \Exception('Failed to generate Snap token: ' . $e->getMessage());
        }
    }
}
