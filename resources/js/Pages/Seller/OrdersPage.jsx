import React, { useState } from 'react';
import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ChevronDown, ChevronUp, Package, Truck, Calendar, 
    MapPin, ClipboardList, User, AlertCircle, Loader2, Check, Send
} from 'lucide-react';

export default function SellerOrdersPage({ auth, orders = [], shop }) {
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [orderForWaybill, setOrderForWaybill] = useState(null);
    const [waybillInput, setWaybillInput] = useState('');
    const [isSubmittingWaybill, setIsSubmittingWaybill] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    const handleUpdateStatus = (orderId, newStatus) => {
        setUpdatingId(orderId);
        setIsUpdatingStatus(true);
        router.post(`/seller/orders/${orderId}/status`, {
            status: newStatus
        }, {
            onFinish: () => {
                setUpdatingId(null);
                setIsUpdatingStatus(false);
            }
        });
    };

    const handleSubmitWaybill = (e) => {
        e.preventDefault();
        if (!waybillInput.trim()) return;

        setIsSubmittingWaybill(true);
        router.post(`/seller/orders/${orderForWaybill}/waybill`, {
            waybill: waybillInput
        }, {
            onSuccess: () => {
                setOrderForWaybill(null);
                setWaybillInput('');
            },
            onFinish: () => {
                setIsSubmittingWaybill(false);
            }
        });
    };

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

    // Filter orders
    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'all') return true;
        return order.status?.toLowerCase() === statusFilter.toLowerCase();
    });

    const filterTabs = [
        { id: 'all', label: 'Semua' },
        { id: 'paid', label: 'Perlu Dikemas' },
        { id: 'packing', label: 'Sedang Dikemas' },
        { id: 'shipping', label: 'Dikirim' },
        { id: 'completed', label: 'Selesai' },
        { id: 'cancelled', label: 'Dibatalkan' }
    ];

    return (
        <MarketplaceLayout auth={auth}>
            <Head title="Pesanan Masuk | Seller Center" />

            <div className="bg-[#F8F9FA] min-h-screen font-['Poppins'] py-8 md:py-12">
                <div className="max-w-[1100px] mx-auto px-4 md:px-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-zinc-900 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">Seller Center</span>
                                <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wide">/ {shop.shop_name}</h2>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-950 mt-1">Pesanan Masuk</h1>
                            <p className="text-zinc-500 text-xs md:text-sm font-medium mt-0.5 uppercase tracking-wide">Kelola orderan produk dari pelanggan toko Anda</p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide border-b border-zinc-200">
                        {filterTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap border-2 ${statusFilter === tab.id ? 'bg-zinc-950 border-zinc-950 text-white shadow-md' : 'bg-white border-transparent text-zinc-500 hover:text-zinc-950'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-12 text-center space-y-4">
                            <ClipboardList className="w-16 h-16 text-zinc-300 mx-auto" strokeWidth={1.5} />
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-zinc-900 uppercase">Belum Ada Pesanan</h3>
                                <p className="text-zinc-400 text-xs max-w-sm mx-auto leading-relaxed uppercase">
                                    Pesanan dari pembeli dengan status yang dipilih akan muncul di sini.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => {
                                const isExpanded = expandedOrderId === order.id;
                                const dateFormatted = new Date(order.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                });

                                // Hitung total dari produk toko ini saja
                                const shopSubtotal = order.items.reduce((sum, item) => sum + (Number(item.price_at_purchase || item.price) * item.quantity), 0);

                                return (
                                    <div key={order.id} className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden transition-all duration-200">
                                        {/* Header Accordion */}
                                        <div 
                                            onClick={() => toggleExpand(order.id)}
                                            className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/50 transition-colors select-none"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                                <div className="p-3 bg-zinc-100 rounded-xl text-zinc-800 hidden sm:block shrink-0">
                                                    <Package className="w-6 h-6" />
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-xs font-black text-zinc-900 uppercase tracking-tight">{order.order_number}</span>
                                                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                                                            {formatStatusText(order.status)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {dateFormatted}</span>
                                                        <span>·</span>
                                                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {order.user?.name}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Subtotal & Action */}
                                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-zinc-100">
                                                <div className="text-left md:text-right">
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Subtotal Toko</p>
                                                    <p className="text-sm font-black text-zinc-900">Rp {shopSubtotal.toLocaleString('id-ID')}</p>
                                                </div>
                                                <div className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500">
                                                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detail Accordion */}
                                        {isExpanded && (
                                            <div className="px-5 pb-5 md:px-6 md:pb-6 border-t border-zinc-100 bg-zinc-50/20 divide-y divide-zinc-100 animate-in fade-in slide-in-from-top-1 duration-150">
                                                {/* Buyer info */}
                                                <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-3">
                                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Informasi Pembeli & Pengiriman</p>
                                                        <div className="space-y-2 text-xs">
                                                            <div className="flex gap-2 items-start text-zinc-650">
                                                                <User className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <p className="font-bold text-zinc-800 uppercase">{order.user?.name}</p>
                                                                    <p className="text-[10px] text-zinc-500 font-medium mt-0.5">{order.user?.email} {order.user?.phone && `· ${order.user?.phone}`}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 items-start text-zinc-650 pt-1">
                                                                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <p className="font-bold text-zinc-800 uppercase">Alamat Pengiriman</p>
                                                                    <p className="text-[11px] text-zinc-500 leading-relaxed font-medium mt-0.5 uppercase">{order.shipping_address}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Layanan Pengiriman & Resi</p>
                                                        <div className="space-y-2 text-xs">
                                                            <div className="flex gap-2 items-start text-zinc-650">
                                                                <Truck className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <p className="font-bold text-zinc-800 uppercase">{order.courier} - {order.service}</p>
                                                                    <p className="text-[10px] text-zinc-500 font-bold mt-0.5">Ongkir Keseluruhan: Rp {Number(order.shipping_cost).toLocaleString('id-ID')}</p>
                                                                </div>
                                                            </div>
                                                            <div className="pt-1">
                                                                {order.waybill ? (
                                                                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-[10px] font-bold uppercase inline-block">
                                                                        No. Resi: <span className="font-mono">{order.waybill}</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 rounded-xl text-[10px] font-bold uppercase inline-block">
                                                                        Resi Belum Diinput
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Items */}
                                                <div className="py-4 space-y-4">
                                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Produk Toko Anda</p>
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex gap-4 items-start py-1">
                                                            <img
                                                                src={item.product?.thumbnail ? (item.product.thumbnail.startsWith('http') ? item.product.thumbnail : `/storage/${item.product.thumbnail}`) : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'}
                                                                className="w-12 h-16 object-cover rounded-lg border border-zinc-200 bg-white shrink-0" 
                                                                alt={item.product?.name}
                                                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'; }}
                                                            />
                                                            <div className="flex-grow min-w-0">
                                                                <h4 className="text-xs font-bold text-zinc-900 uppercase leading-snug line-clamp-1">{item.product?.name || 'Produk'}</h4>
                                                                <p className="text-[10px] text-zinc-550 font-bold uppercase mt-1">
                                                                    Qty: {item.quantity} · Rp {Number(item.price_at_purchase || item.price).toLocaleString('id-ID')} / item
                                                                </p>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <p className="text-xs font-bold text-zinc-900">
                                                                    Rp {(Number(item.price_at_purchase || item.price) * item.quantity).toLocaleString('id-ID')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Actions */}
                                                <div className="py-4 flex flex-wrap items-center justify-between gap-4">
                                                    <div className="text-xs text-zinc-500 font-bold uppercase">
                                                        Subtotal: <span className="text-zinc-900 font-black">Rp {shopSubtotal.toLocaleString('id-ID')}</span>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        {order.status === 'paid' && (
                                                            <button
                                                                disabled={isUpdatingStatus}
                                                                onClick={() => handleUpdateStatus(order.id, 'packing')}
                                                                className="px-4 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-2"
                                                            >
                                                                {updatingId === order.id && isUpdatingStatus ? (
                                                                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Memproses...</>
                                                                ) : (
                                                                    <><Check className="w-3.5 h-3.5" /> Konfirmasi & Kemas</>
                                                                )}
                                                            </button>
                                                        )}

                                                        {order.status === 'packing' && (
                                                            <button
                                                                onClick={() => setOrderForWaybill(order.id)}
                                                                className="px-4 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:bg-zinc-800 flex items-center gap-2"
                                                            >
                                                                <Send className="w-3.5 h-3.5" /> Kirim Pesanan (Input Resi)
                                                            </button>
                                                        )}

                                                        {order.status === 'shipping' && (
                                                            <button
                                                                disabled={isUpdatingStatus}
                                                                onClick={() => handleUpdateStatus(order.id, 'completed')}
                                                                className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-emerald-100"
                                                            >
                                                                {updatingId === order.id && isUpdatingStatus ? (
                                                                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Memproses...</>
                                                                ) : (
                                                                    <><Check className="w-3.5 h-3.5" /> Tandai Selesai</>
                                                                )}
                                                            </button>
                                                        )}

                                                        {(order.status === 'pending' || order.status === 'paid') && (
                                                            <button
                                                                disabled={isUpdatingStatus}
                                                                onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                                                className="px-4 py-2.5 border-2 border-red-200 text-red-650 hover:text-red-700 hover:border-red-500 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                                                            >
                                                                Batalkan
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Waybill Modal */}
            {orderForWaybill && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmittingWaybill && setOrderForWaybill(null)}></div>
                    <form 
                        onSubmit={handleSubmitWaybill}
                        className="relative bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-zinc-100 space-y-6 animate-in fade-in zoom-in-95 duration-200"
                    >
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-black uppercase text-zinc-900 tracking-tight">Kirim Pesanan</h3>
                            <p className="text-zinc-550 text-xs leading-relaxed font-medium uppercase">
                                Masukkan nomor resi / waybill pengiriman kurir untuk pesanan ini.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Nomor Resi / Waybill</label>
                            <input
                                required
                                type="text"
                                value={waybillInput}
                                onChange={e => setWaybillInput(e.target.value)}
                                placeholder="Contoh: JP1234567890"
                                className="w-full bg-zinc-55 text-zinc-900 font-mono text-sm border-transparent rounded-xl py-3.5 px-4 focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isSubmittingWaybill}
                                onClick={() => {
                                    setOrderForWaybill(null);
                                    setWaybillInput('');
                                }}
                                className="flex-1 bg-white border-2 border-zinc-200 hover:bg-zinc-50 text-zinc-800 py-3.5 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmittingWaybill || !waybillInput.trim()}
                                className="flex-1 bg-zinc-950 hover:bg-zinc-850 text-white py-3.5 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmittingWaybill ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
                                ) : (
                                    'Kirim Pesanan'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </MarketplaceLayout>
    );
}
