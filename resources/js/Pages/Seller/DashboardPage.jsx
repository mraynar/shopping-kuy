import React from 'react';
import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Package, ShoppingBag, TrendingUp, Clock, Tag, 
    ArrowRight, Calendar, User, ChevronRight, Store
} from 'lucide-react';

export default function SellerDashboardPage({ auth, shop, stats, recent_orders = [] }) {
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-amber-50 text-amber-700 border border-amber-200';
            case 'paid':
                return 'bg-blue-50 text-blue-700 border border-blue-200';
            case 'packing':
                return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
            case 'shipping':
                return 'bg-purple-50 text-purple-700 border border-purple-200';
            case 'completed':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'cancelled':
                return 'bg-rose-50 text-rose-700 border border-rose-200';
            default:
                return 'bg-zinc-50 text-zinc-700 border border-zinc-200';
        }
    };

    const formatStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'Belum Bayar';
            case 'paid': return 'Perlu Dikemas';
            case 'packing': return 'Sedang Dikemas';
            case 'shipping': return 'Dikirim';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Batal';
            default: return status || 'Unknown';
        }
    };

    return (
        <MarketplaceLayout auth={auth}>
            <Head title="Seller Dashboard | Shopping Kuy" />

            <div className="bg-[#F8F9FA] min-h-screen font-['Poppins'] py-8 md:py-12">
                <div className="max-w-[1200px] mx-auto px-4 md:px-6 space-y-8">
                    {/* Header Banner */}
                    <div className="bg-zinc-950 text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-20 -translate-y-20 blur-3xl"></div>
                        <div className="space-y-2 relative z-10">
                            <div className="flex items-center gap-2">
                                <Store className="w-5 h-5 text-white/70" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-white/70">Dashboard Penjual</span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Selamat Datang, {shop.shop_name}!</h1>
                            <p className="text-zinc-400 text-xs md:text-sm max-w-xl font-medium leading-relaxed">
                                Kelola penjualan Anda, unggah produk preloved terbaik, dan pantau performa toko preloved Anda secara real-time.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 shrink-0 relative z-10">
                            <Link 
                                href={route('products.index')}
                                className="bg-white text-zinc-950 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 transition-all active:scale-[0.98] shadow-md"
                            >
                                Kelola Produk
                            </Link>
                            <Link 
                                href="/seller/orders"
                                className="bg-white/10 text-white border border-white/20 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/25 transition-all active:scale-[0.98]"
                            >
                                Lihat Pesanan
                            </Link>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Stat 1: Revenue */}
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest">Pendapatan Selesai</p>
                                <h3 className="text-xl font-black text-zinc-950">Rp {stats.total_revenue.toLocaleString('id-ID')}</h3>
                                <p className="text-[9px] text-zinc-400 font-bold uppercase">Dari transaksi completed</p>
                            </div>
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Stat 2: Pending Revenue */}
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest">Pendapatan Tertunda</p>
                                <h3 className="text-xl font-black text-zinc-950">Rp {stats.pending_revenue.toLocaleString('id-ID')}</h3>
                                <p className="text-[9px] text-zinc-400 font-bold uppercase">Proses packing & kirim</p>
                            </div>
                            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Stat 3: Total Orders */}
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest">Total Pesanan</p>
                                <h3 className="text-xl font-black text-zinc-950">{stats.total_orders} Pesanan</h3>
                                <p className="text-[9px] text-zinc-400 font-bold uppercase">Semua riwayat masuk</p>
                            </div>
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Stat 4: Total Products */}
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest">Total Produk listed</p>
                                <h3 className="text-xl font-black text-zinc-950">{stats.total_products} Item</h3>
                                <p className="text-[9px] text-zinc-400 font-bold uppercase">Terdaftar di katalog</p>
                            </div>
                            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
                                <Tag className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Main Content Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Recent Orders Table */}
                        <div className="lg:col-span-8 bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-tight">Pesanan Terbaru</h2>
                                <Link 
                                    href="/seller/orders"
                                    className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors flex items-center gap-1"
                                >
                                    Semua Pesanan <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            {recent_orders.length === 0 ? (
                                <div className="p-12 text-center text-zinc-400 space-y-3">
                                    <ClipboardList className="w-12 h-12 mx-auto text-zinc-300" />
                                    <p className="text-xs uppercase font-bold">Belum Ada Pesanan Masuk</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-zinc-50/50 text-[10px] font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-105">
                                                <th className="p-5">No. Pesanan</th>
                                                <th className="p-5">Pembeli</th>
                                                <th className="p-5">Tanggal</th>
                                                <th className="p-5">Subtotal</th>
                                                <th className="p-5">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100">
                                            {recent_orders.map((order) => {
                                                const dateFormatted = new Date(order.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short'
                                                });
                                                const shopSubtotal = order.items.reduce((sum, item) => sum + (Number(item.price_at_purchase || item.price) * item.quantity), 0);

                                                return (
                                                    <tr key={order.id} className="hover:bg-zinc-50/20 transition-colors text-xs font-medium">
                                                        <td className="p-5">
                                                            <Link href="/seller/orders" className="font-bold text-zinc-950 hover:underline uppercase">
                                                                {order.order_number}
                                                            </Link>
                                                        </td>
                                                        <td className="p-5">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-zinc-800">{order.user?.name}</span>
                                                                <span className="text-[10px] text-zinc-400 mt-0.5">{order.user?.email}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-5 text-zinc-500">{dateFormatted}</td>
                                                        <td className="p-5 font-bold text-zinc-900">Rp {shopSubtotal.toLocaleString('id-ID')}</td>
                                                        <td className="p-5">
                                                            <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${getStatusStyle(order.status)}`}>
                                                                {formatStatusText(order.status)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Store info side card */}
                        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm space-y-6">
                            <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-tight">Status Toko Anda</h2>
                            <div className="border border-zinc-100 bg-zinc-50/50 p-5 rounded-2xl flex items-center gap-4">
                                <div className="p-3 bg-zinc-900 text-white rounded-xl">
                                    <Store className="w-6 h-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">{shop.shop_name}</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full ${shop.is_active ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase">{shop.is_active ? 'Aktif' : 'Non-aktif'}</span>
                                        <span>·</span>
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase">{shop.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-zinc-450 uppercase tracking-widest">Panduan Singkat Penjual</p>
                                <ul className="text-xs text-zinc-500 space-y-3 leading-relaxed list-disc list-inside">
                                    <li>Konfirmasi pesanan dengan status <span className="text-blue-600 font-bold">Perlu Dikemas</span> secepatnya.</li>
                                    <li>Siapkan barang untuk diserahkan ke kurir pengiriman pilihan pembeli.</li>
                                    <li>Input nomor resi pengiriman untuk memperbarui status pesanan menjadi <span className="text-purple-650 font-bold">Dalam Pengiriman</span>.</li>
                                    <li>Pastikan keaslian dan kondisi produk preloved sesuai deskripsi agar pembeli memberi review bintang 5!</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
