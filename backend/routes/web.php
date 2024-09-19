<?php

use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmailController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('https://www.souvenirlilin.id');
    return view('welcome');
});

Route::get('/kirimemail', [EmailController::class, 'index']);

Route::get('/payments', function () {
    return Redirect::to('http://localhost:3000/store/orders');
});
