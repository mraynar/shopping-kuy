<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SellerController extends Controller
{
    /**
     * Tampilkan halaman order masuk untuk seller.
     */
    public function orders(): Response|RedirectResponse
    {
        $user = Auth::user();
        $shop = $user->shop;

        if (!$shop) {
            return redirect()->route('home')->with('message', 'Anda belum memiliki toko.');
        }

        // Ambil order yang memiliki item dari toko ini
        $orders = Order::query()
            ->whereHas('items.product', function ($query) use ($shop) {
                $query->where('shop_id', $shop->id);
            })
            ->with([
                'items' => function ($query) use ($shop) {
                    $query->whereHas('product', function ($q) use ($shop) {
                        $q->where('shop_id', $shop->id);
                    })->with('product');
                },
                'user'
            ])
            ->latest()
            ->get();

        return Inertia::render('Seller/OrdersPage', [
            'orders' => $orders,
            'shop' => $shop
        ]);
    }

    /**
     * Update status order (packing, shipping, completed, cancelled).
     */
    public function updateOrderStatus(Request $request, Order $order): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:pending,paid,packing,shipping,completed,cancelled'
        ]);

        $user = Auth::user();
        $shop = $user->shop;

        if (!$shop) {
            return redirect()->back()->with('message', 'Akses ditolak.');
        }

        // Pastikan order ini memiliki item yang berasal dari toko milik seller ini
        $hasProduct = $order->items()->whereHas('product', function ($query) use ($shop) {
            $query->where('shop_id', $shop->id);
        })->exists();

        if (!$hasProduct) {
            return redirect()->back()->with('message', 'Akses ditolak.');
        }

        $order->status = $request->status;
        $order->save();

        return redirect()->back()->with('message', 'Status pesanan berhasil diperbarui.');
    }
}
