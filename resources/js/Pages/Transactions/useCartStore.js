import { create } from 'zustand';

const useCartStore = create((set) => ({
    cartCount: 0,

    setCartCount: (count) => set({ cartCount: count }),

    increment: (amount = 1) =>
        set((state) => ({
            cartCount: state.cartCount + amount,
        })),

    decrement: (amount = 1) =>
        set((state) => ({
            cartCount: Math.max(0, state.cartCount - amount),
        })),

    reset: () => set({ cartCount: 0 }),
}));

export default useCartStore;
