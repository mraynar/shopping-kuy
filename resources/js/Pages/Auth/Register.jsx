import React, { useEffect, useState } from 'react';
import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

export default function Register({ auth }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });

    useEffect(() => { return () => { reset('password', 'password_confirmation'); }; }, []);

    const submit = (e) => { e.preventDefault(); post(route('register')); };

    return (
        <MarketplaceLayout auth={auth}>
            <Head title="Daftar Akun" />
            <div className="min-h-[85vh] flex items-center justify-center bg-zinc-50 font-['Poppins'] py-12 px-6">
                <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-[24px] shadow-md border border-zinc-200">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-black  text-zinc-900 uppercase">Join Us</h1>
                        <p className="text-zinc-400 text-[11px] font-medium uppercase mt-2">Daftar dan bergabung dengan kami</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* INPUT NAMA */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-bold uppercase text-zinc-500 ml-1">Nama Lengkap</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
                                <TextInput
                                    value={data.name}
                                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-zinc-900 text-sm font-semibold transition-all"
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama Anda"
                                    required
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        {/* INPUT EMAIL */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-bold uppercase text-zinc-500 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
                                <TextInput
                                    type="email"
                                    value={data.email}
                                    className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-zinc-900 text-sm font-semibold transition-all"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@anda.com"
                                    required
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* INPUT PASSWORD */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-bold uppercase text-zinc-500 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    className="w-full pl-12 pr-11 py-3.5 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-zinc-900 text-sm font-semibold outline-none transition-all"
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

                        {/* KONFIRMASI PASSWORD */}
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-bold uppercase text-zinc-500 ml-1">Konfirmasi Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    className="w-full pl-12 pr-11 py-3.5 bg-zinc-50 border-none rounded-lg focus:ring-2 focus:ring-zinc-900 text-sm font-semibold outline-none transition-all"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-900 transition-colors">
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-zinc-900 text-white py-4 rounded-lg text-[12px] font-bold uppercase shadow-lg hover:bg-zinc-800 transition-all disabled:opacity-50 mt-4 active:scale-[0.98]"
                        >
                            {processing ? 'Loading...' : 'Create Account'}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-100"></span></div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white px-4 text-zinc-300">Quick Access</span></div>
                        </div>

                        <a href={route('google.login')} className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 text-zinc-900 py-4 rounded-lg text-[12px] font-bold uppercase hover:bg-zinc-50 transition-all shadow-sm active:scale-[0.98]">
                            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
                            Sign up with Google
                        </a>

                        <p className="text-center pt-4 text-[12px] font-medium text-zinc-400 uppercase ">
                            Sudah punya akun? <Link href={route('login')} className="text-zinc-900 font-bold underline">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
