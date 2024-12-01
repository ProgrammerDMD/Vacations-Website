"use server";
import { Coupon, Discount } from "@/app/types/types";

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