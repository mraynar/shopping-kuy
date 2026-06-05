import React from 'react';
import { Star } from 'lucide-react';

export default function Reviews({ reviews }) {
    return (
        <div className="bg-white rounded-xl p-10 border border-zinc-100 shadow-sm space-y-10">
            <h3 className="text-3xl font-bold text-zinc-900 uppercase">Ulasan Kamu</h3>
            <div className="space-y-8">
                {[1, 2].map((i) => (
                    <div key={i} className="border-b border-zinc-50 pb-8 last:border-0">
                        <div className="flex justify-between mb-4">
                            <div className="flex gap-1 text-yellow-400">
                                {[...Array(5)].map((_, s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                            </div>
                            <span className="text-[12px] font-bold text-zinc-300 uppercase">20 Mar 2026</span>
                        </div>
                        <p className="text-sm font-medium text-zinc-600 leading-relaxed mb-4  text-[12px]">"Jaketnya gila sih, kualitas kulitnya masih 10/10 sesuai deskripsi banget. Packaging aman!"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-100 rounded-md overflow-hidden">
                                <img src="/storage/products/nike shoes.jpg" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[12px] font-bold uppercase text-zinc-900">Vintage Leather Jacket</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
