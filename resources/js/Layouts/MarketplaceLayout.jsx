import React, { useState, useEffect } from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import { Mail, ShoppingBag, Search, Heart } from 'lucide-react';
import useCartStore from '@/Pages/Transactions/useCartStore';

export default function MarketplaceLayout({ children, auth }) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { post } = useForm();
    const { cartCount, setCartCount } = useCartStore();

    useEffect(() => {
        if (auth?.cart_count !== undefined) {
            setCartCount(auth.cart_count);
        }
    }, [auth?.cart_count]);

    useEffect(() => {
        const syncData = () => {
            router.reload({
                only: ['auth'],
                onSuccess: (page) => {
                    const count = page.props.auth?.cart_count;
                    if (typeof count === 'number') {
                        setCartCount(count);
                    }
                }
            });
        };

        const handlePageShow = (event) => {
            if (event.persisted) syncData();
        };

        const handlePopState = () => syncData();

        window.addEventListener('pageshow', handlePageShow);
        window.addEventListener('popstate', handlePopState);

        const unbind = router.on('success', (event) => {
            const newCount = event.detail.page.props.auth?.cart_count;
            if (typeof newCount === 'number') {
                setCartCount(newCount);
            }
        });

        return () => {
            window.removeEventListener('pageshow', handlePageShow);
            window.removeEventListener('popstate', handlePopState);
            unbind();
        };
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        post(route('logout'), {
            onSuccess: () => {
                setCartCount(0);
                router.visit(route('login'), { replace: true });
            }
        });
    };

    const showBadge = auth?.user && cartCount > 0;

    const handleCartClick = (e) => {
        e.preventDefault();
        if (auth?.user) {
            router.get(route('cart.index'));
        } else {
            router.get(route('login'));
        }
    };

    return (
        <div className="bg-white min-h-screen text-zinc-900 antialiased font-['Poppins'] flex flex-col">
            <div className="bg-zinc-200/70 py-3 px-6 text-[12px] flex justify-between uppercase font-bold border-b border-zinc-100">
                <span className="opacity-70">Garansi 100% Uang Kembali Selama 6 Bulan</span>
                <div className="hidden md:flex gap-8">
                    <Link href="#" className="hover:text-zinc-500 transition-colors">Bantuan</Link>
                    <Link href="#" className="hover:text-zinc-500 transition-colors">Tentang shopping Kuy</Link>
                </div>
            </div>

            <nav className="border-b border-zinc-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                    <div className="h-16 md:h-20 flex items-center justify-between lg:justify-start lg:gap-12">
                        <Link href="/" className="text-lg md:text-2xl font-black uppercase shrink-0">
                            shopping<span className="opacity-20">.</span>Kuy
                        </Link>

                        <div className="hidden lg:flex gap-10 text-[13px] font-bold uppercase shrink-0">
                            <Link href="#" className="hover:text-zinc-500 transition-colors">Wanita</Link>
                            <Link href="#" className="hover:text-zinc-500 transition-colors">Pria</Link>
                            <Link href="#" className="hover:text-zinc-500 transition-colors">Elektronik</Link>
                            <Link href="#" className="text-red-600 hover:text-red-700 transition-colors">Sale</Link>
                        </div>

                        <div className="hidden lg:flex flex-1 max-w-xl relative group">
                            <input
                                type="text"
                                placeholder="Cari item preloved idamanmu..."
                                className="w-full bg-zinc-100 border-transparent rounded-xl py-3.5 px-12 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
                            />
                            <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                        </div>

                        <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-auto lg:ml-0">
                            {!auth?.user ? (
                                <div className="flex items-center gap-2 md:gap-4">
                                    <Link href="/login" className="text-[10px] md:text-[12px] font-bold uppercase hover:text-zinc-500 transition px-2 py-1">Masuk</Link>
                                    <Link href="/register" className="bg-zinc-900 text-white px-4 md:px-6 py-2 md:py-3 rounded-md md:rounded-lg text-[10px] md:text-[12px] font-bold uppercase hover:bg-zinc-800 transition shadow-lg">Daftar</Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <Link href="/messages" className="relative p-2 hover:bg-zinc-100 rounded-full transition-all group hover:scale-110">
                                        <Mail className="w-5 h-5 md:w-6 md:h-6 text-zinc-800 transition-transform" />
                                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                                    </Link>

                                    <Link href="#" className="relative p-2 hover:bg-zinc-100 rounded-full transition-all group hover:scale-110">
                                        <Heart className="w-5 h-5 md:w-6 md:h-6 text-zinc-800 transition-transform" />
                                    </Link>

                                    <button onClick={handleCartClick} className="relative p-2 hover:bg-zinc-100 rounded-full transition-all group hover:scale-110">
                                        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-zinc-800 transition-transform" />
                                        {showBadge && (
                                            <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[9px] md:text-[11px] font-black min-w-[18px] md:min-w-[22px] h-[18px] md:h-[22px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                                {cartCount}
                                            </span>
                                        )}
                                    </button>

                                    <div className="relative ml-1 md:ml-2">
                                        <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-zinc-900 border-2 border-transparent hover:border-zinc-900 transition-all overflow-hidden flex items-center justify-center shadow-sm relative hover:scale-105 active:scale-95">
                                            {(() => {
                                                const photoSource = auth.user.avatar || auth.user.profile_photo_url;
                                                return photoSource ? (
                                                    <img src={photoSource} alt={auth.user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white text-[10px] md:text-sm font-bold uppercase bg-zinc-900">{auth.user.name ? auth.user.name.charAt(0) : 'U'}</div>
                                                );
                                            })()}
                                        </button>

                                        {isUserMenuOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                                                <div className="absolute -right-2 md:-right-4 mt-4 w-48 md:w-60 bg-white rounded-[20px] md:rounded-[16px] shadow-2xl border border-zinc-100 py-2 md:py-3 z-20 animate-in fade-in zoom-in duration-200">
                                                    <Link href={route('profile.index')} className="flex items-center px-4 md:px-6 py-2 md:py-3 text-[10px] md:text-[12px] font-bold uppercase text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition">Profil Saya</Link>
                                                    <Link href={route('settings.index')} className="flex items-center px-4 md:px-6 py-2 md:py-3 text-[10px] md:text-[12px] font-bold uppercase text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition">Pengaturan</Link>
                                                    <div className="border-t border-zinc-50 mt-1 pt-1">
                                                        <button onClick={handleLogout} className="w-full flex items-center px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-[12px] font-black uppercase text-red-500 hover:bg-red-50 transition-all rounded-b-[20px] md:rounded-b-[24px]">Keluar Akun</button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow">{children}</main>

            <footer className="bg-zinc-950 pt-12 md:pt-24 pb-12 text-white border-t border-white/5">
                <div className="max-w-[1300px] mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-x-12 gap-y-16 mb-12 md:mb-24">
                        <div className="col-span-2 lg:col-span-4 space-y-10">
                            <h3 className="text-3xl font-black uppercase tracking-tighter">shopping<span className="text-white/20">.</span>Kuy</h3>
                            <p className="text-zinc-400 text-[12px] leading-relaxed font-medium uppercase max-w-sm">Platform curated fashion preloved nomor satu di Indonesia. Kami menjamin keaslian dan kualitas setiap produk yang terdaftar di marketplace kami.</p>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-12 text-[12px] font-bold text-zinc-500 uppercase">© 2026 shopping Kuy Global Group. Inspired by Excellence.</div>
                </div>
            </footer>
        </div>
    );
}
