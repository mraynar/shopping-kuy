<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/provinces', [ShopController::class, 'getProvinces']);
Route::get('/cities/{province_id}', [ShopController::class, 'getCities']);
Route::get('/districts/{city_id}', [ShopController::class, 'getDistricts']);
Route::get('/sub-districts/{district_id}', [ShopController::class, 'getSubDistricts']); 
