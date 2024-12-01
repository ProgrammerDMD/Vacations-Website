import { Coupon } from "@/app/types/types";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

export interface Product {
    id: string
    quantity: number
}

interface Checkout {
    products: Product[]
    coupons: Coupon[]
    addProduct: (id: string, quantity: number) => void
    removeProduct: (id: string, quantity: number) => void
    addCoupon: (coupon: Coupon) => void
    removeCoupon: (code: string) => void
    clear: () => void
}

export const useCheckout = create<Checkout>()(
    persist(
        (set, get) => ({
            products: [],
            coupons: [],
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
            addCoupon: (coupon: Coupon) => {
                const coupons = get().coupons;
                if (!coupons.find(value => value.code === coupon.code)) {
                    coupons.push(coupon);
                    set({ coupons: coupons  });
                }
            },
            removeCoupon: (code: string) => {
                set({ coupons: get().coupons.filter(value => value.code === code) });
            },
            clear: () => {
                set({ products: [], coupons: [] });
            }
        }),
        {
            name: "checkout-storage",
            storage: createJSONStorage(() => localStorage)
        }
    )
);