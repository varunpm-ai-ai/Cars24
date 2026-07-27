import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";
import Header from "@/components/Header";
import Footer from "@/components/Fotter";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cars24 | Buy & Sell Used Cars with Dynamic Recommended Pricing",
  description: "India's premier marketplace for buying and selling quality used cars with dynamic regional and seasonal market pricing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <AuthProvider>
          <LocationProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-right" richColors />
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
