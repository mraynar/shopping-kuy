import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { 
    LayoutDashboard, Store, Users, LogOut, ArrowLeft, Menu, X, User
} from 'lucide-react';

export default function AdminLayout({ children, auth }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post(route('logout'), {
            onSuccess: () => {
                router.visit(route('login'), { replace: true });
            }
        });
    };

    const navLinks = [
        { 
            href: '/admin/dashboard', 
            label: 'Dashboard', 
            icon: <LayoutDashboard className="w-5 h-5" />,
            active: window.location.pathname === '/admin/dashboard'
        },
        { 
            href: '/admin/shops', 
            label: 'Kelola Toko', 
            icon: <Store className="w-5 h-5" />,
            active: window.location.pathname === '/admin/shops'
        }
    ];

    return (
        <div className="bg-[#F8F9FA] min-h-screen text-zinc-900 antialiased font-['Poppins'] flex">
            
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-zinc-950 text-white shrink-0 h-screen sticky top-0">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <Link href="/admin/dashboard" className="text-base font-black uppercase tracking-wider">
                        shopping<span className="text-white/40">.</span>Admin
                    </Link>
                </div>

                <nav className="flex-grow p-4 space-y-2 mt-4">
                    {navLinks.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${link.active ? 'bg-white text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-4">
                    {/* User profile at sidebar bottom */}
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                            {auth?.user?.avatar ? (
                                <img src={auth.user.avatar} className="w-full h-full object-cover" alt="" />
                            ) : (
                                auth?.user?.name?.charAt(0) || 'A'
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-black truncate">{auth?.user?.name || 'Admin User'}</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">{auth?.user?.role || 'Admin'}</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-350 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-[100] flex lg:hidden">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
                    <aside className="relative flex flex-col w-64 bg-zinc-950 text-white h-full animate-in slide-in-from-left duration-200">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <span className="text-base font-black uppercase tracking-wider">shopping.Admin</span>
                            <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-grow p-4 space-y-2 mt-4">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${link.active ? 'bg-white text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    {link.icon}
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-white/10 space-y-4">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-350 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                Keluar
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Area */}
            <div className="flex-grow flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white border-b border-zinc-200/80 sticky top-0 z-40 h-16 md:h-20 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-zinc-650 hover:text-zinc-950">
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href="/" className="inline-flex items-center gap-2 text-zinc-450 hover:text-zinc-950 transition-colors text-xs font-bold uppercase tracking-wider">
                            <ArrowLeft className="w-4 h-4" /> Balik Ke Toko
                        </Link>
                    </div>

                    <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">
                        Panel Kontrol Admin
                    </div>
                </header>

                <main className="flex-grow p-6 md:p-8">
                    {children}
                </main>
            </div>

        </div>
    );
}
