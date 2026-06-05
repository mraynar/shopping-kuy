import React, { useState, useEffect } from 'react';
import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { User, Package, Star, Store, ChevronRight, Menu, X } from 'lucide-react';

// Import Partials
import PersonalInfo from './Partials/PersonalInfo';
import MyPurchases from './Partials/MyPurchases';
import Reviews from './Partials/Reviews';
import SellerCenter from './Partials/SellerCenter';

export default function Profile({ auth, orders, reviews, storeStats, activeTab }) {
    // 1. STATE MANAGEMENT - Menggunakan 'info' sebagai default utama
    const [currentTab, setCurrentTab] = useState(activeTab || 'info');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Sync state jika props activeTab dari server berubah
    useEffect(() => {
        if (activeTab) {
            setCurrentTab(activeTab);
        }
    }, [activeTab]);

    const { processing: creatingShop } = useForm();
    const hasShop = auth.user.shop !== null;

    // SINKRONISASI ID: Menggunakan 'info' agar cocok dengan controller
    const menuItems = [
        { id: 'info', label: 'Info Personal', icon: User },
        { id: 'orders', label: 'Pembelian Saya', icon: Package },
        { id: 'reviews', label: 'Ulasan', icon: Star },
        { id: 'store', label: hasShop ? 'Toko Saya' : 'Buka Toko', icon: Store },
    ];

    // 2. HANDLER FUNGSI
    const handleTabChange = (id) => {
        router.get(route('profile.index'), { tab: id }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onSuccess: () => {
                setCurrentTab(id);
                setIsMobileMenuOpen(false);
            }
        });
    };

    // 3. LOGIKA RENDER (Case disesuaikan dengan ID baru)
    const renderContent = () => {
        switch (currentTab) {
            case 'info': return <PersonalInfo auth={auth} />;
            case 'orders': return <MyPurchases orders={orders} />;
            case 'reviews': return <Reviews reviews={reviews} />;
            case 'store': return <SellerCenter auth={auth} shop={auth.user.shop} />;
            default: return <PersonalInfo auth={auth} />;
        }
    };

    const userPhoto = auth?.user?.avatar || auth?.user?.profile_photo_url;

    return (
        <MarketplaceLayout auth={auth}>
            <Head title="My Profile | Shopping Kuy" />
            <div className="bg-[#FAFAFA] min-h-screen relative font-['Poppins']">

                {/* MOBILE SIDEBAR OVERLAY */}
                <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className={`absolute left-0 top-0 bottom-0 w-80 bg-white p-8 transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="flex justify-between items-center mb-12 text-zinc-900">
                            <h2 className="text-2xl font-black uppercase">Menu</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-zinc-50 rounded-md"><X className="w-5 h-5" /></button>
                        </div>
                        <nav className="space-y-3">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleTabChange(item.id)}
                                    className={`w-full flex items-center justify-between p-5 rounded-lg font-bold uppercase text-[11px] transition-all ${
                                        currentTab === item.id ? 'bg-zinc-900 text-white shadow-xl' : 'text-zinc-400 hover:bg-zinc-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="max-w-[1300px] mx-auto px-6 py-6 md:py-14">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* DESKTOP SIDEBAR */}
                        <div className="hidden lg:block lg:col-span-3">
                            <div className="bg-white rounded-[16px] p-8 border border-zinc-100 shadow-sm sticky top-32">
                                <div className="flex flex-col items-center mb-10 text-center">
                                    {/* ... bagian foto profil tetap sama ... */}
                                    <div className="w-24 h-24 bg-zinc-900 rounded-[16px] mb-4 flex items-center justify-center text-white text-3xl font-black shadow-2xl uppercase overflow-hidden relative">
                                        {userPhoto ? (
                                            <img
                                                src={userPhoto}
                                                alt={auth.user.name}
                                                className="w-full h-full object-cover absolute inset-0 z-10"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : null}
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white">
                                            {auth.user.name.charAt(0)}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-zinc-900 uppercase text-md truncate w-full px-2">{auth.user.name}</h4>
                                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mt-1">Premium Member</p>
                                </div>

                                <nav className="space-y-2">
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.id}
                                            disabled={creatingShop}
                                            onClick={() => handleTabChange(item.id)}
                                            className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 group ${
                                                currentTab === item.id
                                                ? 'bg-zinc-900 text-white shadow-xl translate-x-1' // Dikurangi dari x-2 ke x-1 agar tidak terlalu memakan ruang
                                                : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3"> {/* gap dikurangi sedikit dari 4 ke 3 */}
                                                <item.icon className={`w-5 h-5 shrink-0 ${item.id === 'store' && !hasShop ? 'text-zinc-300' : ''}`} />
                                                {/* Tambahkan whitespace-nowrap di bawah ini */}
                                                <span className="text-sm font-bold uppercase whitespace-nowrap">{item.label}</span>
                                            </div>
                                            {currentTab === item.id && <ChevronRight className="w-4 h-4 shrink-0" />}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="lg:col-span-9">
                            <div className="lg:hidden mb-8 flex items-center gap-4 bg-white p-6 rounded-lg border border-zinc-100 shadow-sm">
                                <button onClick={() => setIsMobileMenuOpen(true)} className="p-3 bg-zinc-50 rounded-lg text-zinc-900">
                                    <Menu className="w-6 h-6" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-zinc-900 rounded-md flex items-center justify-center text-white font-black text-sm uppercase overflow-hidden">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                    <span className="font-black uppercase text-lg text-zinc-900">
                                        {currentTab === 'info' ? 'Info Personal' : currentTab.replace('-', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
