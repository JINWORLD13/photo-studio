import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { LanguageProvider } from "@/contexts/LanguageContext";

const notoSans = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSerif = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Moment Snap - 감성 스냅 포토그래퍼",
    template: "%s | Moment Snap",
  },
  description: "당신의 소중한 순간을 영원히 남기는 감성 스냅 포토그래퍼. 일상의 특별함을 담아드립니다. 웨딩, 커플, 프로필, 가족 사진 촬영 전문.",
  keywords: ["스냅사진", "포토그래퍼", "웨딩스냅", "커플촬영", "프로필사진", "가족사진", "상품촬영", "감성사진", "Moment Snap"],
  authors: [{ name: "Moment Snap" }],
  creator: "Moment Snap",
  publisher: "Moment Snap",
  metadataBase: new URL("https://momentsnap.com"),
  alternates: {
    canonical: "/",
    languages: {
      "ko-KR": "/",
      "en-US": "/",
      "ja-JP": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://momentsnap.com",
    title: "Moment Snap - 감성 스냅 포토그래퍼",
    description: "당신의 소중한 순간을 영원히 남기는 감성 스냅 포토그래퍼. 웨딩, 커플, 프로필, 가족 사진 촬영 전문.",
    siteName: "Moment Snap",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Moment Snap - 감성 스냅 포토그래퍼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moment Snap - 감성 스냅 포토그래퍼",
    description: "당신의 소중한 순간을 영원히 남기는 감성 스냅 포토그래퍼",
    images: ["/og-image.jpg"],
    creator: "@momentsnap",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // naver: "your-naver-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1c1917" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <StructuredData type="organization" />
        <StructuredData type="localBusiness" />
      </head>
      <body className="font-sans">
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
