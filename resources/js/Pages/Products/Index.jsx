import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    Plus, Package, X, Loader2, CheckCircle2,
    Tag, User, Minus, ArrowLeft, Image as ImageIcon
} from 'lucide-react';

export default function ProductManagement({ products, shop, categories, genders, conditions }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [displayPrice, setDisplayPrice] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        stock: 1,
        weight: '',
        size: '',
        brand: '',
        condition: '',
        gender: '',
        category: '',
        description: '',
        minus_detail: '',
        is_negotiable: true,
        images: [],
    });

    // Handle Format Rupiah
    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const formatted = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(rawValue);

        setDisplayPrice(rawValue ? formatted : "");
        setData("price", rawValue);
    };

    // Handle Image Selection & Previews
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (data.images.length + files.length > 5) {
            alert("Maksimal 5 foto saja");
            return;
        }

        const newImages = [...data.images, ...files];
        setData('images', newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    // Remove specific image
    const removeImage = (index) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    // Stok Counter Logic
    const incrementStock = () => setData('stock', parseInt(data.stock) + 1);
    const decrementStock = () => {
        if (data.stock > 1) setData('stock', parseInt(data.stock) - 1);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                setShowSuccess(true);
                reset();
                setImagePreviews([]);
                setDisplayPrice("");
                setTimeout(() => setShowSuccess(false), 4000);
            },
        });
    };

    return (
        <div className="min-h-screen bg-zinc-50 font-['Poppins'] p-5 md:p-12 text-zinc-900 leading-relaxed">
            {/* Top Navigation */}
            <div className="max-w-6xl mx-auto mb-8">
                <button
                    onClick={() => router.get(route('profile.index', { tab: 'toko' }))}
                    className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[14px] font-bold uppercase tracking-widest">Kembali ke Toko</span>
                </button>
            </div>

            {/* Header Section */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="text-left">
                    <h1 className="text-3xl font-bold  uppercase">Daftar Produk</h1>
                    <p className="text-zinc-400 text-[12px] mt-1 uppercase font-bold tracking-[0.2em]">Store: {shop.shop_name}</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-zinc-900 text-white px-10 py-5 rounded-xl text-[14px] font-bold uppercase flex items-center justify-center gap-3 shadow-2xl hover:bg-zinc-800 transition-all active:scale-95">
                    <Plus size={20} /> TAMBAH PRODUK
                </button>
            </div>

            {/* Product Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.length > 0 ? products.map((product) => (
                    <div key={product.id} className="bg-white border border-zinc-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
                        <div className="h-72 bg-zinc-100 relative overflow-hidden">
                            {product.thumbnail && (
                                <img src={`/storage/${product.thumbnail}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                            )}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/20">
                                <p className="text-[9px] font-bold uppercase text-zinc-900 er">{product.gender}</p>
                            </div>
                        </div>
                        <div className="p-8 text-left">
                            <div className="flex justify-between items-start mb-3 gap-3">
                                <h3 className="font-bold text-xl leading-tight uppercase line-clamp-1 ">{product.name}</h3>
                                <span className="shrink-0 bg-zinc-900 text-white text-[8px] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest">{product.condition.replace('_', ' ')}</span>
                            </div>
                            <p className="text-zinc-900 font-bold text-2xl mb-6 er">
                                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(product.price)}
                            </p>
                            <div className="flex gap-6 text-zinc-400 text-[9px] font-bold uppercase border-t border-zinc-50 pt-6 tracking-[0.15em]">
                                <span className="flex items-center gap-2"><Package size={14} className="text-zinc-300"/> {product.stock} ITEM</span>
                                <span className="flex items-center gap-2"><Tag size={14} className="text-zinc-300"/> {product.category}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full bg-white border-2 border-dashed border-zinc-100 rounded-[40px] py-28 flex flex-col items-center">
                        <Package size={60} className="text-zinc-100 mb-6" />
                        <p className="text-zinc-300 font-bold uppercase text-[12px] tracking-[0.3em]">Belum ada produk terbit</p>
                    </div>
                )}
            </div>

            {/* Modal Input Produk */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-200 my-auto border border-zinc-100 overflow-hidden">
                        <div className="px-8 pt-8 border-b border-zinc-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
                            <h2 className="text-2xl font-bold uppercase">Input Produk Baru</h2>
                            <button onClick={() => setIsModalOpen(false)} className="bg-zinc-50 p-2 rounded-full text-zinc-400 hover:text-zinc-900 transition-all"><X size={24}/></button>
                        </div>

                        <form onSubmit={submit} className="p-8 space-y-8 text-left max-h-[70vh] overflow-y-auto no-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Nama Barang</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-zinc-50 border-none rounded-xl p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none placeholder:text-zinc-200 transition-all" placeholder="Crewneck Vintage 90s..."/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Kategori Utama</label>
                                    <select value={data.category} onChange={e => setData('category', e.target.value)} className={`w-full bg-zinc-50 border-none rounded-xl p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none cursor-pointer appearance-none transition-all ${!data.category ? 'text-zinc-200' : 'text-zinc-900'}`}>
                                        <option value="">Pilih Kategori</option>
                                        {categories?.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Jenis Kelamin</label>
                                    <select value={data.gender} onChange={e => setData('gender', e.target.value)} className={`w-full bg-zinc-50 border-none rounded-xl p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none cursor-pointer appearance-none transition-all ${!data.gender ? 'text-zinc-200' : 'text-zinc-900'}`}>
                                        <option value="">Pilih Jenis Kelamin</option>
                                        {genders?.map(g => (
                                            <option key={g.value} value={g.value}>{g.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Harga Jual</label>
                                    <input type="text" value={displayPrice} onChange={handlePriceChange} className="w-full bg-zinc-50 border-none rounded-xl p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none placeholder:text-zinc-200 transition-all" placeholder="Rp 0"/>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Stok</label>
                                    <div className="flex items-center bg-zinc-50 rounded-xl p-1.5 border border-zinc-100">
                                        <button type="button" onClick={decrementStock} className="p-3.5 hover:bg-white text-zinc-400 hover:text-zinc-900 rounded-lg transition-all active:scale-90"><Minus size={16}/></button>
                                        <input type="number" value={data.stock} readOnly className="w-full bg-transparent border-none text-center text-sm font-bold outline-none" />
                                        <button type="button" onClick={incrementStock} className="p-3.5 hover:bg-white text-zinc-400 hover:text-zinc-900 rounded-lg transition-all active:scale-90"><Plus size={16}/></button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Berat (Gram)</label>
                                    <input type="number" value={data.weight} onChange={e => setData('weight', e.target.value)} className="w-full bg-zinc-50 border-none rounded-xl p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none placeholder:text-zinc-200 transition-all" placeholder="500"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Size</label>
                                    <input type="text" value={data.size} onChange={e => setData('size', e.target.value)} className="w-full bg-zinc-50 border-none rounded-xl p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none placeholder:text-zinc-200 transition-all" placeholder="L / XL / 42"/>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Kondisi Barang</label>
                                    <select value={data.condition} onChange={e => setData('condition', e.target.value)} className={`w-full bg-zinc-50 border-none rounded-xl p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none cursor-pointer appearance-none transition-all ${!data.condition ? 'text-zinc-200' : 'text-zinc-900'}`}>
                                        <option value="">Pilih Kondisi</option>
                                        {conditions?.map((cond, index) => (
                                            <option key={index} value={cond.value}>{cond.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Merk (Brand)</label>
                                    <input type="text" value={data.brand} onChange={e => setData('brand', e.target.value)} className="w-full bg-zinc-50 border-none rounded-xl p-5 text-sm font-bold focus:ring-2 focus:ring-zinc-900 outline-none placeholder:text-zinc-200 transition-all uppercase" placeholder="Tulis merk barang..."/>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Deskripsi Produk</label>
                                <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="w-full bg-zinc-50 border-none rounded-xl p-6 text-sm font-bold h-40 resize-none focus:ring-2 focus:ring-zinc-900 outline-none leading-relaxed placeholder:text-zinc-200 transition-all" placeholder="Jelaskan detail barang, material, atau kelengkapan..."/>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1 tracking-widest">Upload Media</label>
                                <div className="w-full bg-zinc-50 border-2 border-dashed border-zinc-100 rounded-[24px] p-10 text-center hover:bg-zinc-100 transition-all cursor-pointer relative group">
                                    <input type="file" multiple onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    <div className="flex flex-col items-center gap-3 group-hover:scale-110 transition-transform duration-500">
                                        <ImageIcon className="text-zinc-200 w-8 h-8" />
                                        <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest leading-loose">Tap untuk pilih foto <br/> (Maksimal 5)</p>
                                    </div>
                                </div>

                                {/* Image Previews with Remove Button */}
                                {imagePreviews.length > 0 && (
                                    <div className="flex flex-wrap gap-4 px-2">
                                        {imagePreviews.map((url, i) => (
                                            <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden group/item shadow-sm border border-zinc-50">
                                                <img src={url} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(i)}
                                                    className="absolute top-1 right-1 bg-zinc-900/80 backdrop-blur-md text-white p-1 rounded-md opacity-0 group-hover/item:opacity-100 transition-all scale-75"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={processing} className="w-full bg-zinc-900 text-white py-6 rounded-[20px] font-bold uppercase text-[12px] flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98] transition-all disabled:opacity-50 mt-10 tracking-[0.2em]">
                                {processing ? <Loader2 className="animate-spin" size={20}/> : 'Publish Barang'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/10 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white text-zinc-900 px-14 py-12 rounded-[48px] shadow-2xl flex flex-col items-center gap-8 text-center animate-in zoom-in-95 duration-500 border border-zinc-100">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                            <CheckCircle2 size={48} className="text-white" />
                        </div>
                        <div className="space-y-3">
                            <p className="text-3xl font-bold uppercase er">Produk Terbit!</p>
                            <p className="text-[12px] font-bold text-zinc-300 uppercase tracking-[0.3em]">Ready di etalase Anda</p>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden mt-6">
                            <div className="h-full bg-green-500" style={{ animation: 'progress-shrink 4000ms linear forwards' }}></div>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes progress-shrink { from { width: 100%; } to { width: 0%; } }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                input[type=number]::-webkit-inner-spin-button,
                input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
            `}} />
        </div>
    );
}
