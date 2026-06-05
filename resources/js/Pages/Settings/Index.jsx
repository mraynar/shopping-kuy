import React, { useState, useEffect } from 'react';
import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import { Head, router } from '@inertiajs/react';
import { ShieldCheck, Lock, UserCircle, ChevronRight, Menu, X } from 'lucide-react';

// Import Partials
import AccountSettings from './Partials/AccountSettings';
import PasswordSecurity from './Partials/PasswordSecurity';
import ProfileLink from './Partials/ProfileLink';

export default function Settings({ auth, activeTab }) {
    // 1. STATE MANAGEMENT - Perbaikan Inisialisasi & Fallback
    // Menggunakan activeTab dari props (backend) sebagai initial state
    const [currentTab, setCurrentTab] = useState(activeTab || 'account');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Sync state jika props activeTab dari server berubah
    useEffect(() => {
        if (activeTab) {
            setCurrentTab(activeTab);
        }
    }, [activeTab]);

    const menuItems = [
        { id: 'account', label: 'Akun Saya', icon: ShieldCheck },
        { id: 'security', label: 'Keamanan', icon: Lock },
        { id: 'profile', label: 'Edit Profil', icon: UserCircle },
    ];

    // 2. HANDLER FUNGSI
    // Fungsi navigasi cerdas agar URL sinkron ?tab=id
    const handleTabChange = (id) => {
        router.get(route('settings.index'), { tab: id }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onSuccess: () => {
                setCurrentTab(id);
                setIsMobileMenuOpen(false);
            }
        });
    };

    // 3. SAFETY RENDER (Mencegah Layar Kosong)
    const renderContent = () => {
        switch (currentTab) {
            case 'account': return <AccountSettings auth={auth} />;
            case 'security': return <PasswordSecurity />;
            case 'profile': return <ProfileLink />;
            default: return <AccountSettings auth={auth} />; // Fallback aman
        }
    };

    return (
        <MarketplaceLayout auth={auth}>
            <Head title="Pengaturan | Shopping Kuy" />
            <div className="bg-[#FAFAFA] min-h-screen font-['Poppins']">

                <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                    <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className={`absolute top-0 left-0 bottom-0 w-80 bg-white p-8 shadow-2xl transition-transform duration-500 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Menu</h2>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-zinc-50 rounded-md">
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
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

                    <div className="lg:hidden mb-8 flex items-center gap-4 bg-white p-6 rounded-lg border border-zinc-100 shadow-sm">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-3 bg-zinc-50 rounded-lg active:scale-95 transition-all text-zinc-900"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-900 rounded-md flex items-center justify-center text-white font-black text-xs uppercase shadow-sm">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black uppercase tracking-tight text-zinc-900 leading-none">Settings</h2>
                                <p className="text-[9px] font-bold uppercase text-zinc-400 mt-1">{currentTab.replace('-', ' ')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="hidden lg:block lg:col-span-3">
                            <div className="bg-white rounded-[16px] p-8 border border-zinc-100 shadow-sm sticky top-32">
                                <div className="flex flex-col items-center mb-10 text-center px-2">
                                    <div className="w-20 h-20 bg-zinc-50 rounded-lg border border-zinc-100 mb-4 flex items-center justify-center text-zinc-900 text-2xl font-black shadow-sm uppercase">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <h4 className="font-bold text-zinc-900 uppercase text-md">Keamanan Akun</h4>
                                    <p className="text-xs font-bold text-zinc-400 uppercase mt-2">Privasi Shopping Kuy</p>
                                </div>

                                <nav className="space-y-2">
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleTabChange(item.id)}
                                            className={`w-full flex items-center justify-between p-5 rounded-lg transition-all duration-300 ${
                                                currentTab === item.id
                                                ? 'bg-zinc-900 text-white shadow-xl translate-x-2'
                                                : 'text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <item.icon className="w-5 h-5" />
                                                <span className="text-sm font-bold uppercase">{item.label}</span>
                                            </div>
                                            {currentTab === item.id && <ChevronRight className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="lg:col-span-9">
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
