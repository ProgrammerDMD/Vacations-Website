"use server";

import { Product } from "@/app/api/CheckoutController";

type VacationPurchaseResponse = Record<string, boolean>;

export async function completeCheckout(products: Product[]) : Promise<boolean> {
    if (products.length == 0) return true;
    
    const transactionRequest = await fetch("http://localhost:3001/transaction/vacations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(products)
    });

    if (!transactionRequest.ok) return false;
    const response: VacationPurchaseResponse = await transactionRequest.json();
    const failedPurchases = Object.entries(response).filter(value => !value[1]);

    return failedPurchases.length == 0;
}