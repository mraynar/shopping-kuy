import React, { useState, useEffect, useRef } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import {
    Store, Plus, Package, ShoppingBag, Star, Lock,
    ShieldCheck, Upload, MapPin, Loader2, Search,
    Navigation, CheckCircle2, ArrowRight, Settings, LayoutDashboard, X
} from 'lucide-react';
import axios from 'axios';

export default function SellerCenter() {
    const { auth, shop: propShop } = usePage().props;
    const shop = propShop || auth.shop;

    const isVerified = shop?.status === 'verified';
    const isPending = shop?.status === 'pending';
    const hasShop = !!shop;

    // UI STATES
    const [view, setView] = useState('loading_gate');
    const [isRegistering, setIsRegistering] = useState(false);
    const [showSuccessAnim, setShowSuccessAnim] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loadingAddr, setLoadingAddr] = useState(false);
    const searchRef = useRef(null);

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [subDistricts, setSubDistricts] = useState([]);
    const [loadingSubDistricts, setLoadingSubDistricts] = useState(false);

    // FORM REGISTRASI
    const { data, setData, post, processing, errors, reset } = useForm({
        shop_name: '',
        description: '',
        ktp_image: null,
        selfie_image: null,
        pickup_address: '',
        address_note: '',
        province_id: '',
        city_id: '',
        district_id: '',
        subdistrict_id: '',
        postal_code: '',
    });

    // FORM EDIT
    const editForm = useForm({
        shop_name: shop?.shop_name || '',
        description: shop?.description || '',
        pickup_address: shop?.pickup_address || '',
        address_note: shop?.address_note || '',
        province_id: shop?.province_id || '',
        city_id: shop?.city_id || '',
        district_id: shop?.district_id || '',
        subdistrict_id: shop?.subdistrict_id || '',
        postal_code: shop?.postal_code || '',
    });

    // --- LOGIKA HELPER: MUTUAL EXCLUSION ---
    const clearLocationDropdowns = (prevData) => ({
        ...prevData,
        province_id: '',
        city_id: '',
        district_id: '',
        subdistrict_id: '',
    });

    // --- 1. RAJAONGKIR LOGIC ---
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await axios.get('/api/provinces');
                setProvinces(res.data || []);
            } catch (err) {
                console.error("Gagal mengambil provinsi:", err);
            }
        };
        fetchProvinces();
    }, []);

    const fetchCities = async (provinceId) => {
        if (!provinceId) { setCities([]); return; }
        setLoadingCities(true);
        try {
            const res = await axios.get(`/api/cities/${provinceId}`);
            setCities(res.data);
        } catch (err) { console.error("Gagal memuat kota", err); }
        finally { setLoadingCities(false); }
    };

    const fetchDistricts = async (cityId) => {
        if (!cityId) { setDistricts([]); return; }
        setLoadingDistricts(true);
        try {
            const response = await axios.get(`/api/districts/${cityId}`);
            setDistricts(response.data);
        } catch (error) { console.error("Gagal memuat data kecamatan:", error); }
        finally { setLoadingDistricts(false); }
    };

    const fetchSubDistricts = async (districtId) => {
        if (!districtId) { setSubDistricts([]); return; }
        setLoadingSubDistricts(true);
        try {
            const res = await axios.get(`/api/sub-districts/${districtId}`);
            setSubDistricts(res.data || []);
        } catch (err) { console.error("Gagal memuat data kelurahan:", err); }
        finally { setLoadingSubDistricts(false); }
    };

    // --- 2. NOMINATIM LOGIC (SEARCH & PIN) ---
    const handleSelectResult = (item, formType = 'register') => {
        if (formType === 'edit') {
            editForm.setData({
                ...clearLocationDropdowns(editForm.data),
                pickup_address: item.display_name,
                postal_code: item.address.postcode || editForm.data.postal_code
            });
        } else {
            setData({
                ...clearLocationDropdowns(data),
                pickup_address: item.display_name,
                postal_code: item.address.postcode || data.postal_code
            });
        }
        setShowSearch(false);
        setQuery('');
    };

    const handlePinLocation = (formType = 'register') => {
        if (navigator.geolocation) {
            setLoadingAddr(true);
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
                    const item = res.data;
                    if (formType === 'edit') {
                        editForm.setData({
                            ...clearLocationDropdowns(editForm.data),
                            pickup_address: item.display_name,
                            postal_code: item.address.postcode || editForm.data.postal_code
                        });
                    } else {
                        setData({
                            ...clearLocationDropdowns(data),
                            pickup_address: item.display_name,
                            postal_code: item.address.postcode || data.postal_code
                        });
                    }
                } catch (err) { console.error("Gagal pin lokasi:", err); }
                finally { setLoadingAddr(false); }
            });
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length >= 3) handleSearchAddress();
            else setResults([]);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearchAddress = async () => {
        setLoadingAddr(true);
        try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=id&limit=5&addressdetails=1`);
            setResults(res.data);
            if (!showSearch) setShowSearch(true);
        } catch (err) { console.error("Gagal mengambil data alamat", err); }
        finally { setLoadingAddr(false); }
    };

    // --- 3. SUBMIT & VERIFY LOGIC ---
    useEffect(() => {
        if (isPending) {
            setView('processing_anim');
            const timer = setTimeout(() => {
                router.post(route('shop.autoVerify'), {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setShowSuccessAnim(true);
                        setTimeout(() => { setShowSuccessAnim(false); setView('dashboard'); }, 3000);
                    }
                });
            }, 5000);
            return () => clearTimeout(timer);
        } else if (isVerified) { setView('dashboard'); }
        else { setView('landing'); }
    }, [isPending, isVerified]);

    const submitRegister = (e) => {
        e.preventDefault();
        post(route('shop.register'), { forceFormData: true, onSuccess: () => reset() });
    };

    const handleUpdateShop = (e) => {
        e.preventDefault();
        editForm.post(route('shop.register'), {
            forceFormData: true,
            onSuccess: () => setIsEditModalOpen(false),
            preserveScroll: true
        });
    };

    if (view === 'loading_gate') return null;

    if (view === 'processing_anim') {
        return (
            <div className="bg-white rounded-xl p-20 border border-zinc-100 shadow-sm flex flex-col items-center justify-center text-center h-[600px] animate-in fade-in zoom-in duration-500">
                <div className="relative w-32 h-32 mb-10">
                    <div className="absolute inset-0 border-4 border-zinc-100 rounded-full opacity-20"></div>
                    <div className="absolute inset-0 border-4 border-zinc-900 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ShieldCheck className="w-12 h-12 text-zinc-900 animate-pulse" />
                    </div>
                </div>
                <h3 className="text-2xl font-black uppercase er">Verifikasi Berkas</h3>
                <p className="text-zinc-400 text-[10px] md:text-[12px] font-bold uppercase tracking-[0.3em] mt-3">Mengenali dokumen & mengaktifkan enkripsi toko...</p>
            </div>
        );
    }

    if (showSuccessAnim) {
        return (
            <div className="bg-white rounded-xl p-20 border border-zinc-100 shadow-sm flex flex-col items-center justify-center text-center h-[600px] animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-100">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-black uppercase text-zinc-900 leading-none text-center">Verifikasi<br/>Berhasil!</h2>
                <p className="text-zinc-400 font-bold uppercase text-[11px] mt-4 tracking-widest text-center">Selamat! Toko Anda telah aktif secara otomatis.</p>
            </div>
        );
    }

    if (view === 'dashboard' && isVerified) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700 text-left relative">

                {/* MODAL EDIT TOKO */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setIsEditModalOpen(false); setQuery(''); setResults([]); }}></div>
                        <div className="bg-white w-full max-w-lg rounded-xl p-10 relative z-10 shadow-2xl animate-in zoom-in duration-300">
                            <button onClick={() => { setIsEditModalOpen(false); setQuery(''); setResults([]); }} className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-colors"><X size={20}/></button>
                            <h3 className="text-xl md:text-2xl font-bold md:font-black uppercase er mb-8">Update Informasi Toko</h3>

                            <form onSubmit={handleUpdateShop} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Nama Toko</label>
                                    <input type="text" value={editForm.data.shop_name} onChange={e => editForm.setData('shop_name', e.target.value)} className="w-full bg-zinc-50 border-none rounded-lg p-4 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Deskripsi Toko</label>
                                    <textarea value={editForm.data.description} onChange={e => editForm.setData('description', e.target.value)} className="w-full bg-zinc-50 border-none rounded-lg p-4 text-sm font-bold h-24 focus:ring-2 focus:ring-zinc-900 outline-none resize-none" placeholder="Tuliskan deskripsi toko Anda..." />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Provinsi</label>
                                        <select
                                            value={editForm.data.province_id}
                                            onChange={e => {
                                                const val = e.target.value;
                                                editForm.setData('province_id', val);
                                                editForm.setData('city_id', ''); // Reset kota saat ganti provinsi
                                                fetchCities(val);
                                            }}
                                            className="w-full bg-zinc-50 border-none rounded-lg p-3 text-[11px] font-bold outline-none"
                                        >
                                            <option value="">PILIH</option>
                                            {provinces.map((p) => (
                                                <option key={`prov-edit-${p.id}`} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Kota</label>
                                        <select
                                            disabled={!editForm.data.province_id || loadingCities}
                                            value={editForm.data.city_id}
                                            onChange={e => editForm.setData('city_id', e.target.value)}
                                            className="w-full bg-zinc-50 border-none rounded-lg p-3 text-[11px] font-bold outline-none disabled:opacity-50"
                                        >
                                            <option value="">{loadingCities ? 'LOADING...' : 'PILIH'}</option>
                                            {cities.map((c) => (
                                                // PERBAIKAN: Gunakan c.id dan c.name sesuai struktur Komerce
                                                <option key={`city-edit-${c.id}`} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Kodepos</label>
                                        <input type="text" value={editForm.data.postal_code} onChange={e => editForm.setData('postal_code', e.target.value)} className="w-full bg-zinc-50 border-none rounded-lg p-3 text-[11px] font-bold outline-none" placeholder="00000" />
                                    </div>
                                </div>

                                <div className="space-y-1 relative">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Alamat Pickup Detail</label>
                                        <div className="flex gap-3">
                                            <div className="relative" ref={searchRef}>
                                                <button type="button" onClick={() => setShowSearch(!showSearch)} className="text-[9px] md:text-[12px] font-black uppercase flex items-center gap-1 text-zinc-900 hover:opacity-50"><Search size={10}/> {showSearch ? 'Tutup' : 'Cari'}</button>
                                                {showSearch && (
                                                    <div className="absolute right-0 mt-2 w-[280px] md:w-[350px] bg-white border border-zinc-100 shadow-2xl rounded-lg p-4 z-[110]">
                                                        <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ketik lokasi toko..." className="w-full bg-zinc-50 border-none rounded-md py-2 px-3 text-xs font-bold outline-none" />
                                                        <div className="mt-3 max-h-[120px] overflow-y-auto space-y-1 custom-scrollbar">
                                                            {loadingAddr ? (
                                                                <Loader2 size={14} className="animate-spin mx-auto text-zinc-300"/>
                                                            ) : (
                                                                results.map((item, idx) => (
                                                                    <button key={`search-edit-${idx}`} type="button" onClick={() => handleSelectResult(item, 'edit')} className="w-full text-left p-2 hover:bg-zinc-50 rounded-md transition text-[9px] md:text-[12px] font-bold text-zinc-500 leading-tight">
                                                                        {item.display_name}
                                                                    </button>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <button type="button" onClick={() => handlePinLocation('edit')} className="text-[9px] md:text-[12px] font-black uppercase flex items-center gap-1 text-zinc-900 hover:opacity-50"><Navigation size={10}/> Pin</button>
                                        </div>
                                    </div>
                                    <textarea value={editForm.data.pickup_address} onChange={e => editForm.setData('pickup_address', e.target.value)} className="w-full bg-zinc-50 border-none rounded-lg p-4 text-sm font-bold h-20 focus:ring-2 focus:ring-zinc-900 outline-none resize-none leading-relaxed" />
                                </div>

                                <button type="submit" disabled={editForm.processing} className="w-full bg-zinc-900 text-white py-4 rounded-lg text-[11px] font-black uppercase shadow-xl hover:bg-zinc-800 transition active:scale-95 disabled:opacity-50">
                                    {editForm.processing ? <Loader2 className="animate-spin mx-auto" /> : 'Simpan Perubahan'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="bg-zinc-900 rounded-xl p-8 md:p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10"><LayoutDashboard size={240} /></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
                                    <Store className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-3xl md:text-4xl font-bold er leading-none">{shop?.shop_name}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="bg-blue-500 p-0.5 rounded-full"><ShieldCheck className="w-3 h-3 text-white" /></div>
                                        <span className="text-[9px] md:text-[12px] md:text-[10px] md:text-[12px] font-black uppercase tracking-widest text-blue-400">Seller Terverifikasi</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button onClick={() => setIsEditModalOpen(true)} className="flex-1 md:flex-none bg-zinc-800 text-white px-6 py-4 rounded-lg text-[10px] md:text-[12px] font-black uppercase flex items-center justify-center gap-2">
                                <Settings size={14}/> Edit
                            </button>
                            <button onClick={() => router.get(route('products.index'))} className="flex-1 md:flex-none bg-white text-zinc-900 px-6 py-4 rounded-lg text-[10px] md:text-[12px] font-black uppercase shadow-xl hover:bg-zinc-100 active:scale-95 flex items-center justify-center gap-2">
                                <Plus size={14}/> Kelola Produk
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Katalog Produk', val: shop?.total_products || '0', icon: Package },
                        { label: 'Pesanan Selesai', val: shop?.total_sold || '0', icon: ShoppingBag },
                        { label: 'Rating Toko', val: '5.0', icon: Star },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 md:p-8 rounded-xl border border-zinc-100 flex items-center justify-between group hover:bg-zinc-900 transition-all duration-500">
                            <div className="space-y-1">
                                <p className="text-[9px] md:text-[12px] md:text-[10px] md:text-[12px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-zinc-200 transition-colors">{stat.label}</p>
                                <h4 className="text-2xl md:text-3xl font-black text-zinc-900 group-hover:text-white transition-colors">{stat.val}</h4>
                            </div>
                            <div className="p-4 bg-zinc-50 rounded-lg group-hover:bg-zinc-800 transition-all duration-500">
                                <stat.icon size={24} className="text-zinc-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 md:p-12 border border-zinc-100 shadow-sm relative overflow-hidden animate-in slide-in-from-bottom-6 duration-700">
            {!isRegistering ? (
                /* TAMPILAN AWAL SEBELUM DAFTAR */
                <div className="p-4 md:p-20 text-left relative">
                    <div className="w-16 h-16 bg-zinc-900 rounded-lg flex items-center justify-center mb-8 shadow-xl rotate-3">
                        <Lock className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase leading-[0.9] er text-zinc-900 mb-6">
                        Buka <br />
                        <span className="text-zinc-400 font-medium tracking-normal">Toko Anda.</span>
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-10 max-w-sm">
                        Jangkau lebih banyak pembeli dengan identitas merchant resmi terverifikasi.
                    </p>
                    <button
                        onClick={() => setIsRegistering(true)}
                        className="w-full md:w-auto group bg-zinc-900 text-white pl-8 pr-6 py-5 rounded-lg text-[12px] font-black uppercase flex items-center justify-between md:justify-start gap-10 hover:bg-zinc-800 transition shadow-2xl"
                    >
                        Mulai Buka Toko <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            ) : (
                /* FORM REGISTRASI / EDIT TOKO */
                <div className="max-w-2xl mx-auto text-left">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-black text-zinc-900 uppercase er leading-none">Registrasi Merchant</h3>
                        <p className="text-zinc-400 text-[10px] md:text-[12px] font-bold uppercase tracking-[0.4em] mt-2">Onboarding System</p>
                    </div>

                    <form onSubmit={submitRegister} className="space-y-6">
                        {/* INPUT NAMA & DESKRIPSI */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Nama Toko</label>
                                <input
                                    type="text"
                                    required
                                    value={data.shop_name}
                                    className={`w-full bg-zinc-50 border-none rounded-lg p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none ${errors.shop_name ? 'ring-2 ring-red-500' : ''}`}
                                    onChange={e => setData('shop_name', e.target.value)}
                                    placeholder="NAMA TOKO..."
                                />
                                {errors.shop_name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic">{errors.shop_name}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Deskripsi (Opsional)</label>
                                <input
                                    type="text"
                                    value={data.description}
                                    className="w-full bg-zinc-50 border-none rounded-lg p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none"
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="TENTANG TOKO..."
                                />
                            </div>
                        </div>

                        {/* SEKSI LOKASI BERJENJANG (DROPDOWN) */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Provinsi</label>
                                    <select
                                        value={data.province_id}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setData(d => ({
                                                ...d,
                                                province_id: val, city_id: '', district_id: '', subdistrict_id: '', postal_code: '',
                                                pickup_address: '' // Saling mengosongkan dengan textarea
                                            }));
                                            fetchCities(val);
                                        }}
                                        className="w-full bg-zinc-50 border-none rounded-lg p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none"
                                    >
                                        <option value="">PILIH PROVINSI</option>
                                        {Array.isArray(provinces) && provinces.map((p) => (
                                            <option key={`prov-${p.id}`} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Kota/Kabupaten</label>
                                    <select
                                        disabled={!data.province_id || loadingCities}
                                        value={data.city_id}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setData(d => ({
                                                ...d, city_id: val, district_id: '', subdistrict_id: '', postal_code: '',
                                                pickup_address: ''
                                            }));
                                            fetchDistricts(val);
                                        }}
                                        className="w-full bg-zinc-50 border-none rounded-lg p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none disabled:opacity-50"
                                    >
                                        <option value="">{loadingCities ? 'MEMUAT...' : 'PILIH KOTA'}</option>
                                        {Array.isArray(cities) && cities.map((c) => (
                                            <option key={`city-${c.id}`} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Kecamatan</label>
                                    <select
                                        disabled={!data.city_id || loadingDistricts}
                                        value={data.district_id}
                                        onChange={e => {
                                            const val = e.target.value;
                                            setData(d => ({
                                                ...d, district_id: val, subdistrict_id: '', postal_code: '',
                                                pickup_address: ''
                                            }));
                                            fetchSubDistricts(val);
                                        }}
                                        className="w-full bg-zinc-50 border-none rounded-lg p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none disabled:opacity-50"
                                    >
                                        <option value="">{loadingDistricts ? 'MEMUAT...' : 'PILIH KECAMATAN'}</option>
                                        {Array.isArray(districts) && districts.map((d) => (
                                            <option key={`dist-${d.id}`} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Kelurahan/Desa</label>
                                    <select
                                        disabled={!data.district_id || loadingSubDistricts}
                                        value={data.subdistrict_id}
                                        onChange={e => {
                                            const val = e.target.value;
                                            const selectedSub = subDistricts.find(s => String(s.id) === String(val));
                                            setData(d => ({
                                                ...d,
                                                subdistrict_id: val,
                                                postal_code: (selectedSub?.zip_code && selectedSub.zip_code !== "0") ? selectedSub.zip_code : d.postal_code,
                                                pickup_address: ''
                                            }));
                                        }}
                                        className="w-full bg-zinc-50 border-none rounded-lg p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none disabled:opacity-50"
                                    >
                                        <option value="">{loadingSubDistricts ? 'MEMUAT...' : 'PILIH KELURAHAN'}</option>
                                        {Array.isArray(subDistricts) && subDistricts.map((s) => (
                                            <option key={`sub-${s.id}`} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* ALAMAT DETAIL & SEARCH MAPS (PIN LOKASI) */}
                        <div className="space-y-3 pt-4 border-t border-zinc-100">
                            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                                <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400">Atau Pilih Titik Pickup Otomatis</label>
                                <div className="flex gap-4">
                                    <div className="relative" ref={searchRef}>
                                        <button
                                            type="button"
                                            onClick={() => setShowSearch(!showSearch)}
                                            className="text-[10px] md:text-[12px] font-black uppercase text-zinc-900 flex items-center gap-1 font-bold"
                                        >
                                            <Search size={12}/> {showSearch ? 'Tutup' : 'Cari'}
                                        </button>
                                        {showSearch && (
                                            /* PERBAIKAN: Ditambahkan md:right-0 dan md:translate-x-0 untuk mobile agar tidak terlalu ke kiri */
                                            <div className="absolute right-[-50px] md:right-0 mt-3 w-[280px] md:w-[400px] bg-white border border-zinc-100 shadow-2xl rounded-lg p-4 z-50 animate-in fade-in zoom-in duration-200">
                                                <input
                                                    autoFocus
                                                    value={query}
                                                    onChange={(e) => setQuery(e.target.value)}
                                                    placeholder="Cari lokasi spesifik..."
                                                    className="w-full bg-zinc-50 border-none rounded-md py-3 px-4 text-xs font-bold outline-none ring-1 ring-zinc-100 focus:ring-zinc-900"
                                                />
                                                <div className="mt-4 max-h-[150px] overflow-y-auto space-y-1 custom-scrollbar">
                                                    {loadingAddr ? (
                                                        <div className="flex justify-center p-4"><Loader2 size={16} className="animate-spin text-zinc-300"/></div>
                                                    ) : (
                                                        results.map((item, idx) => (
                                                            <button
                                                                key={`search-res-${idx}`}
                                                                type="button"
                                                                onClick={() => handleSelectResult(item, 'register')}
                                                                className="w-full text-left p-3 hover:bg-zinc-50 rounded-md transition text-[10px] md:text-[12px] font-bold text-zinc-500 leading-snug border-b border-zinc-50 last:border-0"
                                                            >
                                                                {item.display_name}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handlePinLocation('register')}
                                        className="text-[10px] md:text-[12px] font-black uppercase text-zinc-900 flex items-center gap-1 font-bold"
                                    >
                                        <Navigation size={12}/> Pin Lokasi
                                    </button>
                                </div>
                            </div>

                            <textarea
                                /* PERBAIKAN: Tidak required karena bisa dipilih lewat dropdown di atas */
                                value={data.pickup_address}
                                onChange={e => {
                                    const val = e.target.value;
                                    setData(d => ({
                                        ...d,
                                        pickup_address: val,
                                        province_id: '', city_id: '', district_id: '', subdistrict_id: ''
                                    }));
                                }}
                                className="w-full bg-zinc-50 border-none rounded-lg p-6 text-sm font-bold h-24 focus:ring-2 focus:ring-zinc-900 outline-none resize-none leading-relaxed"
                                placeholder="JALAN, NO RUMAH, BLOK, DLL..."
                            />

                            {/* ALAMAT LENGKAP (WAJIB) */}
                            <div className="space-y-1">
                                <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Alamat Lengkap (Wajib)</label>
                                <input
                                    type="text"
                                    required
                                    value={data.address_note || ''}
                                    onChange={e => setData('address_note', e.target.value)}
                                    className={`w-full bg-zinc-50 border-none rounded-lg p-4 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none ${errors.address_note ? 'ring-2 ring-red-500' : ''}`}
                                    placeholder="Alamat Lengkap Dan Patokan Rumah ..."
                                />
                                {errors.address_note && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic">{errors.address_note}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Kode Pos</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.postal_code}
                                        className={`w-full bg-zinc-50 border-none rounded-lg p-4 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none ${errors.postal_code ? 'ring-2 ring-red-500' : ''}`}
                                        onChange={e => setData('postal_code', e.target.value)}
                                        placeholder="00000"
                                    />
                                    {errors.postal_code && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic">{errors.postal_code}</p>}
                                </div>
                            </div>
                        </div>

                        {/* UPLOAD BERKAS VERIFIKASI */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Berkas KTP</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-200 cursor-pointer hover:border-zinc-900 transition-all overflow-hidden p-4 text-center">
                                    {data.ktp_image ? (
                                        <img src={typeof data.ktp_image === 'string' ? `/storage/${data.ktp_image}` : URL.createObjectURL(data.ktp_image)} alt="KTP Preview" className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Upload className="w-5 h-5 text-zinc-300" />
                                            <span className="text-[10px] md:text-[12px] font-bold text-zinc-400 uppercase mt-2">KTP</span>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={e => setData('ktp_image', e.target.files[0])} />
                                </label>
                                {errors.ktp_image && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic">{errors.ktp_image}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] md:text-[12px] font-black uppercase text-zinc-400 ml-1">Foto Selfie</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-200 cursor-pointer hover:border-zinc-900 transition-all overflow-hidden p-4 text-center">
                                    {data.selfie_image ? (
                                        <img src={typeof data.selfie_image === 'string' ? `/storage/${data.selfie_image}` : URL.createObjectURL(data.selfie_image)} alt="Selfie Preview" className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Upload className="w-5 h-5 text-zinc-300" />
                                            <span className="text-[10px] md:text-[12px] font-bold text-zinc-400 uppercase mt-2">Selfie</span>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={e => setData('selfie_image', e.target.files[0])} />
                                </label>
                                {errors.selfie_image && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic">{errors.selfie_image}</p>}
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-zinc-900 text-white py-5 rounded-lg text-[12px] font-black uppercase shadow-2xl hover:bg-zinc-800 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? <Loader2 className="animate-spin mx-auto" /> : 'Ajukan Verifikasi'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
