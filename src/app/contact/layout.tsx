import { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기",
  description: "촬영 문의 및 예약은 언제든지 환영합니다. 전화, 이메일, 온라인 문의 폼을 통해 편하게 연락주세요. 빠른 상담 가능.",
  keywords: ["촬영 문의", "예약 문의", "포토그래퍼 연락처", "촬영 상담", "견적 문의"],
  openGraph: {
    title: "문의하기 | Moment Snap",
    description: "촬영 문의 및 예약은 언제든지 환영합니다. 빠른 상담 가능.",
    type: "website",
    url: "https://momentsnap.com/contact",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Moment Snap 문의",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "문의하기 | Moment Snap",
    description: "촬영 문의 및 예약은 언제든지 환영합니다. 빠른 상담 가능.",
    images: ["/og-image.jpg"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

