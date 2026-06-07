import React, { useState, useEffect } from 'react';
import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Trash2,
    Plus,
    Minus,
    ShoppingBag,
    ChevronLeft,
    ShieldCheck,
    Info,
    Store,
    TicketPercent,
    X
} from 'lucide-react';
import useCartStore from '@/Pages/Transactions/useCartStore';

export default function CartPage({ auth, cartItems = [] }) {
    const { setCartCount } = useCartStore();
    const [deleteId, setDeleteId] = useState(null);

    // Sync cart count ke zustand store saat halaman dimuat
    useEffect(() => {
        if (typeof auth?.cart_count === 'number') {
            setCartCount(auth.cart_count);
        }
    }, [auth?.cart_count]);

    const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);

    const handleRemoveItem = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        router.delete(`/cart/${deleteId}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteId(null),
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        router.post(route('cart.store'), {
            product_id: productId,
            quantity: newQuantity,
            type: 'update'
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const newCount = page.props.auth?.cart_count;
                if (typeof newCount === 'number') {
                    setCartCount(newCount);
                }
            }
        });
    };

    const groupedItems = cartItems.reduce((acc, item) => {
        const shopName = item.product?.shop?.shop_name || 'Raynar Preloved Store';
        if (!acc[shopName]) acc[shopName] = [];
        acc[shopName].push(item);
        return acc;
    }, {});

    return (
        <MarketplaceLayout auth={auth}>
            <Head title="Keranjang Belanja | Shopping Kuy" />

            {/* Modal Konfirmasi Hapus */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-zinc-900 text-base uppercase tracking-tight">Hapus Item?</h3>
                            <button onClick={() => setDeleteId(null)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-zinc-500 font-medium">Item ini akan dihapus dari Tas Belanja kamu.</p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-3 border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all active:scale-95"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[#F8F9FA] min-h-screen font-['Poppins']">
                <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">

                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">
                            <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                            <span>/</span>
                            <span className="text-zinc-900">Tas Belanja</span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold text-zinc-900 uppercase tracking-tight">
                            Tas Belanja <span className="text-zinc-400 ml-2 font-medium">({cartItems.length})</span>
                        </h1>
                    </div>

                    {cartItems.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                            {/* Kiri: List Barang */}
                            <div className="lg:col-span-8 space-y-6">

                                {/* Info Alamat */}
                                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex justify-between items-center">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center">
                                            <Info className="w-5 h-5 text-zinc-600" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-zinc-900">{auth.user.name}</p>
                                            <p className="text-xs text-zinc-500 line-clamp-1">
                                                {auth.user.address_notes
                                                    ? `${auth.user.address_notes}${auth.user.subdistrict_name ? ', ' + auth.user.subdistrict_name : ''}${auth.user.district_name ? ', ' + auth.user.district_name : ''}${auth.user.city_name ? ', ' + auth.user.city_name : ''}${auth.user.province_name ? ', ' + auth.user.province_name : ''}${auth.user.postal_code ? ' ' + auth.user.postal_code : ''}`
                                                    : 'Alamat belum diatur, silakan lengkapi di profil.'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <Link href={route('profile.index')} className="text-xs font-bold text-zinc-900 border border-zinc-300 px-4 py-2 rounded-lg hover:bg-zinc-50 transition-all">Ubah</Link>
                                </div>

                                {/* List per Toko */}
                                {Object.keys(groupedItems).map((shopName, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                                        <div className="bg-zinc-50/50 px-6 py-4 border-b border-zinc-100 flex items-center gap-2">
                                            <Store className="w-4 h-4 text-zinc-400" />
                                            <span className="text-[13px] font-bold uppercase tracking-tight text-zinc-700">{shopName}</span>
                                        </div>

                                        <div className="divide-y divide-zinc-100">
                                            {groupedItems[shopName].map((item) => (
                                                <div key={item.id} className="p-6 flex flex-col md:flex-row gap-6 group">
                                                    {/* Gambar */}
                                                    <div className="w-full md:w-32 h-40 md:h-32 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100 relative">
                                                        <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                                                    </div>

                                                    {/* Info detail */}
                                                    <div className="flex-grow flex flex-col justify-between py-1">
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{item.brand || 'Authentic Preloved'}</p>
                                                                    <h3 className="text-lg font-bold text-zinc-900 leading-tight uppercase tracking-tight">{item.name}</h3>
                                                                    <p className="text-xs text-zinc-500 mt-1 uppercase font-semibold">Ukuran: {item.size || 'All Size'}</p>
                                                                </div>
                                                                <button onClick={() => handleRemoveItem(item.id)} className="text-zinc-300 hover:text-red-500 transition-colors">
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-between items-center mt-4">
                                                            <div className="flex items-center bg-zinc-50 rounded-lg p-1 border border-zinc-200">
                                                                <button
                                                                    onClick={() => updateQuantity(item.product_id, (item.quantity || 1) - 1)}
                                                                    className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
                                                                >
                                                                    <Minus className="w-3.5 h-3.5" />
                                                                </button>
                                                                <span className="px-4 text-xs font-bold text-zinc-900">{item.quantity || 1}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.product_id, (item.quantity || 1) + 1)}
                                                                    className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors"
                                                                >
                                                                    <Plus className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                            <p className="text-lg font-bold text-zinc-900">
                                                                Rp {Number(item.price * (item.quantity || 1)).toLocaleString('id-ID')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Kanan: Summary */}
                            <div className="lg:col-span-4 space-y-6 sticky top-28">

                                {/* Promo Section */}
                                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-zinc-900 transition-all">
                                    <div className="flex items-center gap-3">
                                        <TicketPercent className="w-5 h-5 text-zinc-900" />
                                        <span className="text-[13px] font-bold uppercase text-zinc-900">Makin hemat pakai promo</span>
                                    </div>
                                    <ChevronLeft className="w-4 h-4 text-zinc-400 rotate-180 group-hover:text-zinc-900 transition-colors" />
                                </div>

                                {/* Order Summary */}
                                <div className="bg-white p-8 rounded-[24px] border border-zinc-200 shadow-sm space-y-6">
                                    <h2 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">Ringkasan Belanja</h2>

                                    <div className="space-y-4 text-[13px] font-medium text-zinc-500 border-b border-zinc-100 pb-6">
                                        <div className="flex justify-between">
                                            <span>Subtotal ({cartItems.length} Produk)</span>
                                            <span className="text-zinc-900 font-bold font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Pengiriman</span>
                                            <span className="text-green-600 font-bold uppercase tracking-tight">Gratis</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Biaya Layanan</span>
                                            <span className="text-zinc-900 font-bold font-mono">Rp 0</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-sm font-bold text-zinc-900 uppercase">Total Harga</span>
                                        <span className="text-2xl font-bold text-zinc-900 font-mono">
                                            Rp {subtotal.toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    <Link
                                        href={route('checkout.index')}
                                        className="w-full bg-zinc-900 text-white py-4 rounded-xl flex items-center justify-center font-bold uppercase text-[13px] tracking-widest hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-zinc-200"
                                    >
                                        Beli Sekarang
                                    </Link>

                                    <div className="flex items-center gap-2 justify-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Secure & Encrypted Checkout
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="bg-white py-24 rounded-[32px] text-center border border-zinc-200 flex flex-col items-center shadow-sm">
                            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag className="w-8 h-8 text-zinc-200" />
                            </div>
                            <h2 className="text-xl font-bold uppercase text-zinc-900 mb-2">Tas Belanja Kosong</h2>
                            <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-8">Yuk, cari item preloved idamanmu sekarang</p>
                            <Link
                                href="/"
                                className="bg-zinc-900 text-white px-10 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-zinc-800 transition-all active:scale-95"
                            >
                                Mulai Belanja
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </MarketplaceLayout>
    );
}
