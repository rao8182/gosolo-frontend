import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoSolo - Premium Gummy Supplements",
  description: "Shop premium gummy supplements for energy, sleep, immunity, and focus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Material Icons */}
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
            rel="stylesheet"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Razorpay Script */}
          <Script 
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="lazyOnload"
          />
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
