import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, Store, ShoppingBag, TrendingUp, Calendar, 
    ClipboardList, ChevronRight, CheckCircle, Clock
} from 'lucide-react';

export default function AdminDashboardPage({ auth, stats, recent_orders = [] }) {
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
            case 'paid': return 'Dibayar';
            case 'packing': return 'Sedang Dikemas';
            case 'shipping': return 'Dalam Pengiriman';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status || 'Unknown';
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Admin Dashboard | Control Panel" />

            <div className="space-y-8">
                {/* Header Title */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-950">Dashboard Admin</h1>
                    <p className="text-zinc-500 text-xs md:text-sm font-medium mt-0.5 uppercase tracking-wide">Ringkasan performa platform Shopping Kuy</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stat Card 1: Users */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200/85 shadow-sm flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Pengguna</p>
                            <h3 className="text-2xl font-black text-zinc-950">{stats.total_users.toLocaleString('id-ID')}</h3>
                            <p className="text-[9px] text-zinc-400 font-bold uppercase">Terdaftar di platform</p>
                        </div>
                        <div className="p-4 bg-zinc-100 text-zinc-900 rounded-2xl shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Stat Card 2: Shops */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200/85 shadow-sm flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Toko</p>
                            <h3 className="text-2xl font-black text-zinc-950">{stats.total_shops.toLocaleString('id-ID')}</h3>
                            <p className="text-[9px] text-zinc-400 font-bold uppercase">Seller preloved</p>
                        </div>
                        <div className="p-4 bg-zinc-100 text-zinc-900 rounded-2xl shrink-0">
                            <Store className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Stat Card 3: Orders */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200/85 shadow-sm flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Pesanan</p>
                            <h3 className="text-2xl font-black text-zinc-950">{stats.total_orders.toLocaleString('id-ID')}</h3>
                            <p className="text-[9px] text-zinc-400 font-bold uppercase">Seluruh transaksi</p>
                        </div>
                        <div className="p-4 bg-zinc-100 text-zinc-900 rounded-2xl shrink-0">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Stat Card 4: Revenue */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200/85 shadow-sm flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Pendapatan</p>
                            <h3 className="text-2xl font-black text-zinc-950">Rp {stats.total_revenue.toLocaleString('id-ID')}</h3>
                            <p className="text-[9px] text-zinc-400 font-bold uppercase">Transaksi selesai</p>
                        </div>
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Recent Orders Section */}
                <div className="bg-white rounded-3xl border border-zinc-200/85 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-tight">Pesanan Terbaru Platform</h2>
                    </div>

                    {recent_orders.length === 0 ? (
                        <div className="p-12 text-center text-zinc-400 space-y-3">
                            <ClipboardList className="w-12 h-12 mx-auto text-zinc-300" />
                            <p className="text-xs uppercase font-bold">Belum Ada Transaksi Masuk</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50/50 text-[10px] font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                                        <th className="p-5">No. Pesanan</th>
                                        <th className="p-5">Pelanggan</th>
                                        <th className="p-5">Tanggal</th>
                                        <th className="p-5">Total Transaksi</th>
                                        <th className="p-5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {recent_orders.map((order) => {
                                        const dateFormatted = new Date(order.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        });

                                        return (
                                            <tr key={order.id} className="hover:bg-zinc-50/20 transition-colors text-xs font-medium">
                                                <td className="p-5 font-bold text-zinc-950 uppercase tracking-tight">
                                                    {order.order_number}
                                                </td>
                                                <td className="p-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-zinc-800">{order.user?.name}</span>
                                                        <span className="text-[10px] text-zinc-400 mt-0.5">{order.user?.email}</span>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-zinc-500">{dateFormatted}</td>
                                                <td className="p-5 font-bold text-zinc-900">Rp {Number(order.total_amount).toLocaleString('id-ID')}</td>
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
            </div>
        </AdminLayout>
    );
}
