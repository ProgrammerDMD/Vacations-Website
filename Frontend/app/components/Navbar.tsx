"use client";
import { useCheckout } from "@/app/api/CheckoutController";
import Checkout from "@/app/components/Checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const params = useSearchParams();
    const checkout = useCheckout();

    return (
        <div className="w-full flex gap-4">
            <Button onClick={() => {
                router.push("/");
            }}>Home</Button>
            <Input id="search" defaultValue={params.get("query") ? decodeURIComponent(params.get("query") as string) : ""} placeholder="Search for a vacation" onKeyDown={(event) => {
                const element = document.getElementById("search") as HTMLInputElement;
                const value = element.value.trim();
                if (event.key == "Enter" && value.length > 0) {
                    const query = encodeURIComponent(value);
                    router.push(`/?page=0&query=${query}`)
                }
            }} />
            <Checkout />
        </div>
    );
}