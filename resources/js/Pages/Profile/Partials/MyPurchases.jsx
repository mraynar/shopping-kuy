import React from 'react';
import { Truck, Package } from 'lucide-react';

export default function MyPurchases({ orders }) {
    return (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-3xl font-bold text-zinc-900 uppercase ml-4">Histori Pembelian</h3>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-4">
                {['All', 'Waiting Payment', 'Processed', 'Shipped', 'Completed'].map((s) => (
                    <button key={s} className="shrink-0 bg-white border border-zinc-100 px-6 py-3 rounded-xl text-[12px] font-bold uppercase hover:bg-zinc-900 hover:text-white transition shadow-sm">
                        {s}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl p-8 border border-zinc-100 shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-50 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-zinc-50 rounded-lg flex items-center justify-center">
                            <Truck className="w-6 h-6 text-zinc-400" />
                        </div>
                        <div>
                            <p className="text-[12px] font-bold uppercase text-zinc-400">Order ID: SK-908231</p>
                            <h4 className="text-sm font-bold uppercase text-zinc-900">Nike Air Jordan 1 Retro</h4>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-[12px] font-bold uppercase">In Transit</span>
                        <p className="text-[12px] font-bold text-zinc-900 mt-2">Est. Arrival: 24 Apr 2026</p>
                    </div>
                </div>

                <div className="grid grid-cols-4 relative pt-4">
                    <div className="absolute top-7 left-0 w-full h-[2px] bg-zinc-100 z-0"></div>
                    {[
                        { label: 'Payment', active: true },
                        { label: 'Processed', active: true },
                        { label: 'On Courier', active: true },
                        { label: 'Arrived', active: false },
                    ].map((step, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                            <div className={`w-6 h-6 rounded-xl border-4 border-white shadow-md ${step.active ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
                            <span className={`text-[12px] font-bold uppercase ${step.active ? 'text-zinc-900' : 'text-zinc-300'}`}>{step.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
