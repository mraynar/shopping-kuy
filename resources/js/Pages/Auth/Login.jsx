import React, { useEffect, useState } from 'react';
import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function Login({ status, canResetPassword, auth }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false,
    });

    useEffect(() => { return () => { reset('password'); }; }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <MarketplaceLayout auth={auth}>
            <Head title="Masuk Akun" />
            <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50 font-['Poppins'] py-12 px-6">
                <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-[24px] shadow-md border border-zinc-200">
                    <div className="mb-8 text-center">
                        {/* Judul dikecilkan ke text-2xl */}
                        <h1 className="text-2xl font-black  text-zinc-900 uppercase">Welcome Back</h1>
                        {/* Teks pendukung dikurangi ketebalannya ke font-medium */}
                        <p className="text-zinc-400 text-[11px] font-medium uppercase  mt-2">Masuk untuk belanja kembali</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-bold uppercase text-zinc-500 ml-1">Email Address</label>
                            <div className="relative group">
                                {/* Ukuran icon dikecilkan ke w-4 h-4 dan posisi dirapikan */}
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
                                <TextInput
                                    type="email"
                                    value={data.email}
                                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-zinc-900 text-sm font-semibold transition-all"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@email.com"
                                    required
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[12px] font-bold uppercase text-zinc-500">Password</label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-[9px] font-bold uppercase text-zinc-400 hover:text-zinc-900">Lupa?</Link>
                                )}
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
                                <TextInput
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    className="w-full pl-12 pr-11 py-3.5 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-zinc-900 text-sm font-semibold transition-all"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-900 transition-colors">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-zinc-900 text-white py-4 rounded-lg text-[12px] font-bold uppercase shadow-lg hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
                        >
                            {processing ? 'Loading...' : 'Sign In'}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-100"></span></div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white px-4 text-zinc-300">Or continue with</span></div>
                        </div>

                        <a href={route('google.login')} className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 text-zinc-900 py-4 rounded-lg text-[12px] font-bold uppercase hover:bg-zinc-50 transition-all shadow-sm active:scale-[0.98]">
                            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
                            Sign In with Google
                        </a>

                        <p className="text-center pt-4 text-[12px] font-medium text-zinc-400 uppercase ">
                            Belum punya akun? <Link href={route('register')} className="text-zinc-900 font-bold underline">Daftar</Link>
                        </p>
                    </form>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
