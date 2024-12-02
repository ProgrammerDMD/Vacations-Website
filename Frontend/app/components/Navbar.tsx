"use client";
import Checkout from "@/app/components/Checkout";
import { LoyaltyType } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

export default function Navbar({ discountAmount }: {
    discountAmount: Record<string, number>,
}) {
    const router = useRouter();
    const params = useSearchParams();

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
            <Checkout discountAmount={discountAmount} />
        </div>
    );
}