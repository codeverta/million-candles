<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\OrderCreated;
use App\Http\Controllers\Controller;
use App\JsonApi\V1\Orders\OrderQuery;
use App\JsonApi\V1\Orders\OrderRequest;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use LaravelJsonApi\Laravel\Http\Controllers\Actions;
use Midtrans\Config;
use Midtrans\Snap;

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
                dd($e->getMessage());
            }
            Order::creating(function ($model) use ($total_price, $snap_token)
            {
                $model->price_amount = (int) $total_price;
                $model->snap_token = $snap_token;
            });
        }
    }
}
