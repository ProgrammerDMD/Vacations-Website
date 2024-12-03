"use client";

import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
    const session = useSession();
    const router = useRouter();
    useEffect(() => {
        signOut({ redirect: false }).then(() => {
            router.push("/login");
        });
    }, []);
}