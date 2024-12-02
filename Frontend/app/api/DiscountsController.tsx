"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Coupon, Discount, LoyaltyType } from "@/app/types/types";
import { getServerSession } from "next-auth";

type LimitedDiscountsResponse = Record<string, number>;

export async function getCoupon(code: string) : Promise<Coupon | undefined> {
    if (!code) return;

    const couponsRequest = await fetch(`http://localhost:3001/coupon/${code}`);
    if (!couponsRequest.ok) return;

    const coupon: Coupon = await couponsRequest.json();
    return coupon;
}

export async function getDiscounts() : Promise<Discount[]> {
    const discountsRequest = await fetch("http://localhost:3001/discounts");
    if (!discountsRequest.ok) return [];

    const discounts: Discount[] = await discountsRequest.json();
    return discounts;
}

export async function getLimitedDiscounts() : Promise<LimitedDiscountsResponse> {
    const discountsRequest = await fetch("http://localhost:3001/discounts/limited");
    if (!discountsRequest.ok) return {};

    const discounts: LimitedDiscountsResponse = await discountsRequest.json();
    return discounts;
}

export async function getLoyalty() : Promise<LoyaltyType> {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) return LoyaltyType.NONE;

    const discountsRequest = await fetch("http://localhost:3001/discounts/loyalty", {
        headers: {
            "Authorization": session.accessToken as string
        }
    });
    
    if (!discountsRequest.ok) return LoyaltyType.NONE;

    const response: { result: LoyaltyType } = await discountsRequest.json();
    return response.result;
}