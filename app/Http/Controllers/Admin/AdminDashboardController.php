<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Shop;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Tampilkan halaman dashboard utama untuk admin.
     */
    public function index(): Response
    {
        $totalUsers = User::count();
        $totalShops = Shop::count();
        $totalOrders = Order::count();
        
        // Revenue dihitung dari total order yang berstatus completed
        $totalRevenue = Order::query()
            ->where('status', 'completed')
            ->sum('total_amount');

        // Ambil 5 order terbaru
        $recentOrders = Order::query()
            ->with('user')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/DashboardPage', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_shops' => $totalShops,
                'total_orders' => $totalOrders,
                'total_revenue' => (int) $totalRevenue,
            ],
            'recent_orders' => $recentOrders,
        ]);
    }
}
