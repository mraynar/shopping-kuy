<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminShopController extends Controller
{
    /**
     * Tampilkan daftar toko dengan filter status.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');

        $query = Shop::query()->with('user');

        if ($status && in_array($status, ['pending', 'verified', 'rejected'])) {
            $query->where('status', $status);
        }

        $shops = $query->latest()->get();

        return Inertia::render('Admin/ShopsPage', [
            'shops' => $shops,
            'filters' => [
                'status' => $status ?? 'all',
            ],
        ]);
    }

    /**
     * Setujui pendaftaran toko.
     */
    public function approve(Shop $shop): RedirectResponse
    {
        $shop->update([
            'status' => 'verified',
            'is_active' => true,
        ]);

        return back()->with('message', "Toko {$shop->shop_name} berhasil diverifikasi.");
    }

    /**
     * Tolak pendaftaran toko.
     */
    public function reject(Shop $shop): RedirectResponse
    {
        $shop->update([
            'status' => 'rejected',
            'is_active' => false,
        ]);

        return back()->with('message', "Pendaftaran toko {$shop->shop_name} telah ditolak.");
    }
}
