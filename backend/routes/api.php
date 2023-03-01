<?php

use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ProductController;
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

    $server->resource('users', JsonApiController::class)
    ->relationships(function ($relations) {
        $relations->hasOne('documents')->readOnly();
    });
    $server->resource('orders', OrderController::class);
    $server->resource('order-details', JsonApiController::class);
    $server->resource('documents', '\\' . DocumentController::class)->actions('-actions', function ($actions) {
        $actions->post('upload');
    });
});