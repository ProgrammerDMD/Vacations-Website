import type { Metadata } from "next";
import "../globals.css";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata: Metadata = {
    title: "OOP / Login",
    description: "",
};

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    if (session) return redirect("/");

    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
