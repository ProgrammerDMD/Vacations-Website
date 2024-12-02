"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Product } from "@/app/api/CheckoutController";
import { getServerSession } from "next-auth";

type VacationPurchaseResponse = Record<string, boolean>;

export async function completeCheckout(products: Product[], total: number) : Promise<boolean> {
    if (products.length == 0) return true;

    const session = await getServerSession(authOptions);
    if (!session) return false;

    const transactionRequest = await fetch("http://localhost:3001/transaction/vacations", {
        method: "POST",
        headers: {
            "Authorization": session.accessToken as string,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            vacations: products,
            total: total
        })
    });

    if (!transactionRequest.ok) return false;
    const response: VacationPurchaseResponse = await transactionRequest.json();
    const failedPurchases = Object.entries(response).filter(value => !value[1]);

    return failedPurchases.length == 0;
}