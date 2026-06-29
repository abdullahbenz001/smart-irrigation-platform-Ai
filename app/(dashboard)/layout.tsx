import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <main className="min-h-screen bg-linear-to-b from-blue-50 to-green-50 p-4">
          <div className=" max-w-7xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
