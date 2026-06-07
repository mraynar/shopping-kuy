import React from 'react';
import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, ArrowRight, ShoppingBag, ClipboardList, Copy, Check } from 'lucide-react';

export default function SuccessPage({ auth, order = null }) {
    const [copied, setCopied] = React.useState(false);

    const handleCopyOrderNumber = () => {
        if (order?.order_number) {
            navigator.clipboard.writeText(order.order_number);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <MarketplaceLayout auth={auth}>
            <Head title="Pembayaran Berhasil | Shopping Kuy" />

            <div className="bg-[#F8F9FA] min-h-screen font-['Poppins'] py-12 md:py-20">
                <div className="max-w-[650px] mx-auto px-4">
                    <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xl overflow-hidden p-8 md:p-10 text-center space-y-8">
                        {/* Success Icon & Animation */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-100 rounded-full scale-150 animate-ping opacity-30"></div>
                                <div className="relative bg-emerald-500 text-white p-5 rounded-full shadow-lg">
                                    <CheckCircle className="w-12 h-12" strokeWidth={2.5} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-950">Pembayaran Berhasil!</h1>
                                <p className="text-zinc-500 text-xs md:text-sm font-medium uppercase tracking-wide">Terima kasih atas pembayaran Anda. Pesanan sedang diproses.</p>
                            </div>
                        </div>

                        {/* Order Summary Details */}
                        {order ? (
                            <div className="border border-zinc-100 rounded-2xl bg-zinc-50/50 p-6 text-left space-y-5">
                                <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nomor Pesanan</p>
                                        <p className="text-sm font-bold text-zinc-900 uppercase tracking-tight mt-0.5">{order.order_number}</p>
                                    </div>
                                    <button 
                                        onClick={handleCopyOrderNumber}
                                        className="p-2 hover:bg-zinc-200/50 rounded-lg transition-colors text-zinc-500 hover:text-zinc-900"
                                        title="Salin Nomor Pesanan"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Detail Pengiriman</p>
                                    <div className="text-xs space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">Metode Pembayaran</span>
                                            <span className="font-bold text-zinc-850 uppercase">{order.payment_type || 'Midtrans Snap'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-500">Kurir Pengiriman</span>
                                            <span className="font-bold text-zinc-850 uppercase">{order.courier} - {order.service}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 pt-1">
                                            <span className="text-zinc-500">Alamat Tujuan</span>
                                            <span className="text-zinc-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-zinc-100">{order.shipping_address}</span>
                                        </div>
                                    </div>
                                </div>

                                {order.items && order.items.length > 0 && (
                                    <div className="space-y-3 pt-3 border-t border-zinc-100">
                                        <p className="text-[11px] font-black text-zinc-400 uppercase tracking-wider">Item yang Dibeli</p>
                                        <div className="divide-y divide-zinc-100 max-h-48 overflow-y-auto pr-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center py-2 text-xs">
                                                    <div className="min-w-0 pr-4">
                                                        <p className="font-bold text-zinc-900 uppercase truncate">{item.product?.name || 'Produk'}</p>
                                                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">Qty: {item.quantity}</p>
                                                    </div>
                                                    <span className="font-bold text-zinc-900 shrink-0">
                                                        Rp {(Number(item.price_at_purchase || item.price) * item.quantity).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-zinc-150 space-y-2">
                                    <div className="flex justify-between text-xs text-zinc-500">
                                        <span>Ongkos Kirim</span>
                                        <span className="font-bold text-zinc-900">Rp {(Number(order.shipping_cost) || 0).toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 text-sm">
                                        <span className="font-bold text-zinc-900 uppercase">Total Pembayaran</span>
                                        <span className="text-lg font-black text-zinc-900">
                                            Rp {(Number(order.total_amount) || 0).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border border-zinc-200/60 rounded-2xl bg-zinc-50/50 p-6 text-center space-y-3">
                                <p className="text-sm font-bold text-zinc-800 uppercase">Pesanan Anda Berhasil Ditempatkan! 🎉</p>
                                <p className="text-xs text-zinc-500 leading-relaxed max-w-md mx-auto">
                                    Anda dapat melihat rincian lengkap pesanan, melacak status pengiriman,
                                    serta melakukan konfirmasi penerimaan melalui halaman riwayat pesanan.
                                </p>
                                <Link
                                    href="/orders"
                                    className="inline-block mt-1 bg-zinc-900 text-white text-[11px] font-bold uppercase px-5 py-2.5 rounded-lg hover:bg-zinc-800 transition-all"
                                >
                                    Lihat Riwayat Pesanan →
                                </Link>
                            </div>
                        )}

                        {/* Navigation Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link 
                                href="/orders" 
                                className="flex-1 bg-zinc-950 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase text-[12px] tracking-widest hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg"
                            >
                                <ClipboardList className="w-4 h-4" /> Riwayat Pesanan
                            </Link>
                            <Link 
                                href="/" 
                                className="flex-1 bg-white border-2 border-zinc-200 text-zinc-900 py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase text-[12px] tracking-widest hover:bg-zinc-50 transition-all active:scale-[0.98]"
                            >
                                <ShoppingBag className="w-4 h-4" /> Lanjut Belanja <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
