import React from 'react';
import { Link } from '@inertiajs/react';
import { Lock, ArrowUpRight } from 'lucide-react';

export default function PasswordReset() {
    return (
        <div className="bg-white rounded-xl p-10 border border-zinc-100 shadow-sm animate-fade-in">
            <h3 className="text-2xl font-black text-zinc-900 uppercase mb-4">Keamanan</h3>
            <p className="text-zinc-400 text-[12px] font-bold uppercase mb-10 leading-relaxed">
                Demi keamanan, perubahan kata sandi memerlukan konfirmasi melalui email Anda.
            </p>

            <Link
                href={route('password.request')}
                className="flex items-center justify-between w-full p-8 bg-zinc-50 rounded-lg group hover:bg-zinc-900 transition-all duration-500"
            >
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:bg-zinc-800">
                        <Lock className="w-5 h-5 text-zinc-900 group-hover:text-white" />
                    </div>
                    <div>
                        <span className="block text-[13px] font-black uppercase text-zinc-900 group-hover:text-white">Ganti Kata Sandi</span>
                        <span className="block text-[10px] font-bold uppercase text-zinc-400 group-hover:text-zinc-500">Kirim Link Konfirmasi ke Email</span>
                    </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-zinc-300 group-hover:text-white" />
            </Link>
        </div>
    );
}
