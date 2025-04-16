<?php

use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use LaravelJsonApi\Laravel\Facades\JsonApiRoute;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\API\FinancialApiController;
use App\Http\Controllers\API\StockApiController;
use App\Http\Controllers\API\MaterialController;
use App\Http\Controllers\API\MaterialStockMovementController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('/v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot', [AuthController::class, 'forgot']);
    Route::post('/auth/reset', [AuthController::class, 'reset']);
    Route::get('/auth/self', [AuthController::class, 'me'])->middleware('auth:sanctum');
    Route::get('/notifications', [NotificationController::class, 'index'])->middleware('auth:sanctum');
    Route::prefix('/-actions')->group(function () {
        Route::get('/totalSales', [OrderController::class, 'totalSales']);
        Route::get('/searchOrder', [OrderController::class, 'searchOrder'])->middleware('throttle:5,1');
        Route::post('/midtransWebhook', [OrderController::class, 'midtransWebhook']);
        Route::delete('/documents/{id}', [DocumentController::class, 'deleting']);
    });
});

JsonApiRoute::server('v1')->prefix('v1')->resources(function ($server) {
    $server->resource('product-categories', JsonApiController::class)
    ->relationships(function ($relations) {
        $relations->hasMany('products')->readOnly();
    });


    $server->resource('products', '\\' . ProductController::class)
    ->relationships(function ($relations) {
           $relations->hasOne('product-categories')->readOnly();
       });

    $server->resource('provinces', JsonApiController::class)
    ->relationships(function ($relations) {
        $relations->hasMany('regencies')->readOnly();
    });

    $server->resource('users', UserController::class)
    ->relationships(function ($relations) {
        $relations->hasOne('documents')->readOnly();
    });
    $server->resource('orders', OrderController::class)
    ->relationships(function ($relations)
    {
        $relations->hasOne('destination-users')->readOnly();
        $relations->hasOne('origin-users')->readOnly();
    });
    $server->resource('order-details', JsonApiController::class);
    $server->resource('carts', JsonApiController::class);
    $server->resource(
    'product-variants', JsonApiController::class);
    $server->resource('product-variant-options', JsonApiController::class);
    $server->resource('documents', JsonApiController::class)->only('index');
    $server->resource('documents', '\\' . DocumentController::class)->actions('-actions', function ($actions) {
        $actions->post('upload');
    });
});

// Financial API Routes
Route::prefix('v1/financial')->group(function () {
    // Get transactions with date filtering
    Route::get('/transactions', [FinancialApiController::class, 'getTransactions']);
    
    // Get bank account summary
    Route::get('/bank-accounts', [FinancialApiController::class, 'getBankAccounts']);
    
    // Get financial summary
    Route::get('/summary', [FinancialApiController::class, 'getSummary']);
    
    // Create new transaction
    Route::post('/transactions', [FinancialApiController::class, 'storeTransaction']);
});

// Stock API Routes
Route::prefix('v1/inventory')->group(function () {
    // Get stock movements with date filtering
    Route::get('/movements', [StockApiController::class, 'getStockMovements']);
    
    // Get product stock levels
    Route::get('/stock-levels', [StockApiController::class, 'getStockLevels']);
    
    // Create new stock movement
    Route::post('/movements', [StockApiController::class, 'storeStockMovement']);
});

Route::apiResource('materials', MaterialController::class);
Route::post('material-stock-movements', [MaterialStockMovementController::class, 'store']);


Route::post('/midtrans-webhook', function (Request $request) {
    // Log the request for debugging
    Log::info('Midtrans Webhook:', $request->all());

    // Extract necessary details from Midtrans webhook payload
    $data = $request->all();
    $orderId = $data['order_id'] ?? 'N/A';
    $status = $data['transaction_status'] ?? 'unknown';
    $amount = $data['gross_amount'] ?? '0';
    $currency = $data['currency'] ?? 'IDR';

    // Construct the message for Discord
    $message = "**Midtrans Payment Notification**\n".
               "📌 **Order ID:** `$orderId`\n".
               "💰 **Amount:** `$amount $currency`\n".
               "✅ **Status:** `$status`";

    // Discord webhook URL
    $webhookUrl = "https://discord.com/api/webhooks/1355898882441084928/1BqM1rbFDgkd6NFvxsxQct-kgqaV01Fd67bUGXBJKgvzy3Zo8iQD5EglAyEZd7bFi5dD";

    // Send message to Discord webhook
    Http::post($webhookUrl, [
        'content' => $message
    ]);

    return response()->json(['message' => 'Notification sent to Discord'], 200);
});