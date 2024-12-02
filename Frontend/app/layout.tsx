import type { Metadata } from "next";
import "./globals.css";
import { AuthenticationProvider } from "@/app/api/AuthenticationProvider";

export const metadata: Metadata = {
  title: "OOP",
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
