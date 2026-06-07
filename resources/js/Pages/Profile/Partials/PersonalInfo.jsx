import React, { useState, useRef, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Camera, Search, Navigation, Loader2,
    CheckCircle2, MapPin, X
} from 'lucide-react';
import axios from 'axios';

export default function PersonalInfo({ auth }) {
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loadingAddr, setLoadingAddr] = useState(false);
    const searchRef = useRef(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Location dropdown states
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [subDistricts, setSubDistricts] = useState([]);
    const [loadingSubDistricts, setLoadingSubDistricts] = useState(false);

    // RajaOngkir destination states
    const [roDestinations, setRoDestinations] = useState([]);
    const [loadingRoSearch, setLoadingRoSearch] = useState(false);
    const [selectedRoDestination, setSelectedRoDestination] = useState(
        auth.user.rajaongkir_destination_id
            ? {
                id: auth.user.rajaongkir_destination_id,
                label: auth.user.rajaongkir_destination_label,
              }
            : null
    );

    const fileInputRef = useRef(null);

    const { data, setData, post, patch, processing, errors } = useForm({
        name:                         auth.user.name || '',
        phone:                        auth.user.phone || '',
        bio:                          auth.user.bio || '',
        address:                      auth.user.address || '',
        address_notes:                auth.user.address_notes || '',
        province_id:                  auth.user.province_id || '',
        city_id:                      auth.user.city_id || '',
        district_id:                  auth.user.district_id || '',
        subdistrict_id:               auth.user.subdistrict_id || '',
        postal_code:                  auth.user.postal_code || '',
        rajaongkir_destination_id:    auth.user.rajaongkir_destination_id || '',
        rajaongkir_destination_label: auth.user.rajaongkir_destination_label || '',
        avatar:                       null,
        _method:                      'PATCH',
    });

    // Init location dropdowns
    useEffect(() => {
        const init = async () => {
            try {
                const res = await axios.get('/location/provinces');
                setProvinces(res.data || []);
            } catch (err) {
                console.error("Gagal mengambil provinsi:", err);
            }

            if (auth.user.province_id) {
                setLoadingCities(true);
                try {
                    const res = await axios.get(`/location/cities/${auth.user.province_id}`);
                    setCities(res.data || []);
                } finally { setLoadingCities(false); }
            }

            if (auth.user.city_id) {
                setLoadingDistricts(true);
                try {
                    const res = await axios.get(`/location/districts/${auth.user.city_id}`);
                    setDistricts(res.data || []);
                } finally { setLoadingDistricts(false); }
            }

            if (auth.user.district_id) {
                setLoadingSubDistricts(true);
                try {
                    const res = await axios.get(`/location/subdistricts/${auth.user.district_id}`);
                    setSubDistricts(res.data || []);
                } finally { setLoadingSubDistricts(false); }
            }
        };
        init();
    }, []);

    // Nominatim debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 3) {
                setLoadingAddr(true);
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5&countrycodes=id`);
                    setResults(await res.json());
                } finally { setLoadingAddr(false); }
            } else { setResults([]); }
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    // Auto-hide success popup
    useEffect(() => {
        if (showSuccess) {
            const t = setTimeout(() => setShowSuccess(false), 4000);
            return () => clearTimeout(t);
        }
    }, [showSuccess]);

    const fetchCities = async (id) => {
        if (!id) return;
        setLoadingCities(true);
        try {
            const res = await axios.get(`/location/cities/${id}`);
            setCities(res.data || []);
        } finally { setLoadingCities(false); }
    };

    const fetchDistricts = async (id) => {
        if (!id) return;
        setLoadingDistricts(true);
        try {
            const res = await axios.get(`/location/districts/${id}`);
            setDistricts(res.data || []);
        } finally { setLoadingDistricts(false); }
    };

    const fetchSubDistricts = async (id) => {
        if (!id) return;
        setLoadingSubDistricts(true);
        try {
            const res = await axios.get(`/location/subdistricts/${id}`);
            setSubDistricts(res.data || []);
        } finally { setLoadingSubDistricts(false); }
    };

    const searchRajaOngkirDestination = async (subdistrictName, cityName) => {
        if (!subdistrictName) return;
        setLoadingRoSearch(true);
        setRoDestinations([]);
        setSelectedRoDestination(null);
        try {
            const res = await axios.get(route('location.search-destination'), {
                params: { search: `${subdistrictName} ${cityName}`, limit: 8 }
            });
            setRoDestinations(res.data || []);
        } catch (e) {
            console.error('RajaOngkir search error:', e);
        } finally {
            setLoadingRoSearch(false);
        }
    };

    const handleSelectRoDestination = (dest) => {
        setSelectedRoDestination(dest);
        setData(d => ({
            ...d,
            rajaongkir_destination_id: dest.id,
            rajaongkir_destination_label: dest.label,
        }));
        setRoDestinations([]);
    };

    const handleSelectAddress = (item) => {
        setData(d => ({
            ...d,
            province_id: '', city_id: '', district_id: '', subdistrict_id: '',
            address: item.display_name,
            postal_code: item.address?.postcode || d.postal_code,
        }));
        setShowSearch(false);
        setQuery("");
    };

    const handlePinLocation = () => {
        if (!navigator.geolocation) return;
        setLoadingAddr(true);
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&addressdetails=1`);
                const json = await res.json();
                setData(d => ({
                    ...d,
                    province_id: '', city_id: '', district_id: '', subdistrict_id: '',
                    address: json.display_name,
                    postal_code: json.address?.postcode || d.postal_code,
                }));
            } finally { setLoadingAddr(false); }
        });
    };

    const submit = (e) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => setShowSuccess(true),
        };
        if (data.avatar) {
            post(route('profile.update'), { ...options, forceFormData: true });
        } else {
            patch(route('profile.update'), options);
        }
    };

    return (
        <div className="bg-white rounded-xl p-8 md:p-12 border border-zinc-100 shadow-sm animate-fade-in relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-50 pb-8 mb-10">
                <div className="space-y-2">
                    <h3 className="text-xl md:text-3xl font-bold text-zinc-900 uppercase leading-none">Info Personal</h3>
                    <p className="text-zinc-400 text-[12px] font-bold uppercase tracking-wider">Kelola profil dan alamat pengiriman kamu</p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-10 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

                    {/* AVATAR */}
                    <div className="md:col-span-2 flex items-center gap-6 mb-4">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-zinc-50 shadow-lg transition-transform group-hover:scale-105">
                                <img
                                    src={data.avatar ? URL.createObjectURL(data.avatar) : (auth.user.avatar || `https://ui-avatars.com/api/?name=${auth.user.name}`)}
                                    className="w-full h-full object-cover"
                                    alt="avatar"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white w-6 h-6" />
                            </div>
                            <input type="file" ref={fileInputRef} onChange={e => setData('avatar', e.target.files[0])} className="hidden" accept="image/*" />
                        </div>
                        <div>
                            <h4 className="text-sm md:text-lg font-bold uppercase text-zinc-900">Foto Profil</h4>
                            <p className="text-[10px] md:text-sm text-zinc-400 font-bold uppercase mt-1">Klik foto untuk mengubah</p>
                        </div>
                    </div>

                    {/* NAMA */}
                    <div className="space-y-1">
                        <label className="text-[12px] font-bold uppercase text-zinc-400 ml-2 tracking-widest">Nama Lengkap</label>
                        <input
                            type="text" value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className={`w-full bg-zinc-50 border-none rounded-lg p-5 text-xs md:text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none transition-all ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase ml-2">{errors.name}</p>}
                    </div>

                    {/* TELEPON */}
                    <div className="space-y-1">
                        <label className="text-[12px] font-bold uppercase text-zinc-400 ml-2 tracking-widest">Nomor WhatsApp</label>
                        <input
                            type="text" value={data.phone}
                            onChange={e => setData('phone', e.target.value)}
                            className={`w-full bg-zinc-50 border-none rounded-lg p-5 text-xs md:text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none transition-all ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                        />
                        {errors.phone && <p className="text-red-500 text-[10px] font-bold uppercase ml-2">{errors.phone}</p>}
                    </div>

                    {/* SEPARATOR */}
                    <div className="md:col-span-2 border-t border-zinc-50 pt-4">
                        <p className="text-[11px] font-bold uppercase text-zinc-400 tracking-widest mb-6">Alamat Pengiriman</p>

                        {/* PROVINSI & KOTA */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-1">
                                <label className="text-[12px] font-bold uppercase text-zinc-400 ml-2 tracking-widest">Provinsi</label>
                                <select
                                    value={String(data.province_id || '')}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setData(d => ({ ...d, province_id: val, city_id: '', district_id: '', subdistrict_id: '', postal_code: '', rajaongkir_destination_id: '', rajaongkir_destination_label: '' }));
                                        setSelectedRoDestination(null);
                                        fetchCities(val);
                                    }}
                                    className="w-full bg-zinc-50 border-none rounded-lg p-5 text-xs md:text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">PILIH PROVINSI</option>
                                    {provinces.map(p => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[12px] font-bold uppercase text-zinc-400 ml-2 tracking-widest">Kota/Kabupaten</label>
                                <select
                                    disabled={!data.province_id || loadingCities}
                                    value={String(data.city_id || '')}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setData(d => ({ ...d, city_id: val, district_id: '', subdistrict_id: '', postal_code: '', rajaongkir_destination_id: '', rajaongkir_destination_label: '' }));
                                        setSelectedRoDestination(null);
                                        fetchDistricts(val);
                                    }}
                                    className="w-full bg-zinc-50 border-none rounded-lg p-5 text-xs md:text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none appearance-none cursor-pointer disabled:opacity-50"
                                >
                                    <option value="">{loadingCities ? 'MEMUAT...' : 'PILIH KOTA'}</option>
                                    {cities.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* KECAMATAN & KELURAHAN */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-1">
                                <label className="text-[12px] font-bold uppercase text-zinc-400 ml-2 tracking-widest">Kecamatan</label>
                                <select
                                    disabled={!data.city_id || loadingDistricts}
                                    value={String(data.district_id || '')}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setData(d => ({ ...d, district_id: val, subdistrict_id: '', postal_code: '', rajaongkir_destination_id: '', rajaongkir_destination_label: '' }));
                                        setSelectedRoDestination(null);
                                        fetchSubDistricts(val);
                                    }}
                                    className="w-full bg-zinc-50 border-none rounded-lg p-5 text-xs md:text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none appearance-none cursor-pointer disabled:opacity-50"
                                >
                                    <option value="">{loadingDistricts ? 'MEMUAT...' : 'PILIH KECAMATAN'}</option>
                                    {districts.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[12px] font-bold uppercase text-zinc-400 ml-2 tracking-widest">Kelurahan</label>
                                <select
                                    disabled={!data.district_id || loadingSubDistricts}
                                    value={String(data.subdistrict_id || '')}
                                    onChange={e => {
                                        const val = e.target.value;
                                        const sub = subDistricts.find(s => String(s.id) === String(val));
                                        const city = cities.find(c => String(c.id) === String(data.city_id));
                                        setData(d => ({
                                            ...d,
                                            subdistrict_id: val,
                                            postal_code: sub?.zip_code || d.postal_code,
                                            rajaongkir_destination_id: '',
                                            rajaongkir_destination_label: '',
                                        }));
                                        setSelectedRoDestination(null);
                                        if (sub && city) {
                                            searchRajaOngkirDestination(sub.name, city.name);
                                        }
                                    }}
                                    className="w-full bg-zinc-50 border-none rounded-lg p-5 text-xs md:text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none appearance-none cursor-pointer disabled:opacity-50"
                                >
                                    <option value="">{loadingSubDistricts ? 'MEMUAT...' : 'PILIH KELURAHAN'}</option>
                                    {subDistricts.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* RAJAONGKIR DESTINATION PICKER */}
                        {(loadingRoSearch || roDestinations.length > 0 || selectedRoDestination) && (
                            <div className="mb-6 space-y-2">
                                <label className="text-[12px] font-bold uppercase text-zinc-400 ml-2 tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3 h-3" />
                                    Konfirmasi Titik Pengiriman
                                    <span className="text-red-500">*</span>
                                </label>

                                {loadingRoSearch ? (
                                    <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-xl">
                                        <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                                        <span className="text-xs font-bold uppercase text-zinc-400">Mencari titik lokasi pengiriman...</span>
                                    </div>
                                ) : selectedRoDestination && roDestinations.length === 0 ? (
                                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                            <p className="text-xs font-bold text-green-700 uppercase">{selectedRoDestination.label}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedRoDestination(null);
                                                setData(d => ({ ...d, rajaongkir_destination_id: '', rajaongkir_destination_label: '' }));
                                                const sub = subDistricts.find(s => String(s.id) === String(data.subdistrict_id));
                                                const city = cities.find(c => String(c.id) === String(data.city_id));
                                                if (sub && city) searchRajaOngkirDestination(sub.name, city.name);
                                            }}
                                            className="text-zinc-400 hover:text-zinc-900 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {roDestinations.map(dest => (
                                            <button
                                                key={dest.id}
                                                type="button"
                                                onClick={() => handleSelectRoDestination(dest)}
                                                className="w-full text-left p-4 rounded-xl border-2 border-zinc-100 hover:border-zinc-900 hover:bg-zinc-50 transition-all"
                                            >
                                                <p className="text-[11px] font-bold text-zinc-700 uppercase leading-relaxed">{dest.label}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* PIN LOKASI */}
                    <div className="md:col-span-2 space-y-4 border-t border-zinc-50 pt-6">
                        <div className="flex items-center justify-between px-2">
                            <label className="text-[12px] font-bold uppercase text-zinc-400 tracking-widest">Titik Alamat Otomatis</label>
                            <div className="flex gap-5">
                                <div className="static md:relative" ref={searchRef}>
                                    <button type="button" onClick={() => setShowSearch(!showSearch)} className="text-[10px] font-bold uppercase text-zinc-900 flex items-center gap-1.5 hover:opacity-60 transition group">
                                        <Search className="w-3.5 h-3.5" /> {showSearch ? 'Tutup' : 'Cari'}
                                    </button>
                                    {showSearch && (
                                        <div className="absolute left-6 right-6 md:left-auto md:right-0 mt-3 md:w-[450px] bg-white border border-zinc-100 shadow-2xl rounded-[16px] z-50 p-6">
                                            <input
                                                autoFocus value={query}
                                                onChange={e => setQuery(e.target.value)}
                                                placeholder="Ketik lokasi spesifik..."
                                                className="w-full bg-zinc-50 border-none rounded-lg py-4 px-5 text-[12px] font-bold outline-none focus:ring-2 focus:ring-zinc-900"
                                            />
                                            <div className="mt-4 max-h-[200px] overflow-y-auto space-y-1">
                                                {loadingAddr
                                                    ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-zinc-900" />
                                                    : results.map((item, idx) => (
                                                        <button key={idx} type="button" onClick={() => handleSelectAddress(item)} className="w-full text-left p-4 hover:bg-zinc-50 rounded-lg transition">
                                                            <span className="text-[11px] font-bold text-zinc-600 leading-snug">{item.display_name}</span>
                                                        </button>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button type="button" onClick={handlePinLocation} className="text-[10px] font-bold uppercase text-zinc-900 flex items-center gap-1.5 hover:opacity-60 transition">
                                    <Navigation className="w-3.5 h-3.5" /> Pin Lokasi
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={data.address}
                            onChange={e => setData(d => ({ ...d, address: e.target.value, province_id: '', city_id: '', district_id: '', subdistrict_id: '' }))}
                            className="w-full bg-zinc-50 border-none rounded-[16px] p-6 text-xs md:text-sm font-medium h-32 focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
                            placeholder="Alamat dari penitikan otomatis akan muncul di sini..."
                        />
                    </div>

                    {/* ALAMAT LENGKAP */}
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-[12px] font-bold uppercase text-zinc-400 ml-2 tracking-widest">Alamat Lengkap & Patokan <span className="text-red-500">*</span></label>
                        <input
                            type="text" required value={data.address_notes}
                            onChange={e => setData('address_notes', e.target.value)}
                            className={`w-full bg-zinc-50 border-none rounded-lg p-5 text-xs md:text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none transition-all ${errors.address_notes ? 'ring-2 ring-red-500' : ''}`}
                            placeholder="Contoh: Perumahan Indah Blok A No.5, Pagar Hitam"
                        />
                        {errors.address_notes && <p className="text-red-500 text-[10px] font-bold uppercase ml-2">{errors.address_notes}</p>}
                    </div>

                    {/* KODE POS */}
                    <div className="space-y-1">
                        <label className="text-[12px] font-bold uppercase text-zinc-400 ml-2 tracking-widest">Kode Pos <span className="text-red-500">*</span></label>
                        <input
                            type="text" required value={data.postal_code}
                            onChange={e => setData('postal_code', e.target.value)}
                            className={`w-full bg-zinc-50 border-none rounded-lg p-5 text-xs md:text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none ${errors.postal_code ? 'ring-2 ring-red-500' : ''}`}
                            placeholder="00000"
                        />
                        {errors.postal_code && <p className="text-red-500 text-[10px] font-bold uppercase ml-2">{errors.postal_code}</p>}
                    </div>
                </div>

                <div className="border-t border-zinc-50 pt-8">
                    <button
                        type="submit"
                        disabled={processing}
                        className="justify-center w-full bg-zinc-900 text-white px-16 py-5 rounded-lg text-[13px] font-bold uppercase hover:bg-zinc-800 shadow-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                    >
                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>

            {/* SUCCESS POPUP */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/5 backdrop-blur-[2px]">
                    <div className="bg-white px-10 py-8 rounded-[32px] shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold uppercase text-zinc-900">Berhasil Simpan!</p>
                            <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                                Data profil kamu berhasil diperbarui
                            </p>
                        </div>
                        <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ animation: 'progress-shrink 4000ms linear forwards' }} />
                        </div>
                    </div>
                    <style dangerouslySetInnerHTML={{ __html: `@keyframes progress-shrink { from { width: 100%; } to { width: 0%; } }` }} />
                </div>
            )}
        </div>
    );
}
