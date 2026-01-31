import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
} from "@clerk/nextjs";
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
  title: "Thesis - Learn Anything",
  description: "Thesis turns your company's knowledge into grounded answers with sources.",
  icons: {
    icon: '/brain-circle-mask.svg',
    apple: '/brain-circle-mask.svg',
  },
  metadataBase: new URL('https://usethesis.studio'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://usethesis.studio',
    siteName: 'Thesis',
    title: 'Thesis - Learn Anything',
    description: 'Thesis turns your company\'s knowledge into grounded answers with sources.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thesis - Learn Anything',
    description: 'Thesis turns your company\'s knowledge into grounded answers with sources.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder"}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fbfbfd] text-zinc-950`}
        >

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
