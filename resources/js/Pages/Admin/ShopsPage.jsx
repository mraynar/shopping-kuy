import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Store, Users, Check, X, Eye, MapPin, 
    AlertCircle, Calendar, ArrowUpRight, Loader2, FileText
} from 'lucide-react';

export default function ShopsPage({ auth, shops = [], filters = {}, flash }) {
    const [selectedShop, setSelectedShop] = useState(null); // Toko yang sedang direview dokumennya
    const [processingId, setProcessingId] = useState(null);
    const [showFlash, setShowFlash] = useState(true);

    const activeStatus = filters.status || 'all';

    const tabs = [
        { id: 'all', label: 'Semua Toko', count: shops.length },
        { id: 'pending', label: 'Menunggu Verifikasi', count: shops.filter(s => s.status === 'pending').length },
        { id: 'verified', label: 'Terverifikasi', count: shops.filter(s => s.status === 'verified').length },
        { id: 'rejected', label: 'Ditolak', count: shops.filter(s => s.status === 'rejected').length },
    ];

    const handleFilterChange = (statusId) => {
        router.get('/admin/shops', statusId === 'all' ? {} : { status: statusId }, {
            preserveState: true,
            replace: true
        });
    };

    const handleApprove = (shopId) => {
        setProcessingId(shopId);
        router.post(`/admin/shops/${shopId}/approve`, {}, {
            onSuccess: () => {
                setSelectedShop(null);
                setShowFlash(true);
            },
            onFinish: () => {
                setProcessingId(null);
            }
        });
    };

    const handleReject = (shopId) => {
        setProcessingId(shopId);
        router.post(`/admin/shops/${shopId}/reject`, {}, {
            onSuccess: () => {
                setSelectedShop(null);
                setShowFlash(true);
            },
            onFinish: () => {
                setProcessingId(null);
            }
        });
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-amber-50 text-amber-700 border border-amber-200';
            case 'verified':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'rejected':
                return 'bg-rose-50 text-rose-700 border border-rose-200';
            default:
                return 'bg-zinc-50 text-zinc-700 border border-zinc-200';
        }
    };

    const formatStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'Menunggu';
            case 'verified': return 'Terverifikasi';
            case 'rejected': return 'Ditolak';
            default: return status || 'Unknown';
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Kelola Toko | Admin Panel" />

            <div className="space-y-8 font-['Poppins']">
                {/* Header Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-zinc-950">Kelola & Verifikasi Toko</h1>
                        <p className="text-zinc-500 text-xs md:text-sm font-medium mt-0.5 uppercase tracking-wide">
                            Verifikasi pendaftaran toko seller preloved baru
                        </p>
                    </div>
                </div>

                {/* Flash Alert */}
                {flash?.message && showFlash && (
                    <div className="bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider px-6 py-4 rounded-xl flex items-center justify-between shadow-lg animate-in fade-in duration-200">
                        <span>{flash.message}</span>
                        <button onClick={() => setShowFlash(false)} className="text-white/60 hover:text-white text-xs ml-4">✕</button>
                    </div>
                )}

                {/* Tabs Filter */}
                <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-px">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleFilterChange(tab.id)}
                            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                                activeStatus === tab.id
                                    ? 'border-zinc-950 text-zinc-950'
                                    : 'border-transparent text-zinc-400 hover:text-zinc-650'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Shops List / Table */}
                <div className="bg-white rounded-3xl border border-zinc-200/85 shadow-sm overflow-hidden">
                    {shops.length === 0 ? (
                        <div className="p-12 text-center text-zinc-400 space-y-3">
                            <Store className="w-12 h-12 mx-auto text-zinc-300" strokeWidth={1.5} />
                            <p className="text-xs uppercase font-bold">Tidak ada toko dengan status ini</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50/50 text-[10px] font-black uppercase tracking-wider text-zinc-400 border-b border-zinc-100">
                                        <th className="p-5">Toko / Seller</th>
                                        <th className="p-5">Lokasi & Alamat</th>
                                        <th className="p-5">KTP & Selfie</th>
                                        <th className="p-5">Status</th>
                                        <th className="p-5 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {shops.map((shop) => {
                                        const registerDate = new Date(shop.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        });

                                        return (
                                            <tr key={shop.id} className="hover:bg-zinc-50/10 transition-colors text-xs font-medium">
                                                {/* Info Toko */}
                                                <td className="p-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-zinc-950 uppercase tracking-tight">{shop.shop_name}</span>
                                                        <span className="text-[10px] text-zinc-450 mt-0.5">slug: {shop.slug}</span>
                                                        <div className="flex items-center gap-1.5 mt-2 text-[10px] font-semibold text-zinc-400 uppercase">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            Daftar: {registerDate}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Pemilik & Alamat */}
                                                <td className="p-5">
                                                    <div className="flex flex-col space-y-1 max-w-[280px]">
                                                        <span className="font-bold text-zinc-850">{shop.user?.name}</span>
                                                        <span className="text-[10px] text-zinc-400">{shop.user?.email}</span>
                                                        <div className="flex items-start gap-1 text-[10px] text-zinc-500 mt-1">
                                                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                                            <span className="line-clamp-2">{shop.pickup_address || '-'}, Kode Pos: {shop.postal_code || '-'}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* KTP & Selfie */}
                                                <td className="p-5">
                                                    <button 
                                                        onClick={() => setSelectedShop(shop)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 transition-colors rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-700"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        Lihat Dokumen
                                                    </button>
                                                </td>

                                                {/* Status */}
                                                <td className="p-5">
                                                    <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${getStatusStyle(shop.status)}`}>
                                                        {formatStatusText(shop.status)}
                                                    </span>
                                                </td>

                                                {/* Aksi */}
                                                <td className="p-5 text-right">
                                                    {shop.status === 'pending' ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                disabled={processingId !== null}
                                                                onClick={() => handleReject(shop.id)}
                                                                className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors rounded-xl border border-rose-200 flex items-center justify-center disabled:opacity-50"
                                                                title="Tolak Pendaftaran"
                                                            >
                                                                {processingId === shop.id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <X className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                            <button
                                                                disabled={processingId !== null}
                                                                onClick={() => handleApprove(shop.id)}
                                                                className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors rounded-xl border border-emerald-200 flex items-center justify-center disabled:opacity-50"
                                                                title="Setujui Pendaftaran"
                                                            >
                                                                {processingId === shop.id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Check className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-zinc-400 uppercase font-bold italic">Selesai Ditinjau</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Review Dokumen */}
            {selectedShop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedShop(null)}></div>
                    
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Header Modal */}
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-sm font-bold text-zinc-950 uppercase tracking-tight">Review Dokumen Verifikasi</h3>
                                <p className="text-[10px] text-zinc-400 font-medium uppercase mt-0.5">Toko: {selectedShop.shop_name}</p>
                            </div>
                            <button onClick={() => setSelectedShop(null)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Modal */}
                        <div className="p-6 space-y-6">
                            {/* Alamat Pickup & Detail */}
                            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/60 space-y-3">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                                    Informasi & Alamat Toko
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase">Nama Toko</p>
                                        <p className="font-bold text-zinc-800 uppercase mt-0.5">{selectedShop.shop_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase">Pemilik</p>
                                        <p className="font-bold text-zinc-800 mt-0.5">{selectedShop.user?.name}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase">Alamat Lengkap</p>
                                        <p className="font-medium text-zinc-750 mt-0.5">{selectedShop.pickup_address || '-'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase">Catatan Alamat / Detail</p>
                                        <p className="font-medium text-zinc-700 mt-0.5 italic">"{selectedShop.address_note || '-'}"</p>
                                    </div>
                                </div>
                            </div>

                            {/* Foto KTP & Selfie */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* KTP */}
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-zinc-500" />
                                        Foto KTP
                                    </h4>
                                    <div className="aspect-[4/3] bg-zinc-150 rounded-2xl overflow-hidden border border-zinc-200/80 flex items-center justify-center relative group">
                                        {selectedShop.ktp_image ? (
                                            <a href={`/storage/${selectedShop.ktp_image}`} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                                                <img 
                                                    src={`/storage/${selectedShop.ktp_image}`} 
                                                    alt="KTP" 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold uppercase tracking-wider gap-1">
                                                    Zoom Image <ArrowUpRight className="w-3.5 h-3.5" />
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="text-center p-4">
                                                <AlertCircle className="w-8 h-8 mx-auto text-zinc-400 mb-1" />
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Foto KTP Tidak Ada</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Selfie */}
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-zinc-500" />
                                        Foto Selfie
                                    </h4>
                                    <div className="aspect-[4/3] bg-zinc-150 rounded-2xl overflow-hidden border border-zinc-200/80 flex items-center justify-center relative group">
                                        {selectedShop.selfie_image ? (
                                            <a href={`/storage/${selectedShop.selfie_image}`} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                                                <img 
                                                    src={`/storage/${selectedShop.selfie_image}`} 
                                                    alt="Selfie" 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold uppercase tracking-wider gap-1">
                                                    Zoom Image <ArrowUpRight className="w-3.5 h-3.5" />
                                                </div>
                                            </a>
                                        ) : (
                                            <div className="text-center p-4">
                                                <AlertCircle className="w-8 h-8 mx-auto text-zinc-400 mb-1" />
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Foto Selfie Tidak Ada</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal / Aksi */}
                        <div className="p-6 border-t border-zinc-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white z-10">
                            <button
                                onClick={() => setSelectedShop(null)}
                                className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-all rounded-xl text-xs font-bold uppercase tracking-wider"
                            >
                                Tutup
                            </button>

                            {selectedShop.status === 'pending' && (
                                <>
                                    <button
                                        disabled={processingId !== null}
                                        onClick={() => handleReject(selectedShop.id)}
                                        className="px-5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        {processingId === selectedShop.id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <X className="w-3.5 h-3.5" />
                                        )}
                                        Tolak Verifikasi
                                    </button>
                                    <button
                                        disabled={processingId !== null}
                                        onClick={() => handleApprove(selectedShop.id)}
                                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white transition-all rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-emerald-600/10"
                                    >
                                        {processingId === selectedShop.id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Check className="w-3.5 h-3.5" />
                                        )}
                                        Setujui & Verifikasi
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
