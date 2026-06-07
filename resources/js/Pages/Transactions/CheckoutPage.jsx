import React, { useState, useEffect, useRef } from 'react';
import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft, MapPin, ShieldCheck, Truck,
    ArrowRight, Check, Loader2, Package, CreditCard,
    ChevronDown, ChevronUp
} from 'lucide-react';
import axios from 'axios';
import useCartStore from '@/Pages/Transactions/useCartStore';

const CourierLogo = ({ id }) => {
    const map = {
        jne:      { bg: '#CC1C22', text: 'JNE',      fs: 14 },
        jnt:      { bg: '#D0111A', text: 'J&T',       fs: 13 },
        sicepat:  { bg: '#F47920', text: 'SiCepat',   fs: 9  },
        anteraja: { bg: '#003087', text: 'AnteraJa',  fs: 8  },
        pos:      { bg: '#CC1C22', text: 'POS',       fs: 12 },
        tiki:     { bg: '#F47920', text: 'TIKI',      fs: 13 },
    };
    const c = map[id] || { bg: '#52525b', text: id.toUpperCase(), fs: 11 };
    return (
        <svg viewBox="0 0 72 26" style={{ height: 26, width: 'auto' }}>
            <rect width="72" height="26" rx="5" fill={c.bg} />
            <text x="36" y="17" textAnchor="middle" fill="white"
                fontSize={c.fs} fontWeight="bold" fontFamily="Arial,Helvetica,sans-serif">
                {c.text}
            </text>
        </svg>
    );
};

const COURIERS = [
    { id: 'jne',      name: 'JNE' },
    { id: 'jnt',      name: 'J&T Express' },
    { id: 'sicepat',  name: 'SiCepat' },
    { id: 'anteraja', name: 'AnteraJa' },
    { id: 'pos',      name: 'POS Indonesia' },
    { id: 'tiki',     name: 'TIKI' },
];

const PAYMENT_METHODS = [
    {
        group: 'Midtrans Payment',
        icon: <CreditCard className="w-4 h-4" />,
        options: [
            {
                id: 'midtrans',
                label: 'Midtrans Snap',
                note: 'QRIS, Bank Transfer, E-Wallet, Kartu Kredit',
            }
        ]
    }
];

export default function CheckoutPage({ auth, cartItems: propCartItems = [] }) {
    const snapLoaded = useRef(false);

        useEffect(() => {

            // Snap sudah tersedia di window (sudah load sebelumnya)
            if (window.snap) {
                snapLoaded.current = true;
                return;
            }

            const existingScript = document.getElementById('midtrans-snap-script');

            // Script sudah ada di DOM, attach onload handler tanpa hapus script
            if (existingScript) {
                existingScript.onload = () => {
                    console.log('MIDTRANS SNAP LOADED (existing script)');
                    snapLoaded.current = true;
                };
                return;
            }

            // Buat script baru
            const script = document.createElement('script');

            script.id = 'midtrans-snap-script';

            script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';

            script.setAttribute(
                'data-client-key',
                import.meta.env.VITE_MIDTRANS_CLIENT_KEY
            );

            script.async = true;

            script.onload = () => {
                console.log('MIDTRANS SNAP LOADED');
                snapLoaded.current = true;
            };

            script.onerror = () => {
                console.error('GAGAL LOAD MIDTRANS SNAP SCRIPT');
            };

            document.head.appendChild(script);

            return () => {
                snapLoaded.current = false;
            };

        }, []);

    const { cartItems: storeItems } = useCartStore();
    const rawItems = propCartItems.length > 0 ? propCartItems : (storeItems || []);
    const [selectedItemIds, setSelectedItemIds] = useState(() => new Set(rawItems.map(i => i.id)));
    const checkedItems = rawItems.filter(i => selectedItemIds.has(i.id));

    const toggleItem = (id) => setSelectedItemIds(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const toggleAll = () => setSelectedItemIds(
        selectedItemIds.size === rawItems.length ? new Set() : new Set(rawItems.map(i => i.id))
    );

    const [selectedCourier, setSelectedCourier]   = useState(null);
    const [selectedService, setSelectedService]     = useState(null);
    const [shippingOptions, setShippingOptions]     = useState([]);
    const [loadingShipping, setLoadingShipping]     = useState(false);
    const [showAllServices, setShowAllServices]     = useState(false);

    const [selectedPayment, setSelectedPayment] = useState('midtrans');
    const [openPaymentGroup, setOpenPaymentGroup] = useState('Midtrans Payment');

    const [loadingOrder, setLoadingOrder] = useState(false);
    const [error, setError]               = useState(null);

    const subtotal    = checkedItems.reduce((a, i) => a + Number(i.price) * (i.quantity || 1), 0);
    const shippingCost = selectedService?.cost ?? 0;
    const total        = subtotal + shippingCost;
    const totalWeight  = checkedItems.reduce((a, i) => a + 500 * (i.quantity || 1), 0);

    const u = auth.user;
    const fullAddress = u?.address_notes
        ? [u.address_notes, u.subdistrict_name, u.district_name, u.city_name, u.province_name, u.postal_code]
            .filter(Boolean).join(', ')
        : null;

    const destinationId = u?.rajaongkir_destination_id ?? null;

    const fetchShipping = async (courier) => {
        if (!destinationId) {
            setError('Lengkapi alamat & konfirmasi titik pengiriman di profil terlebih dahulu.');
            return;
        }
        setLoadingShipping(true);
        setShippingOptions([]);
        setSelectedService(null);
        setError(null);
        try {
            const res = await axios.get(route('checkout.ongkir'), {
                params: { destination: destinationId, weight: totalWeight, courier: courier.id },
            });
            // Backend (setelah Commit #6) mengembalikan flat array:
            // [{service, description, cost, etd}]
            const services = (res.data || []).map(s => ({
                courier:     courier.id.toUpperCase(),
                service:     s.service,
                description: s.description,
                cost:        s.cost ?? 0,
                etd:         s.etd ?? '-',
            }));
            setShippingOptions(services);
            if (services.length === 0) {
                setError('Tidak ada layanan pengiriman tersedia untuk rute ini.');
            }
        } catch {
            setError('Gagal mengambil data ongkir.');
        } finally {
            setLoadingShipping(false);
        }
    };

    const handleCourierSelect = async (courier) => {
        setSelectedCourier(courier);
        await fetchShipping(courier);

    };

    const handlePlaceOrder = async () => {

        if (!selectedService || !fullAddress) {
            setError('Lengkapi data checkout.');
            return;
        }

        if (!window.snap) {
            setError('Midtrans belum siap.');
            return;
        }

        setLoadingOrder(true);
        setError(null);

        try {

            const response = await axios.post(route('checkout.store'), {
                courier: selectedService.courier,
                service: selectedService.service,
                shipping_cost: selectedService.cost,
                payment_type: 'midtrans',
                item_ids: [...selectedItemIds],
            });

            console.log(response.data);

            const snapToken = response.data.snap_token;

            if (!snapToken) {
                throw new Error('Snap token tidak ditemukan');
            }

            // delay kecil supaya popup stabil
            setTimeout(() => {

                window.snap.pay(snapToken, {

                    onSuccess: function (result) {

                        console.log('SUCCESS', result);

                        router.visit(route('checkout.success'));
                    },

                    onPending: function (result) {

                        console.log('PENDING', result);

                        router.visit(route('checkout.success'));
                    },

                    onError: function (result) {

                        console.log('ERROR', result);

                        setError('Pembayaran gagal.');

                        setLoadingOrder(false);
                    },

                    onClose: function () {

                        console.log('POPUP CLOSED');

                        setLoadingOrder(false);
                    }

                });

            }, 500);

        } catch (error) {

            console.log(error);

            if (error.response) {
                console.log(error.response.data);
            }

            setError(
                error?.response?.data?.message ||
                error.message ||
                'Gagal memproses pesanan.'
            );

            setLoadingOrder(false);
        }
    };

    const selectedPaymentLabel =
    PAYMENT_METHODS
        .flatMap(g => g.options)
        .find(o => o.id === selectedPayment)?.label || null;

    const visibleServices = showAllServices ? shippingOptions : shippingOptions.slice(0, 3);
    const canOrder = checkedItems.length > 0 && fullAddress && selectedService;

    return (
        <MarketplaceLayout auth={auth}>
            <Head title="Konfirmasi Pembayaran | Shopping Kuy" />

            <div className="bg-[#F8F9FA] min-h-screen font-['Poppins']">
                <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">

                    <div className="mb-10">
                        <Link href={route('cart.index')} className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors text-xs font-bold uppercase tracking-widest mb-4">
                            <ChevronLeft className="w-4 h-4" /> Kembali ke Keranjang
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 uppercase tracking-tight">Konfirmasi Pembayaran</h1>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wide px-6 py-4 rounded-xl">
                            {error}
                        </div>
                    )}

                    {!destinationId && (
                        <div className="mb-6 bg-amber-50 border border-amber-300 text-amber-800 text-[12px] font-bold px-6 py-4 rounded-xl">
                            ⚠ <code>subdistrict_id</code> / <code>rajaongkir_destination_id</code> tidak ditemukan di <code>auth.user</code>.
                            Tambahkan kedua field ini di <code>HandleInertiaRequests.php</code> → <code>share()</code>.
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        <div className="lg:col-span-8 space-y-6">

                            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-zinc-900" />
                                    <h2 className="text-[13px] font-bold uppercase tracking-tight text-zinc-900">Alamat Pengiriman</h2>
                                </div>
                                <div className="p-6">
                                    {fullAddress ? (
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-zinc-900">{u.name}</p>
                                                <p className="text-[13px] text-zinc-500 font-medium leading-relaxed">{fullAddress}</p>
                                                {u.phone && <p className="text-[13px] text-zinc-900 font-bold mt-1">{u.phone}</p>}
                                            </div>
                                            <Link href={route('profile.index')} className="text-[11px] font-bold text-zinc-900 border border-zinc-200 px-4 py-2 rounded-lg hover:bg-zinc-50 transition-all uppercase whitespace-nowrap shrink-0">
                                                Ubah
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <MapPin className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                                            <p className="text-[13px] text-zinc-400 font-bold uppercase mb-4">Alamat belum diatur</p>
                                            <Link href={route('profile.index')} className="bg-zinc-900 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase inline-block">Lengkapi Profil</Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-zinc-900" />
                                        <h2 className="text-[13px] font-bold uppercase tracking-tight text-zinc-900">Pilih Item yang Akan Dibeli</h2>
                                    </div>
                                    <button onClick={toggleAll} className="flex items-center gap-2 text-[11px] font-bold uppercase text-zinc-500 hover:text-zinc-900 transition-colors">
                                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selectedItemIds.size === rawItems.length ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300'}`}>
                                            {selectedItemIds.size === rawItems.length && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                                        </span>
                                        Pilih Semua ({rawItems.length})
                                    </button>
                                </div>

                                <div className="divide-y divide-zinc-100">
                                    {rawItems.map(item => {
                                        const checked = selectedItemIds.has(item.id);
                                        return (
                                            <div key={item.id} onClick={() => toggleItem(item.id)}
                                                className={`flex gap-4 p-5 cursor-pointer transition-colors hover:bg-zinc-50 ${!checked ? 'opacity-50' : ''}`}>
                                                <div className="flex items-center pt-1 shrink-0">
                                                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checked ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300 bg-white'}`}>
                                                        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                                    </span>
                                                </div>
                                                <img
                                                    src={item.thumbnail?.startsWith('http') ? item.thumbnail : `/storage/${item.thumbnail}`}
                                                    className="w-16 h-20 object-cover rounded-lg bg-zinc-100 shrink-0" alt={item.name}
                                                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200'; }}
                                                />
                                                <div className="flex-grow min-w-0">
                                                    {item.brand && <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">{item.brand}</p>}
                                                    <h3 className="text-sm font-bold text-zinc-900 uppercase leading-tight line-clamp-2 mt-0.5">{item.name}</h3>
                                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                        {item.size && <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded uppercase">{item.size}</span>}
                                                        {item.condition && <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded uppercase">{item.condition.replace('_', ' ')}</span>}
                                                        <span className="text-[10px] text-zinc-400 font-bold uppercase">Qty: {item.quantity || 1}</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-zinc-900 mt-2">
                                                        Rp {(Number(item.price) * (item.quantity || 1)).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {checkedItems.length > 0 && (
                                    <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-100">
                                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                                            {checkedItems.length} item dipilih · ~{(totalWeight / 1000).toFixed(1)} kg
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* 3. Kurir */}
                            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-zinc-900" />
                                    <h2 className="text-[13px] font-bold uppercase tracking-tight text-zinc-900">Pilih Kurir Pengiriman</h2>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                        {COURIERS.map(courier => {
                                            const active = selectedCourier?.id === courier.id;
                                            return (
                                                <button key={courier.id} type="button"
                                                    onClick={() => handleCourierSelect(courier)}
                                                    disabled={checkedItems.length === 0}
                                                    className={`relative flex flex-col items-center justify-center gap-0 py-4 px-2 rounded-xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${active ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-300 bg-white'}`}
                                                >
                                                    {active && (
                                                        <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-zinc-900 rounded-full flex items-center justify-center">
                                                            <Check className="w-2 h-2 text-white" strokeWidth={3} />
                                                        </span>
                                                    )}
                                                    <CourierLogo id={courier.id} />
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {checkedItems.length === 0 && (
                                        <p className="text-center text-[11px] text-zinc-400 font-bold uppercase tracking-wider py-1">
                                            Pilih item terlebih dahulu
                                        </p>
                                    )}

                                    {loadingShipping && (
                                        <div className="flex items-center justify-center py-6 gap-2 text-zinc-400">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-xs font-bold uppercase">Mengambil data ongkir...</span>
                                        </div>
                                    )}

                                    {!loadingShipping && shippingOptions.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[11px] font-bold uppercase text-zinc-400 tracking-widest">
                                                Pilih Layanan {selectedCourier?.name}
                                            </p>
                                            {visibleServices.map((opt, idx) => (
                                                <button key={idx} type="button" onClick={() => setSelectedService(opt)}
                                                    className={`w-full flex justify-between items-center px-5 py-4 rounded-xl border-2 transition-all text-left ${selectedService?.service === opt.service ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-300'}`}
                                                >
                                                    <div>
                                                        <p className="text-sm font-bold text-zinc-900 uppercase">{opt.courier} {opt.service}</p>
                                                        <p className="text-[11px] text-zinc-400 font-medium mt-0.5">{opt.description} · Estimasi {opt.etd} hari</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-sm font-bold text-zinc-900">Rp {opt.cost.toLocaleString('id-ID')}</p>
                                                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedService?.service === opt.service ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300'}`}>
                                                            {selectedService?.service === opt.service && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                            {shippingOptions.length > 3 && (
                                                <button onClick={() => setShowAllServices(v => !v)}
                                                    className="w-full flex items-center justify-center gap-1 py-3 text-[11px] font-bold uppercase text-zinc-500 hover:text-zinc-900 transition-colors">
                                                    {showAllServices
                                                        ? <><ChevronUp className="w-3.5 h-3.5" /> Sembunyikan</>
                                                        : <><ChevronDown className="w-3.5 h-3.5" /> {shippingOptions.length - 3} layanan lainnya</>
                                                    }
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 4. Pembayaran */}
                            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-zinc-900" />
                                    <h2 className="text-[13px] font-bold uppercase tracking-tight text-zinc-900">Metode Pembayaran</h2>
                                    <span className="ml-auto text-[10px] bg-amber-50 border border-amber-200 text-amber-700 font-bold uppercase px-2 py-0.5 rounded-full">Sandbox</span>
                                </div>
                                <div className="divide-y divide-zinc-100">
                                    {PAYMENT_METHODS.map(group => {
                                        const isOpen = openPaymentGroup === group.group;
                                        const groupSelected = group.options.some(o => o.id === selectedPayment);
                                        return (
                                            <div key={group.group}>
                                                <button type="button"
                                                    onClick={() => setOpenPaymentGroup(isOpen ? null : group.group)}
                                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition-colors">
                                                    <div className="flex items-center gap-2 text-zinc-700">
                                                        {group.icon}
                                                        <span className="text-[12px] font-bold uppercase tracking-wide">{group.group}</span>
                                                        {groupSelected && <span className="text-[10px] bg-zinc-900 text-white font-bold px-2 py-0.5 rounded-full uppercase">Dipilih</span>}
                                                    </div>
                                                    {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                                                </button>
                                                {isOpen && (
                                                    <div className="px-6 pb-4 space-y-2">
                                                        {group.options.map(opt => (
                                                            <button key={opt.id} type="button" onClick={() => setSelectedPayment(opt.id)}
                                                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all text-left ${selectedPayment === opt.id ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-300'}`}>
                                                                <div>
                                                                    <p className="text-[13px] font-bold text-zinc-900">{opt.label}</p>
                                                                    <p className="text-[11px] text-zinc-400 font-medium mt-0.5">{opt.note}</p>
                                                                </div>
                                                                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPayment === opt.id ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300'}`}>
                                                                    {selectedPayment === opt.id && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ══ KOLOM KANAN ══ */}
                        <div className="lg:col-span-4 sticky top-28 space-y-4">
                            <div className="bg-white p-7 rounded-[24px] border border-zinc-200 shadow-sm space-y-5">
                                <h2 className="text-[14px] font-bold text-zinc-900 uppercase tracking-tight">Ringkasan Pembayaran</h2>

                                {checkedItems.length > 0 ? (
                                    <div className="space-y-2 pb-4 border-b border-zinc-100">
                                        {checkedItems.map(item => (
                                            <div key={item.id} className="flex justify-between items-start gap-2">
                                                <p className="text-[11px] font-bold text-zinc-600 uppercase leading-snug line-clamp-2 flex-1">
                                                    {item.name}{(item.quantity || 1) > 1 && <span className="text-zinc-400"> ×{item.quantity}</span>}
                                                </p>
                                                <p className="text-[11px] font-bold text-zinc-900 shrink-0">
                                                    Rp {(Number(item.price) * (item.quantity || 1)).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-4 text-center border-b border-zinc-100">
                                        <p className="text-[11px] font-bold text-zinc-400 uppercase">Belum ada item dipilih</p>
                                    </div>
                                )}

                                <div className="space-y-3 text-[13px] font-medium text-zinc-500">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({checkedItems.length} item)</span>
                                        <span className="text-zinc-900 font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Ongkos Kirim</span>
                                        {selectedService
                                            ? <span className="text-zinc-900 font-bold">Rp {shippingCost.toLocaleString('id-ID')}</span>
                                            : <span className="text-zinc-400 text-[11px] font-bold uppercase">Belum dipilih</span>
                                        }
                                    </div>
                                    {selectedService && (
                                        <div className="flex justify-between text-[11px]">
                                            <span className="text-zinc-400">Layanan</span>
                                            <span className="text-zinc-700 font-bold uppercase">{selectedService.courier} {selectedService.service} · {selectedService.etd}hr</span>
                                        </div>
                                    )}
                                    {selectedPaymentLabel && (
                                        <div className="flex justify-between text-[11px]">
                                            <span className="text-zinc-400">Pembayaran</span>
                                            <span className="text-zinc-700 font-bold uppercase">{selectedPaymentLabel}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
                                    <span className="text-sm font-bold text-zinc-900 uppercase">Total Tagihan</span>
                                    <span className="text-xl font-bold text-zinc-900">Rp {total.toLocaleString('id-ID')}</span>
                                </div>

                                <button type="button" onClick={handlePlaceOrder} disabled={loadingOrder || !canOrder}
                                    className="w-full bg-zinc-900 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase text-[12px] tracking-widest hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
                                    {loadingOrder
                                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
                                        : <>Konfirmasi & Bayar <ArrowRight className="w-4 h-4" /></>
                                    }
                                </button>

                                {!canOrder && (
                                    <div className="space-y-1 text-center">
                                        {checkedItems.length === 0 && <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">· Pilih minimal 1 item</p>}
                                        {!fullAddress && <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">· Lengkapi alamat pengiriman</p>}
                                        {!selectedService && <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">· Pilih kurir & layanan</p>}
                                        {!selectedPayment && <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">· Pilih metode pembayaran</p>}
                                    </div>
                                )}

                                <div className="flex items-center gap-2 justify-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider pt-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Pembayaran Aman via Midtrans
                                </div>
                            </div>

                            <div className="bg-zinc-900 p-5 rounded-2xl text-white">
                                <div className="flex items-start gap-3">
                                    <Truck className="w-5 h-5 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold uppercase">Pengiriman Prioritas</p>
                                        <p className="text-[10px] opacity-60 uppercase font-medium mt-1 leading-relaxed">
                                            Pesanan diproses dalam 24 jam kerja setelah pembayaran dikonfirmasi.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
