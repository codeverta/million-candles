<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use LaravelJsonApi\Laravel\Facades\JsonApiRoute;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
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

Route::post('/tokens/create', function (Request $request) {
    $token = $request->user()->createToken($request->token_name);

    return ['token' => $token->plainTextToken];
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

JsonApiRoute::server('v1')->prefix('v1')->resources(function ($server) {

    $server->resource('product-categories', JsonApiController::class)
    ->relationships(function ($relations) {
        $relations->hasMany('products')->readOnly();
    });
    $server->resource('products', JsonApiController::class)
    ->only('index', 'show', 'store')
    ->relationships(function ($relations) {
           $relations->hasOne('product-categories')->readOnly();
       });;
});