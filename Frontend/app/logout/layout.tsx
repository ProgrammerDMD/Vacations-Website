import type { Metadata } from "next";
import "../globals.css";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthenticationProvider } from "@/app/api/AuthenticationProvider";

export const metadata: Metadata = {
    title: "OOP / Register",
    description: "",
};

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AuthenticationProvider>
                    {children}
                </AuthenticationProvider>
            </body>
        </html>
    );
}
