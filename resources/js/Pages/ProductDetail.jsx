import React, { useState, useMemo, useEffect } from 'react';
import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ChevronRight,
    Star,
    ShieldCheck,
    Truck,
    Heart,
    Share2,
    MessageCircle,
    ShoppingBag,
    Zap,
    BadgePercent,
    Info,
    Check,
    X,
    ArrowRight
} from 'lucide-react';
import useCartStore from '@/Pages/Transactions/useCartStore';

export default function ProductDetail({ product, auth, isInCart }) {
    const [isWishlist, setIsWishlist] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { post, processing } = useForm({
        product_id: product?.id,
        quantity: 1,
    });

    const { cartCount, setCartCount } = useCartStore();

    useEffect(() => {
        if (typeof auth?.cart_count === 'number') {
            setCartCount(auth.cart_count);
        }
    }, [auth?.cart_count]);

    const data = useMemo(() => {
        let rawImages = [];
        try {
            if (product?.images) {
                rawImages = typeof product.images === 'string'
                    ? JSON.parse(product.images)
                    : product.images;
            }
        } catch (e) { rawImages = [product.thumbnail]; }

        const finalImages = rawImages?.length > 0
            ? rawImages.map(img => img.startsWith('http') ? img : `/storage/${img}`)
            : ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800"];

        return {
            id: product?.id,
            name: product?.name || "Premium Preloved Item",
            price: Number(product?.price) || 0,
            originalPrice: (Number(product?.price) || 0) * 1.35,
            condition: product?.condition?.replace('_', ' ') || "Excellent",
            description: product?.description || "No description provided.",
            brand: product?.brand || "Authentic",
            category: product?.category || "Fashion",
            seller: {
                name: product?.shop?.shop_name || "Shopping Kuy Official",
                avatar: product?.shop?.shop_name ? product.shop.shop_name.charAt(0).toUpperCase() : "S",
                location: "Surabaya, ID",
                rating: 4.9
            },
            images: finalImages,
            specs: [
                { label: "Kategori", value: product?.category || 'Fashion' },
                { label: "Ukuran", value: product?.size || 'EU 43' },
                { label: "Kondisi", value: product?.condition?.replace('_', ' ') || 'Good' },
                { label: "Berat", value: `${product?.weight || 0} gr` },
                { label: "Minus", value: product?.minus_detail || 'None' }
            ]
        };
    }, [product]);

    const nextImage = () => setSelectedImage((prev) => (prev + 1) % data.images.length);
    const prevImage = () => setSelectedImage((prev) => (prev - 1 + data.images.length) % data.images.length);

    const handleAddToCart = () => {
        if (!auth.user) {
            router.get(route('login'));
            return;
        }

        if (isInCart) {
            router.visit(route('cart.index'));
            return;
        }

        post(route('cart.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccessModal(true);
            }
        });
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        window.location.reload();
    };

    const handleBuyNow = () => {
        if (!auth.user) {
            router.get(route('login'));
            return;
        }

        router.post(route('cart.store'), {
            product_id: product.id,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                router.get(route('checkout.index'));
            }
        });
    };

    return (
        <MarketplaceLayout auth={auth}>
            <Head title={`${data.name} | Shopping Kuy`} />

            <div className="bg-white min-h-screen font-['Poppins']">
                {/* SUCCESS MODAL - APPLE STYLE */}
                {showSuccessModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
                        <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
                        <div className="bg-white/90 backdrop-blur-xl w-full max-w-[440px] rounded-[32px] shadow-2xl border border-white/20 overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
                            <div className="p-8 md:p-10 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-zinc-900/20">
                                    <Check className="w-10 h-10 text-white stroke-[3px]" />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Berhasil Ditambahkan</h3>
                                <p className="text-zinc-500 font-medium mb-8 leading-relaxed">Item idamanmu sudah masuk ke Tas Belanja. Siap untuk melengkapi gayamu?</p>

                                <div className="grid grid-cols-1 w-full gap-3">
                                    <Link
                                        href={route('cart.index')}
                                        className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold text-[13px] uppercase tracking-wider hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        Lihat Tas Belanja
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <button
                                        onClick={handleCloseModal}
                                        className="w-full bg-zinc-100 text-zinc-900 py-4 rounded-2xl font-bold text-[13px] uppercase tracking-wider hover:bg-zinc-200 transition-all"
                                    >
                                        Tetap di Halaman
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-900"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-6 md:py-12">
                    <nav className="flex items-center gap-2 text-[12px] font-bold uppercase text-zinc-400 mb-8 overflow-x-auto no-scrollbar">
                        <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-zinc-900 truncate">{data.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
                        <div className="lg:col-span-7 space-y-6">
                            <div className="relative aspect-[4/3] md:aspect-[3/4] rounded-[16px] md:rounded-[24px] overflow-hidden bg-zinc-50 border border-zinc-100 shadow-sm group">
                                <img
                                    src={data.images[selectedImage]}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    alt={data.name}
                                />

                                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none md:hidden">
                                    <button onClick={prevImage} className="p-2 rounded-full bg-white/80 backdrop-blur-md shadow-lg pointer-events-auto active:scale-90 transition">
                                        <ChevronRight className="w-5 h-5 rotate-180" />
                                    </button>
                                    <button onClick={nextImage} className="p-2 rounded-full bg-white/80 backdrop-blur-md shadow-lg pointer-events-auto active:scale-90 transition">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col gap-2 md:gap-3">
                                    <span className="w-28 md:w-36 bg-zinc-900/90 text-white py-1.5 md:py-2.5 rounded-full text-[12px] font-bold uppercase shadow-2xl border border-white/10 backdrop-blur-md flex items-center justify-center text-center">
                                        {data.condition}
                                    </span>
                                    <span className="w-28 md:w-36 bg-green-200/90 text-green-700 py-1.5 md:py-2.5 rounded-full text-[12px] font-bold uppercase shadow-2xl border border-green-500/30 backdrop-blur-md flex items-center justify-center text-center">
                                        Authentic
                                    </span>
                                </div>

                                <div className="absolute bottom-4 right-6 md:hidden bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[12px] font-bold">
                                    {selectedImage + 1} / {data.images.length}
                                </div>
                            </div>

                            <div className="hidden md:flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                {data.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative shrink-0 w-24 h-24 rounded-[20px] overflow-hidden border-2 transition-all duration-300 ${
                                            selectedImage === idx ? 'border-zinc-900 scale-95' : 'border-transparent opacity-40 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-5 flex flex-col">
                            <div className="lg:sticky lg:top-32 space-y-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[14px] font-bold uppercase text-zinc-400">{data.brand}</p>
                                        <div className="flex gap-4">
                                            <button onClick={() => setIsWishlist(!isWishlist)}>
                                                <Heart className={`w-6 h-6 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-zinc-300'}`} />
                                            </button>
                                            <Share2 className="w-6 h-6 text-zinc-300 cursor-pointer hover:text-zinc-900" />
                                        </div>
                                    </div>
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-zinc-900 uppercase leading-[1.1] md:leading-[1]">
                                        {data.name}
                                    </h1>
                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        </div>
                                        <span className="text-[12px] font-bold text-zinc-400 uppercase underline underline-offset-4 decoration-zinc-200">5.0 / 5.0 Seller Rating</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-baseline gap-4 pb-3">
                                        <p className="text-4xl font-bold text-zinc-900">
                                            Rp {data.price.toLocaleString('id-ID')}
                                        </p>
                                        <span className="text-zinc-300 line-through text-xl font-bold">
                                            Rp {data.originalPrice.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <p className="text-[12px] font-bold text-green-600 uppercase bg-green-100 inline-block px-3 py-1 rounded-md">Jaminan Kualitas Terbaik</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={processing}
                                            className={`flex items-center justify-center gap-3 py-4 rounded-lg text-[12px] font-bold uppercase transition-all shadow-sm disabled:opacity-50 ${
                                                isInCart
                                                ? 'bg-green-600 text-white border border-green-600 hover:bg-green-700'
                                                : 'bg-white border border-zinc-900 text-zinc-900 hover:bg-zinc-50'
                                            }`}
                                        >
                                            {isInCart ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Lihat Tas Belanja
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag className="w-4 h-4" />
                                                    Add to Cart
                                                </>
                                            )}
                                        </button>
                                        <button className="flex items-center justify-center gap-3 bg-zinc-100 border border-zinc-900 text-zinc-900 py-4 rounded-lg text-[12px] font-bold uppercase hover:bg-zinc-200 transition-all shadow-sm">
                                            <BadgePercent className="w-4 h-4" />
                                            Negosiasi Harga
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleBuyNow}
                                        disabled={processing}
                                        className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white py-5 rounded-lg text-[12px] font-bold uppercase hover:bg-zinc-800 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <Zap className="w-4 h-4 fill-current" />
                                        Belanja Sekarang!
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-6 py-8 border-y border-zinc-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center">
                                            <ShieldCheck className="w-5 h-5 text-zinc-900" />
                                        </div>
                                        <span className="text-[12px] font-bold uppercase text-zinc-500 leading-tight">Kualitas<br/>Original</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center">
                                            <Truck className="w-5 h-5 text-zinc-900" />
                                        </div>
                                        <span className="text-[12px] font-bold uppercase text-zinc-500 leading-tight">Pengiriman<br/>Aman</span>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Info className="w-5 h-5 text-zinc-900" />
                                            <h4 className="text-[14px] font-bold uppercase text-zinc-900">Detail & Deskripsi</h4>
                                        </div>
                                        <p className="text-zinc-500 text-[14px] leading-relaxed font-medium whitespace-pre-line">
                                            {data.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-6 gap-x-12 p-8 bg-zinc-50 rounded-[16px] border border-zinc-200">
                                        {data.specs.map((spec, i) => (
                                            <div key={i} className="space-y-1">
                                                <p className="text-[12px] font-bold uppercase text-zinc-400">{spec.label}</p>
                                                <p className="text-[12px] font-bold uppercase text-zinc-900">{spec.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-white rounded-[24px] border border-zinc-200 shadow-sm transition-all hover:shadow-lg group mb-12">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-[16px] bg-zinc-900 flex items-center justify-center text-white font-bold text-2xl shadow-xl transition-transform group-hover:rotate-6">
                                            {data.seller.avatar}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[14px] font-bold uppercase text-zinc-900">{data.seller.name}</p>
                                            <p className="text-[12px] text-zinc-400 uppercase font-bold">★ 4.9 • {data.seller.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 text-right">
                                        <button className="text-[12px] font-bold uppercase border-2 border-zinc-900 px-5 py-2.5 rounded-full hover:bg-zinc-900 hover:text-white transition-all whitespace-nowrap">
                                            Visit Shop
                                        </button>
                                        <button className="flex items-center justify-end gap-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                                            <MessageCircle className="w-4 h-4" />
                                            <span className="text-[12px] font-bold uppercase">Chat</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
