"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBasket } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Navbar() {
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
            <div className="flex items-center justify-center">
                <ShoppingBasket />
                <span className="absolute font-light text-sm mt-4 ml-4 bg-black text-white px-1 bg-opacity-70 rounded-sm">0</span>
            </div>
        </div>
    );
}