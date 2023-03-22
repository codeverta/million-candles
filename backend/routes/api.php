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
    Route::prefix('/-actions', function() {

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
    $server->resource('documents', '\\' . DocumentController::class)->actions('-actions', function ($actions) {
        $actions->post('upload');
    });
});
