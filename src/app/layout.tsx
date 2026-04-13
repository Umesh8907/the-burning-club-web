import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "The Burning Club | Elite Gym Management",
  description: "Experience the fire of elite fitness at The Burning Club.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.variable} antialiased selection:bg-brand/30`} suppressHydrationWarning>
        <Toaster 
          position="top-center"
          toastOptions={{
            className: 'glass text-white border-zinc-700/50',
            duration: 4000,
            style: {
              background: '#09090B',
              color: '#fff',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
