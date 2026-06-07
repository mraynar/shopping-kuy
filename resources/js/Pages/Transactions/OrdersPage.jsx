import React, { useState } from 'react';
import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    ChevronDown, ChevronUp, Package, Truck, Calendar, 
    CreditCard, MapPin, ClipboardList, ExternalLink, RefreshCw,
    AlertTriangle, Loader2, Star
} from 'lucide-react';

export default function OrdersPage({ auth, orders = [], flash }) {
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);
    
    const [reviewItem, setReviewItem] = useState(null); // { orderId, productId, productName }
    const [rating, setRating] = useState(5);
    const [reviewBody, setReviewBody] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const [showFlash, setShowFlash] = useState(true);

    const toggleExpand = (id) => {
        if (expandedOrderId === id) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(id);
        }
    };

    const handleCancelOrder = () => {
        if (!orderToCancel) return;
        setIsCancelling(true);
        router.post(route('orders.cancel', { id: orderToCancel }), {}, {
            onSuccess: () => {
                setOrderToCancel(null);
            },
            onFinish: () => {
                setIsCancelling(false);
            }
        });
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!reviewItem || !reviewBody.trim()) return;

        setIsSubmittingReview(true);
        router.post('/reviews', {
            order_id: reviewItem.orderId,
            product_id: reviewItem.productId,
            rating: rating,
            body: reviewBody
        }, {
            onSuccess: () => {
                setReviewItem(null);
                setRating(5);
                setReviewBody('');
                setShowFlash(true);
            },
            onFinish: () => {
                setIsSubmittingReview(false);
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
            case 'pending': return 'Menunggu Pembayaran';
            case 'paid': return 'Dibayar';
            case 'packing': return 'Sedang Dikemas';
            case 'shipping': return 'Dalam Pengiriman';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status || 'Unknown';
        }
    };

    return (
        <MarketplaceLayout auth={auth}>
            <Head title="Riwayat Pesanan | Shopping Kuy" />

            <div className="bg-[#F8F9FA] min-h-screen font-['Poppins'] py-8 md:py-12">
                <div className="max-w-[1000px] mx-auto px-4 md:px-6">
                    {/* Flash Alert */}
                    {flash?.message && showFlash && (
                        <div className="mb-6 bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider px-6 py-4 rounded-xl flex items-center justify-between shadow-lg animate-in fade-in duration-200">
                            <span>{flash.message}</span>
                            <button onClick={() => setShowFlash(false)} className="text-white/60 hover:text-white text-xs ml-4">✕</button>
                        </div>
                    )}

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-950">Riwayat Pesanan</h1>
                            <p className="text-zinc-500 text-xs md:text-sm font-medium mt-1 uppercase tracking-wide">Pantau status pengiriman dan riwayat belanja Anda</p>
                        </div>
                        <Link href="/" className="inline-flex items-center justify-center bg-zinc-950 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-md shrink-0">
                            Mulai Belanja Lagi
                        </Link>
                    </div>

                    {/* Orders List */}
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-12 text-center space-y-4">
                            <ClipboardList className="w-16 h-16 text-zinc-300 mx-auto" strokeWidth={1.5} />
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-zinc-900 uppercase">Belum Ada Transaksi</h3>
                                <p className="text-zinc-400 text-xs max-w-sm mx-auto leading-relaxed uppercase">
                                    Semua riwayat transaksi belanja Anda akan muncul di halaman ini. Silakan lakukan pemesanan terlebih dahulu.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const isExpanded = expandedOrderId === order.id;
                                const itemsCount = order.items?.length || 0;
                                const dateFormatted = new Date(order.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                });

                                return (
                                    <div key={order.id} className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden transition-all duration-200">
                                        {/* Accordion Header */}
                                        <div 
                                            onClick={() => toggleExpand(order.id)}
                                            className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/50 transition-colors select-none"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                                {/* Icon */}
                                                <div className="p-3 bg-zinc-100 rounded-xl text-zinc-800 hidden sm:block shrink-0">
                                                    <Package className="w-6 h-6" />
                                                </div>

                                                {/* Quick Details */}
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
                                                        <span>{itemsCount} Item</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price and Expand Toggle */}
                                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-zinc-100">
                                                <div className="text-left md:text-right">
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Pembayaran</p>
                                                    <p className="text-sm font-black text-zinc-900">Rp {Number(order.total_amount).toLocaleString('id-ID')}</p>
                                                </div>
                                                <div className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500">
                                                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Accordion Content */}
                                        {isExpanded && (
                                            <div className="px-5 pb-5 md:px-6 md:pb-6 border-t border-zinc-100 bg-zinc-50/20 divide-y divide-zinc-100 animate-in fade-in slide-in-from-top-1 duration-150">
                                                {/* Product List */}
                                                <div className="py-4 space-y-4">
                                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-2">Item Detail</p>
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="flex gap-4 items-start py-1">
                                                            <img
                                                                src={item.product?.thumbnail ? (item.product.thumbnail.startsWith('http') ? item.product.thumbnail : `/storage/${item.product.thumbnail}`) : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'}
                                                                className="w-12 h-16 object-cover rounded-lg border border-zinc-200 bg-white shrink-0" 
                                                                alt={item.product?.name}
                                                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'; }}
                                                            />
                                                            <div className="flex-grow min-w-0">
                                                                <h4 className="text-xs font-bold text-zinc-900 uppercase leading-snug line-clamp-1">{item.product?.name || 'Produk'}</h4>
                                                                {item.product?.shop && (
                                                                    <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">Toko: {item.product.shop.shop_name}</p>
                                                                )}
                                                                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">
                                                                    Qty: {item.quantity} · Rp {Number(item.price_at_purchase || item.price).toLocaleString('id-ID')} / item
                                                                </p>
                                                                {order.status === 'completed' && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setReviewItem({
                                                                                orderId: order.id,
                                                                                productId: item.product_id,
                                                                                productName: item.product?.name
                                                                            });
                                                                            setRating(5);
                                                                            setReviewBody('');
                                                                        }}
                                                                        className="mt-2.5 px-3 py-1.5 border border-zinc-900 hover:bg-zinc-900 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                                                                    >
                                                                        Beri Ulasan
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <p className="text-xs font-bold text-zinc-900">
                                                                    Rp {(Number(item.price_at_purchase || item.price) * item.quantity).toLocaleString('id-ID')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Shipping and Billing Details */}
                                                <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Delivery Info */}
                                                    <div className="space-y-3">
                                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Informasi Pengiriman</p>
                                                        <div className="space-y-2 text-xs">
                                                            <div className="flex gap-2 items-start text-zinc-650">
                                                                <Truck className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <p className="font-bold text-zinc-800 uppercase">{order.courier} - {order.service}</p>
                                                                    {order.waybill ? (
                                                                        <p className="text-[10px] font-bold text-zinc-500 mt-0.5">No. Resi: <span className="font-mono text-zinc-800 uppercase">{order.waybill}</span></p>
                                                                    ) : (
                                                                        <p className="text-[10px] text-zinc-400 mt-0.5 font-medium uppercase">Resi belum diinput</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 items-start text-zinc-650 pt-1">
                                                                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <p className="font-bold text-zinc-800 uppercase">Alamat Tujuan</p>
                                                                    <p className="text-[11px] text-zinc-500 leading-relaxed font-medium mt-0.5 uppercase">{order.shipping_address}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Payment Breakdown */}
                                                    <div className="space-y-3">
                                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Rincian Pembayaran</p>
                                                        <div className="space-y-2 text-xs">
                                                            <div className="flex justify-between text-zinc-500">
                                                                <span>Metode Pembayaran</span>
                                                                <span className="font-bold text-zinc-800 uppercase">{order.payment_type || 'Midtrans Snap'}</span>
                                                            </div>
                                                            <div className="flex justify-between text-zinc-500">
                                                                <span>Subtotal Item</span>
                                                                <span className="font-bold text-zinc-800">Rp {(Number(order.total_amount) - Number(order.shipping_cost)).toLocaleString('id-ID')}</span>
                                                            </div>
                                                            <div className="flex justify-between text-zinc-500">
                                                                <span>Ongkos Kirim</span>
                                                                <span className="font-bold text-zinc-800">Rp {Number(order.shipping_cost).toLocaleString('id-ID')}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center pt-2 border-t border-zinc-200/60 text-sm">
                                                                <span className="font-bold text-zinc-900 uppercase">Total Transaksi</span>
                                                                <span className="font-black text-zinc-950">Rp {Number(order.total_amount).toLocaleString('id-ID')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions Section */}
                                                <div className="py-3 flex justify-end gap-3 border-t border-zinc-100 mt-4 pt-4">
                                                    {order.status === 'pending' && (
                                                        <button 
                                                            onClick={() => setOrderToCancel(order.id)}
                                                            className="px-4 py-2 border-2 border-red-200 hover:border-red-500 text-red-650 hover:text-red-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                                                        >
                                                            Batalkan Pesanan
                                                        </button>
                                                    )}
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

            {/* Custom Confirm Cancel Modal */}
            {orderToCancel && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isCancelling && setOrderToCancel(null)}></div>
                    <div className="relative bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-zinc-100 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="mx-auto w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                            <AlertTriangle className="w-6 h-6 animate-bounce" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-black uppercase text-zinc-900 tracking-tight">Batalkan Pesanan?</h3>
                            <p className="text-zinc-550 text-xs leading-relaxed font-medium uppercase">
                                Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                disabled={isCancelling}
                                onClick={() => setOrderToCancel(null)}
                                className="flex-1 bg-white border-2 border-zinc-200 hover:bg-zinc-50 text-zinc-800 py-3.5 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all disabled:opacity-50"
                            >
                                Kembali
                            </button>
                            <button
                                disabled={isCancelling}
                                onClick={handleCancelOrder}
                                className="flex-1 bg-red-650 hover:bg-red-750 text-white py-3.5 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isCancelling ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Membatalkan...</>
                                ) : (
                                    'Ya, Batalkan'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {reviewItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmittingReview && setReviewItem(null)}></div>
                    <form 
                        onSubmit={handleSubmitReview}
                        className="relative bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-zinc-100 space-y-6 animate-in fade-in zoom-in-95 duration-200"
                    >
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-black uppercase text-zinc-900 tracking-tight">Tulis Ulasan</h3>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase leading-relaxed max-w-xs mx-auto truncate">
                                {reviewItem.productName}
                            </p>
                        </div>

                        {/* Star Rating Selector */}
                        <div className="flex flex-col items-center gap-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Rating Produk</label>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="p-1 text-amber-400 hover:scale-110 active:scale-95 transition-transform"
                                    >
                                        <Star 
                                            className="w-8 h-8" 
                                            fill={star <= rating ? 'currentColor' : 'none'} 
                                            strokeWidth={2}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Review Body */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Ulasan Anda</label>
                            <textarea
                                required
                                rows={4}
                                value={reviewBody}
                                onChange={e => setReviewBody(e.target.value)}
                                placeholder="Bagikan pengalaman Anda menggunakan produk preloved ini..."
                                className="w-full bg-zinc-50 text-zinc-900 text-xs border-transparent rounded-xl py-3.5 px-4 focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isSubmittingReview}
                                onClick={() => setReviewItem(null)}
                                className="flex-1 bg-white border-2 border-zinc-200 hover:bg-zinc-50 text-zinc-800 py-3.5 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmittingReview || !reviewBody.trim()}
                                className="flex-1 bg-zinc-950 hover:bg-zinc-855 text-white py-3.5 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmittingReview ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Mengirim...</>
                                ) : (
                                    'Kirim Ulasan'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </MarketplaceLayout>
    );
}
