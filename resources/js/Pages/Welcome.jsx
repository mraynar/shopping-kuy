// Ganti baris import paling atas dengan ini:
import React, { useState, useEffect, useRef } from 'react';
import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ChevronRight, Check, X, ArrowRight } from 'lucide-react';
import useCartStore from '@/Pages/Transactions/useCartStore';

export default function Welcome({ auth, products, featuredProducts, recommendedSellers, dbCategories }) {
    const categoryScrollRef = useRef(null);
    const sellerScrollRef = useRef(null);
    const testimonialScrollRef = useRef(null);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { cartCount, setCartCount } = useCartStore();

    const { post, processing } = useForm({
        product_id: null,
        quantity: 1
    });

    const handleAddToCart = (productId) => {
        if (!auth.user) {
            router.get(route('login'));
            return;
        }

        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccessModal(true);
                router.reload({
                    only: ['auth'],
                    onSuccess: (page) => {
                        if (page.props.auth?.cart_count !== undefined) {
                            setCartCount(page.props.auth.cart_count);
                        }
                    }
                });
            }
        });
    };

    const toggleFavourite = (productId) => {
        if (!auth.user) {
            router.get(route('login'));
            return;
        }

        router.post(route('products.favourite', productId), {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['products'] });
            }
        });
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
    };

    const scrollCategories = (direction) => {
        if (categoryScrollRef.current) {
            const { current } = categoryScrollRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const scrollSellers = (direction) => {
        if (sellerScrollRef.current) {
            const { current } = sellerScrollRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const scrollTestimonials = (direction) => {
        if (testimonialScrollRef.current) {
            const { current } = testimonialScrollRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const testimonials = [
        { id: 1, user: "Ardiansyah8523", comment: "Barang oke, kualitasnya juga masih bagus bgt!", avatar: "A" },
        { id: 2, user: "Maria2737", comment: "Makasih seller baik ramah juga barangnya juga sesuai", avatar: "M" },
        { id: 3, user: "Favian7645", comment: "Keren banget jaket kulitnya puas, adminnya ramah!", avatar: "F" },
        { id: 4, user: "Erika7169", comment: "Barang sesuai gambar dan deskripsi. Thank you.", avatar: "E" },
    ];

    const collections = [
        {
            name: "Workwear",
            img: recommendedSellers?.[0]?.images?.[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
            label: "Authentic"
        },
        {
            name: "Grunge Gothic",
            img: recommendedSellers?.[1]?.images?.[0] || 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
            label: "Curated"
        },
        {
            name: "Baju Jersey",
            img: recommendedSellers?.[2]?.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
            label: "Vintage"
        },
        {
            name: "Streetwear",
            img: recommendedSellers?.[3]?.images?.[0] || 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
            label: "Premium"
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % collections.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentIndex((currentIndex + 1) % collections.length);
    const prevSlide = () => setCurrentIndex((currentIndex - 1 + collections.length) % collections.length);

    return (
        <MarketplaceLayout auth={auth}>
            <Head title="shopping Kuy | Premier Preloved Experience" />

            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="bg-white/90 backdrop-blur-xl w-full max-w-[440px] rounded-[32px] shadow-2xl border border-white/20 overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
                        <div className="p-8 md:p-10 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-zinc-900/20">
                                <Check className="w-10 h-10 text-white stroke-[3px]" />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 mb-2">Berhasil Ditambahkan</h3>
                            <p className="text-zinc-500 font-medium mb-8 leading-relaxed">Item idamanmu sudah masuk ke Tas Belanja.</p>

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
                    </div>
                </div>
            )}

            <div className="font-['Poppins'] bg-white text-zinc-900 overflow-x-hidden">

                <section className="h-[480px] relative overflow-hidden bg-black flex items-center justify-center">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/friends-going-shopping-antique-store.jpg"
                            alt="Friends shopping Preloved"
                            className="w-full h-full object-cover object-[center_15%]"
                            style={{ filter: 'brightness(0.6)' }}
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                    </div>

                    <div className="max-w-[1400px] mx-auto px-6 md:px-20 w-full text-white relative z-10">

                        <div className="max-w-fit md:max-w-4xl mx-auto md:mx-0 space-y-8 animate-fade-in text-left">
                            <div className="space-y-3">

                                <h1 className="text-[26px] sm:text-4xl md:text-5xl lg:text-6xl font-semibold md:leading-[1.1] uppercase tracking-tighter">
                                    EKSPRESIKAN GAYAMU
                                    <span className="block opacity-50 font-medium">DENGAN OUTFITMU</span>
                                </h1>
                                <p className="text-zinc-300 text-[10px] md:text-[13px] font-medium tracking-[0.25em] md:tracking-[0.4em] uppercase">
                                    Koleksi Barang Bekas Berkualitas
                                </p>
                            </div>

                            <div className="flex flex-row items-center gap-3 md:gap-4">
                                <button onClick={(e) => {e.preventDefault(); router.get('/products')}} className="whitespace-nowrap bg-white border-2 border-white/50 text-black px-5 md:px-10 py-3.5 font-bold text-[10px] md:text-[13px] uppercase hover:bg-zinc-200 transition-all rounded-md shadow-xl">
                                    Mulai Belanja
                                </button>
                                <button className="whitespace-nowrap bg-transparent border-2 border-white/50 text-white px-5 md:px-10 py-3.5 font-bold text-[10px] md:text-[13px] uppercase hover:bg-white hover:text-black transition-all rounded-md">
                                    Mulai Berjualan
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-zinc-100 border-b border-zinc-200">
                    <div className="max-w-[1300px] mx-auto px-6 py-10">
                        <div className="bg-white border border-zinc-200 rounded-lg p-6 md:p-10 shadow-sm relative group">
                            <div className="flex flex-col items-center mb-8 md:mb-10 space-y-2 text-center">
                                <h2 className="text-[13px] font-bold uppercase tracking-[0.5em] text-zinc-900">Jelajahi Kategori</h2>
                                <p className="text-[12px] text-zinc-400 font-medium uppercase">Temukan barang yang mendefinisikan Anda</p>
                            </div>

                            <div className="relative overflow-hidden">
                                <button onClick={() => scrollCategories('left')} className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 border border-zinc-200 p-2 rounded-full shadow-lg">
                                    <ChevronRight className="w-4 h-4 rotate-180"/>
                                </button>

                                <div ref={categoryScrollRef} className="flex items-center md:justify-between overflow-x-auto no-scrollbar gap-6 md:gap-4 px-2 scroll-smooth">
                                    {(dbCategories || []).map((cat, i) => (
                                        <Link href="#" key={i} className="flex flex-col items-center group min-w-[85px] md:min-w-[90px] space-y-4">
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-transparent shadow-md group-hover:border-zinc-900 transition-all">
                                                <img
                                                    src={cat.img}
                                                    alt={cat.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400"; }}
                                                />
                                            </div>
                                            <span className="text-[12px] md:text-[11px] font-bold uppercase text-zinc-400 group-hover:text-zinc-900 text-center leading-tight">
                                                {cat.name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>

                                <button onClick={() => scrollCategories('right')} className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 border border-zinc-200 p-2 rounded-full shadow-lg">
                                    <ChevronRight className="w-4 h-4"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-zinc-50 py-12 md:py-16">
                    <div className="max-w-[1300px] mx-auto px-6">
                        <div className="flex justify-between items-end mb-8 md:mb-12">
                            <div className="space-y-1">
                                <h2 className="text-2xl md:text-4xl font-semibold er text-zinc-900 uppercase leading-none">Product Terbaru</h2>
                                <p className="text-zinc-400 text-[11px] font-medium tracking-[0.4em] uppercase"></p>
                            </div>
                            <Link href="/products" className="text-[11px] font-bold uppercase  border-b-2 border-zinc-900 pb-2 hover:opacity-50 transition-all">
                                Jelajai lainnya
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-8 md:gap-y-12">
                            {products && products.length > 0 ? (
                                products.slice(0, 10).map((product, index) => (
                                    <div key={product.id || index} className="flex flex-col h-full bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-xl">

                                        <Link
                                            href={route('product.detail', { product: product.id })}
                                            className="group cursor-pointer p-3 flex flex-col flex-grow"
                                        >
                                            <div className="relative aspect-[4/5] overflow-hidden bg-white mb-6 rounded-lg border border-zinc-100 shadow-sm transition-all duration-500 group-hover:shadow-xl">
                                                <div className="absolute top-4 left-4 z-20 bg-black/80 text-white px-3 py-1 text-[9px] font-bold uppercase  rounded-full">
                                                    {product.condition?.replace('_', ' ') || 'LIKE NEW'}
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleFavourite(product.id);
                                                    }}
                                                    className={`absolute top-4 right-4 z-20 p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110 active:scale-95
                                                        ${product.is_favourited
                                                            ? 'bg-red-500 border-red-500 shadow-red-200'
                                                            : 'bg-white/90 backdrop-blur-md border-transparent hover:bg-white'
                                                        }`}
                                                >
                                                    <svg
                                                        className={`w-4 h-4 transition-colors duration-300 ${
                                                            product.is_favourited ? 'text-white fill-current' : 'text-red-500 fill-none hover:fill-red-500'
                                                        }`}
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                    >
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                                    </svg>
                                                </button>

                                                <img
                                                    src={`/storage/${product.thumbnail}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800";
                                                    }}
                                                />

                                                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <span className="bg-white text-zinc-900 px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] shadow-2xl rounded-md">
                                                        Lihat Detail
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col flex-grow space-y-3 px-2">
                                                <p className="text-[12px] font-bold text-zinc-400 uppercase  truncate">
                                                    {product.shop?.name || 'RAYNAR PRELOVED STORE'}
                                                </p>

                                                <div className="min-h-[42px]">
                                                    <h3 className="text-[14px] font-semibold text-zinc-900  uppercase leading-tight line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                </div>

                                                <div>
                                                    <span className="text-[12px] font-bold bg-zinc-200 text-zinc-600 px-2.5 py-1 rounded-md uppercase">
                                                        Ukuran: {product.size || 'ALL SIZE'}
                                                    </span>
                                                </div>

                                                <div className="pt-1 flex flex-col mt-auto pb-2">
                                                    <span className="text-zinc-400 text-[11px] line-through font-medium mb-1">
                                                        Rp {(parseInt(product.price)).toLocaleString('id-ID')}
                                                    </span>
                                                    <p className="font-bold text-lg text-zinc-900 leading-none">
                                                        Rp {parseInt(product.price).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="px-3 pb-4">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleAddToCart(product.id);
                                                }}
                                                disabled={processing}
                                                className="w-full border-2 border-zinc-900 bg-white py-3 text-[11px] font-bold uppercase hover:bg-zinc-900 hover:text-white transition-all duration-300 rounded-xl disabled:opacity-50 active:scale-[0.98]"
                                            >
                                                {processing ? 'Processing...' : 'Masukkan ke Tas'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center">
                                    <p className="text-zinc-400 uppercase tracking-[0.2em] text-[11px]">Memuat koleksi terbaik...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="bg-white py-12 md:py-16">
                    <div className="max-w-[1300px] mx-auto px-6">

                        <div className="flex flex-col mb-6 md:mb-10">
                            <h2 className="text-2xl md:text-2xl md: font-semibold er text-zinc-900 uppercase">Koleksi Pilihan</h2>
                            <div className="flex items-center gap-4 mt-2">
                                <p className="text-zinc-400 text-[11px] font-medium uppercase tracking-[0.4em]">Handpicked Best Sellers</p>
                                <div className="h-[1px] flex-grow bg-zinc-100"></div>
                            </div>
                        </div>

                        <div className="relative group overflow-hidden rounded-lg h-[320px] bg-zinc-50 border border-zinc-100 shadow-sm mb-16">
                            <div className="flex w-full h-full transition-transform duration-1000 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                                {(collections || []).map((item, i) => (
                                    <div key={i} className="min-w-full h-full relative flex items-center">
                                        <img src={item?.img} className="w-full h-full object-cover" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                                        <div className="absolute bottom-8 right-12 text-right">
                                            <span className="text-[12px] font-bold text-white/70 uppercase  mb-1 block">{item?.label} Collection</span>
                                            <h4 className="text-3xl font-extrabold text-white uppercase  leading-none mb-4">{item?.name}</h4>
                                            <button onClick={() => router.get('/products')} className="bg-white text-zinc-900 px-6 py-2.5 font-bold text-[9px] uppercase  hover:bg-zinc-900 hover:text-white transition rounded-md shadow-xl">
                                                Explore Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/90 p-4 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition shadow-lg text-zinc-900">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                            </button>
                            <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/90 p-4 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition shadow-lg text-zinc-900">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                            </button>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
                                {(collections || []).map((_, i) => (
                                    <button key={i} onClick={() => setCurrentIndex(i)} className={`w-2 h-2 rounded-full border-2 border-white transition-all ${currentIndex === i ? 'bg-white' : 'bg-transparent'}`}></button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-end mt-12 mb-8 md:mt-16 md:mb-10">
                            <div className="space-y-1">
                                <h2 className="text-2xl md:text-2xl md: font-semibold er text-zinc-900 uppercase">Rekomendasi Seller</h2>
                                <p className="text-zinc-400 text-[12px] md:text-[11px] font-medium uppercase tracking-[0.4em]"> Dipercaya Banyak Pembeli</p>
                            </div>
                        </div>

                        <div className="relative group/seller">
                            <button
                                onClick={() => scrollSellers('left')}
                                className="md:hidden absolute left-[-10px] top-[40%] -translate-y-1/2 z-30 bg-white border border-zinc-200 p-2 rounded-full shadow-lg active:scale-95 transition-transform"
                            >
                                <svg className="w-4 h-4 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/>
                                </svg>
                            </button>

                            <div
                                ref={sellerScrollRef}
                                className="flex md:grid md:grid-cols-4 overflow-x-auto no-scrollbar gap-5 md:gap-8 pb-0 md:pb-0 scroll-smooth px-1"
                            >
                                {(recommendedSellers || []).map((seller, i) => (
                                    <div key={i} className="group cursor-pointer w-[75%] sm:w-[50%] md:w-full flex-shrink-0">
                                        <div className="grid grid-cols-2 gap-1 mb-5 rounded-lg overflow-hidden aspect-square bg-zinc-50 shadow-sm group-hover:shadow-md transition-shadow">
                                            <div className="h-full border-r border-zinc-100">
                                                <img src={seller?.images?.[0] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="grid grid-rows-2 gap-1">
                                                <img src={seller?.images?.[1] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" alt="" />
                                                <img src={seller?.images?.[2] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover" alt="" />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold border-4 border-white shadow-lg -mt-10 z-10 relative text-xs uppercase">
                                                {seller?.avatar || 'U'}
                                            </div>
                                            <div className="flex flex-col">
                                                <h5 className="text-[13px] md:text-[14px] font-bold uppercase  text-zinc-900 group-hover:underline">
                                                    {seller?.name || 'Unknown Seller'}
                                                </h5>
                                                <div className="flex gap-0.5 text-yellow-400">
                                                    {[...Array(5)].map((_, star) => (
                                                        <svg key={star} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => scrollSellers('right')}
                                className="md:hidden absolute right-[-10px] top-[40%] -translate-y-1/2 z-30 bg-white border border-zinc-200 p-2 rounded-full shadow-lg active:scale-95 transition-transform"
                            >
                                <svg className="w-4 h-4 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>

                <section className="bg-zinc-100 py-12 md:py-16 border-y border-zinc-200">
                    <div className="max-w-[1300px] mx-auto px-6">

                        <div className="text-center mb-10 md:mb-16 space-y-3">
                            <h2 className="text-2xl md:text-2xl font-semibold text-zinc-900 er uppercase leading-none">
                                Aman dan terlindungi
                            </h2>
                            <p className="text-zinc-500 max-w-2xl mx-auto text-[11px] md:text-[13px] font-medium leading-relaxed uppercase tracking-wide">
                                Komunitas jual beli aman dan seru, tempat pembeli dan penjual berbagi review asli yang terverifikasi.
                            </p>
                            <div className="w-12 h-[2px] bg-zinc-900 mx-auto mt-4"></div>
                        </div>

                        <div className="relative group/testi">
                            <button
                                onClick={() => scrollTestimonials('left')}
                                className="md:hidden absolute left-[-15px] top-1/2 -translate-y-1/2 z-30 bg-white/90 border border-zinc-200 p-2 rounded-full shadow-md active:scale-95 transition-all"
                            >
                                <svg className="w-3.5 h-3.5 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/>
                                </svg>
                            </button>

                            <div
                                ref={testimonialScrollRef}
                                className="flex md:grid md:grid-cols-4 overflow-x-auto no-scrollbar gap-4 md:gap-8 pb-0 md:pb-0 scroll-smooth snap-x snap-mandatory"
                            >
                                {testimonials.map((item, index) => (
                                    <div
                                        key={index}
                                        className="min-w-full md:min-w-0 snap-center group bg-white p-6 md:p-10 rounded-[16px] md:rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all duration-500 flex flex-col h-auto border border-zinc-50 shrink-0"
                                    >
                                        <div className="flex gap-1 mb-4 md:mb-8">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                                </svg>
                                            ))}
                                        </div>

                                        <div className="flex-grow">
                                            <p className="text-zinc-700 font-medium text-[12px] md:text-[14px] leading-relaxed mb-6 md:mb-10 ">
                                                "{item.comment}"
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 border-t border-zinc-100 pt-4 md:pt-8 mt-auto">
                                            <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-[10px] shadow-md">
                                                {item.avatar}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-[11px] md:text-[11px] font-bold uppercase text-zinc-900">
                                                    {item.user}
                                                </p>
                                                <p className="text-[8px] md:text-[12px] text-zinc-400 mt-0.5 uppercase font-semibold er">
                                                    Verified Buyer
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => scrollTestimonials('right')}
                                className="md:hidden absolute right-[-15px] top-1/2 -translate-y-1/2 z-30 bg-white/90 border border-zinc-200 p-2 rounded-full shadow-md active:scale-95 transition-all"
                            >
                                <svg className="w-3.5 h-3.5 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        </div>

                        <div className="mt-8 md:mt-20 text-center">
                            <Link href="#" className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-400 hover:text-zinc-900 transition-colors border-b border-transparent hover:border-zinc-900 pb-1">
                                Lihat Semua Ulasan Terverifikasi
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="bg-white py-12 md:py-16">
                    <div className="max-w-[1300px] mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                            <div className="lg:col-span-4 space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-bold uppercase er text-zinc-900">
                                        shopping<span className="opacity-20">.</span>Kuy
                                    </h3>
                                    <div className="w-12 h-[2px] bg-zinc-900"></div>
                                </div>
                                <p className="text-zinc-500 text-[13px] leading-relaxed font-medium">
                                    shopping Kuy adalah platform premier untuk komunitas fashion preloved. Kami mengkurasi setiap item dengan standar tinggi untuk memastikan kualitas dan keaslian barang.
                                    <br/><br/>
                                    Misi kami adalah mendefinisikan ulang gaya hidup berkelanjutan (*sustainable fashion*) melalui transaksi yang aman, transparan, dan terverifikasi.
                                </p>
                                <div className="pt-4 flex gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold text-zinc-900">50k+</span>
                                        <span className="text-[12px] font-bold text-zinc-400 uppercase ">Pengguna</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold text-zinc-900">120k+</span>
                                        <span className="text-[12px] font-bold text-zinc-400 uppercase ">Item Terjual</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                <div>
                                    <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-6">
                                        Pembayaran Aman
                                    </h4>
                                    <div className="grid grid-cols-4 gap-3">
                                        {['VISA', 'BCA', 'BNI', 'MDR', 'OVO', 'DANA', 'GPY', 'IDN'].map((pay, i) => (
                                            <div key={i} className="aspect-[3/2] bg-zinc-50 border border-zinc-100 rounded-md flex items-center justify-center p-2 grayscale hover:grayscale-0 transition-all duration-300 group cursor-default">
                                                <span className="text-[9px] font-bold text-zinc-400 group-hover:text-zinc-900">{pay}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-5 bg-zinc-50 rounded-lg border border-dashed border-zinc-200">
                                    <p className="text-[12px] text-zinc-500 leading-relaxed">
                                        *Seluruh transaksi dilindungi oleh sistem enkripsi SSL 256-bit dan diawasi oleh OJK untuk menjamin keamanan dana pembeli.
                                    </p>
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                <div>
                                    <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-6">
                                        Mitra Logistik
                                    </h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['JNE', 'SCP', 'JNT', 'NJV', 'ANT', 'PXL'].map((ship, i) => (
                                            <div key={i} className="h-12 bg-zinc-50 border border-zinc-100 rounded-md flex items-center justify-center p-3 grayscale hover:grayscale-0 transition-all duration-300 group cursor-default">
                                                <span className="text-[9px] font-bold text-zinc-400 group-hover:text-zinc-900">{ship}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-5 bg-zinc-900 text-white rounded-lg shadow-xl">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase ">Lacak Pengiriman</p>
                                        <p className="text-[9px] text-white/50">Pantau status pesananmu secara Real-Time.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

            </div>
        </MarketplaceLayout>
    );
}
