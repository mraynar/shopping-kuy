import React from 'react';
import { Link } from '@inertiajs/react';
import { UserCircle, ExternalLink } from 'lucide-react';

export default function ProfileLink() {
    return (
        <div className="bg-white rounded-xl p-10 border border-zinc-100 shadow-sm animate-fade-in">
            <h3 className="text-3xl font-bold text-zinc-900 uppercase mb-4 leading-none">Profil Publik</h3>
            <p className="text-zinc-400 text-[12px] font-bold uppercase mb-10 leading-relaxed">
                Kembali ke dashboard utama untuk mengelola Nama, Bio, dan Foto Profil Anda.
            </p>

            <Link
                href={route('profile.index')}
                className="inline-flex items-center gap-3 bg-zinc-900 text-white px-10 py-5 rounded-lg text-[11px] font-bold uppercase hover:bg-zinc-800 shadow-2xl transition-all active:scale-95"
            >
                <UserCircle className="w-4 h-4" />
                Buka Dashboard Profil
                <ExternalLink className="w-3 h-3 opacity-50" />
            </Link>
        </div>
    );
}
