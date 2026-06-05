<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\TransactionsController;
use App\Http\Controllers\Auth\GoogleAuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/product/detail/{product}', [ProductController::class, 'show'])->name('product.detail');
Route::get('auth/google', [GoogleAuthController::class, 'redirectToGoogle'])->name('google.login');
Route::get('auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);
Route::get('/location/provinces', [LocationController::class, 'getProvinces']);
Route::get('/location/cities/{province_id}', [LocationController::class, 'getCities']);
Route::get('/location/districts/{city_id}', [LocationController::class, 'getDistricts']);
Route::get('/location/subdistricts/{district_id}', [LocationController::class, 'getSubDistricts']);

Route::post('/midtrans/notification', [TransactionsController::class, 'midtransNotification'])->name('midtrans.notification');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return redirect()->route('profile.index');
    });
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::post('/products/{product}/favourite', [ProductController::class, 'toggleFavourite'])->name('products.favourite');
    Route::post('/shop/register', [ShopController::class, 'store'])->name('shop.register');
    Route::post('/shop/auto-verify', [ShopController::class, 'autoVerify'])->name('shop.autoVerify');
    Route::get('/cart', [TransactionsController::class, 'cart'])->name('cart.index');
    Route::post('/cart', [TransactionsController::class, 'addToCart'])->name('cart.store');
    Route::delete('/cart/{id}', [TransactionsController::class, 'removeFromCart'])->name('cart.destroy');
    Route::get('/checkout', [TransactionsController::class, 'checkout'])->name('checkout.index');
    Route::post('/checkout', [TransactionsController::class, 'placeOrder'])->name('checkout.store');
    Route::get('/checkout/ongkir', [TransactionsController::class, 'getShippingCost'])->name('checkout.ongkir');
    Route::get('/success', [TransactionsController::class, 'success'])->name('checkout.success');
    Route::get('/orders', [TransactionsController::class, 'orders'])->name('orders.index');
    Route::get('/messages', function () {
        return Inertia::render('Messages/Index');
    })->name('messages');
});

require __DIR__ . '/auth.php';
