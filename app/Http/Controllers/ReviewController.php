<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    /**
     * Simpan review produk dari order yang sudah selesai.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'body' => 'required|string|min:5',
        ]);

        $userId = Auth::id();

        // 1. Pastikan order ada, berstatus completed, dan milik user yang login
        $order = Order::query()
            ->where('id', $request->order_id)
            ->where('user_id', $userId)
            ->where('status', 'completed')
            ->first();

        if (!$order) {
            return redirect()->back()->with('message', 'Pemesanan tidak valid atau belum selesai.');
        }

        // 2. Pastikan produk tersebut ada di dalam order items
        $hasProduct = $order->items()
            ->where('product_id', $request->product_id)
            ->exists();

        if (!$hasProduct) {
            return redirect()->back()->with('message', 'Produk tidak ditemukan di pesanan ini.');
        }

        // 3. Pastikan user belum pernah mereview produk ini untuk order ini
        $alreadyReviewed = Review::query()
            ->where('user_id', $userId)
            ->where('order_id', $request->order_id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($alreadyReviewed) {
            return redirect()->back()->with('message', 'Anda sudah memberikan review untuk produk ini.');
        }

        // 4. Simpan review
        Review::create([
            'user_id' => $userId,
            'order_id' => $request->order_id,
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'body' => $request->body,
            'comment' => $request->body,
        ]);

        return redirect()->back()->with('message', 'Ulasan Anda berhasil dikirim!');
    }
}
