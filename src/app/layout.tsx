import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Jadwal Kuliah - Dashboard",
  description: "Aplikasi web jadwal kuliah dengan desain modern dan minimalis untuk mengelola jadwal kuliah semester Gasal-1 2025/2026",
  keywords: ["jadwal kuliah", "schedule", "universitas", "mahasiswa", "akademik"],
  authors: [{ name: "AI Assistant" }],
  creator: "AI Assistant",
  publisher: "AI Assistant",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://jadwal-kuliah.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Jadwal Kuliah - Dashboard",
    description: "Aplikasi web jadwal kuliah dengan desain modern dan minimalis untuk mengelola jadwal kuliah semester Gasal-1 2025/2026",
    url: 'https://jadwal-kuliah.vercel.app',
    siteName: 'Jadwal Kuliah',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Jadwal Kuliah Dashboard',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Jadwal Kuliah - Dashboard",
    description: "Aplikasi web jadwal kuliah dengan desain modern dan minimalis untuk mengelola jadwal kuliah semester Gasal-1 2025/2026",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/MY.png?v=2', sizes: 'any', type: 'image/png' },
    ],
    apple: [
      { url: '/MY.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/MY.png?v=2', sizes: '192x192', type: 'image/png' },
      { url: '/MY.png?v=2', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/MY.png?v=2" type="image/png" />
        <link rel="shortcut icon" href="/MY.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/MY.png?v=2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Jadwal Kuliah" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
