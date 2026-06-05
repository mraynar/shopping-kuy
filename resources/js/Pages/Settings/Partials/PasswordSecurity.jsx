import React from 'react';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';

export default function PasswordSecurity() {
    return (
        <div className="space-y-10 animate-fade-in">
            {/* Box Ganti Password */}
            <div className="bg-white rounded-xl p-10 border border-zinc-100 shadow-sm">
                <div className="mb-10">
                    <h3 className="text-3xl font-bold text-zinc-900 uppercase leading-none">Kata Sandi</h3>
                    <p className="text-zinc-400 text-[11px] font-bold uppercase mt-3">Pastikan akun Anda menggunakan password yang kuat</p>
                </div>
                <UpdatePasswordForm className="max-w-2xl" />
            </div>

            {/* Box Hapus Akun */}
            <div className="bg-white rounded-[24px] p-10 border border-zinc-100 shadow-sm border-red-50">
                <div className="mb-10">
                    <h3 className="text-3xl font-bold text-red-600 uppercase leading-none">Hapus Akun</h3>
                    <p className="text-zinc-400 text-[11px] font-bold uppercase mt-3">Tindakan ini permanen dan tidak bisa dibatalkan</p>
                </div>
                <DeleteUserForm className="max-w-2xl" />
            </div>
        </div>
    );
}
