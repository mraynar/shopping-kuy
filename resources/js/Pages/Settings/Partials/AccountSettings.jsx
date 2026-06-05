import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Mail, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import InputError from '@/Components/InputError';

export default function AccountSettings({ auth }) {
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        // Data yang diubah di tab ini
        email: auth.user.email || '',
        phone: auth.user.phone || '',

        // Data pendukung (Harus ikut dikirim agar validasi ProfileController @required lolos)
        name: auth.user.name || '',
        bio: auth.user.bio || '',
        address: auth.user.address || '',
        address_notes: auth.user.address_notes || '',
        province_id: auth.user.province_id || '',
        city_id: auth.user.city_id || '',
        district_id: auth.user.district_id || '',
        subdistrict_id: auth.user.subdistrict_id || '',
        postal_code: auth.user.postal_code || '',
    });

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccess(true);
            },
            onError: (errors) => {
                console.log("Gagal simpan:", errors);
            }
        });
    };

    return (
        <div className="bg-white rounded-xl p-8 md:p-10 border border-zinc-100 shadow-sm relative">
            <div className="flex justify-between items-center mb-12">
                <div className="space-y-1 text-left">
                    <h3 className="text-xl md:text-3xl font-bold text-zinc-900 uppercase leading-none er">Informasi Akun</h3>
                    <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Update your credential details</p>
                </div>
            </div>

            <form onSubmit={submit} className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-900 transition-all" />
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className={`w-full bg-zinc-50 border-none rounded-lg pl-14 pr-5 py-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none transition-all ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                            />
                        </div>
                        <InputError message={errors.email} className="ml-2 text-[10px] uppercase font-bold" />
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black uppercase text-zinc-400 ml-2 tracking-widest">Nomor WhatsApp</label>
                        <div className="relative group">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-900 transition-all" />
                            <input
                                type="text"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className={`w-full bg-zinc-50 border-none rounded-lg pl-14 pr-5 py-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none transition-all ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                                placeholder="0812..."
                            />
                        </div>
                        <InputError message={errors.phone} className="ml-2 text-[10px] uppercase font-bold" />
                    </div>
                </div>

                <div className="pt-4 text-left border-t border-zinc-50 pt-10">
                    <button
                        type="submit"
                        disabled={processing}
                        className="justify-center w-full md:w-auto bg-zinc-900 text-white px-16 py-5 rounded-xl text-[13px] font-black uppercase hover:bg-zinc-800 shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                    >
                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>

            {/* POPUP SUCCESS - CENTER */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white text-slate-900 px-10 py-8 rounded-[32px] shadow-2xl flex flex-col items-center gap-6 border border-white/10 max-w-sm text-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold uppercase er">Berhasil Simpan!</p>
                            <p className="text-[12px] font-bold text-zinc-600 uppercase tracking-[0.2em] leading-relaxed">
                                Berhasil menyimpan data Anda,<br /> selamat berbelanja....
                            </p>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-green-500 origin-left" style={{ animation: 'shrink 4s linear forwards' }}></div>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shrink {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
            `}} />
        </div>
    );
}
