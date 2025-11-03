import { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 & 가격",
  description: "베이직, 프리미엄, 웨딩 패키지 등 다양한 촬영 서비스와 합리적인 가격 안내. 전문 포토그래퍼의 맞춤형 촬영 서비스.",
  keywords: ["촬영 서비스", "촬영 가격", "웨딩 패키지", "스냅 촬영", "프로필 촬영", "상품 촬영"],
  openGraph: {
    title: "서비스 & 가격 | Moment Snap",
    description: "베이직, 프리미엄, 웨딩 패키지 등 다양한 촬영 서비스와 합리적인 가격 안내",
    type: "website",
    url: "https://momentsnap.com/services",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Moment Snap 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "서비스 & 가격 | Moment Snap",
    description: "베이직, 프리미엄, 웨딩 패키지 등 다양한 촬영 서비스와 합리적인 가격 안내",
    images: ["/og-image.jpg"],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

