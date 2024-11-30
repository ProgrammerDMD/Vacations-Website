import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

export interface Product {
    id: string
    quantity: number
}

interface Checkout {
    products: Product[]
    addProduct: (id: string, quantity: number) => void
    removeProduct: (id: string, quantity: number) => void
    clear: () => void
}

export const useCheckout = create<Checkout>()(
    persist(
        (set, get) => ({
            products: [],
            addProduct: (id: string, quantity: number) => {
                if (!id || quantity <= 0) return;

                const products = get().products;
                const product = products.find(value => value.id === id);

                if (product) {
                    const updatedProducts = products.map(value => value.id === product.id ? { ...value, quantity: product.quantity + quantity } : value);
                    set({ products: updatedProducts });
                } else {
                    const updatedProducts = [...products, { id, quantity }];
                    set({ products: updatedProducts });
                }
            },
            removeProduct: (id: string, quantity: number) => {
                if (!id || quantity <= 0) return;

                const updatedProducts = get().products
                    .map(value => value.id === id ? { ...value, quantity: value.quantity - quantity } : value)
                    .filter(value => value.quantity > 0);

                set({ products: updatedProducts });
            },
            clear: () => {
                set({ products: [] });
            }
        }),
        {
            name: "checkout-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
);