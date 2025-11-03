import { Metadata } from "next";

export const metadata: Metadata = {
  title: "포트폴리오",
  description: "웨딩, 커플, 프로필, 가족 사진 등 다양한 스냅 촬영 포트폴리오를 만나보세요. 전문 포토그래퍼의 감성적인 순간 포착.",
  keywords: ["포트폴리오", "스냅사진", "웨딩스냅", "커플촬영", "프로필사진", "가족사진", "상품사진"],
  openGraph: {
    title: "포트폴리오 | Moment Snap",
    description: "웨딩, 커플, 프로필, 가족 사진 등 다양한 스냅 촬영 포트폴리오",
    type: "website",
    url: "https://momentsnap.com/portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Moment Snap 포트폴리오",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "포트폴리오 | Moment Snap",
    description: "웨딩, 커플, 프로필, 가족 사진 등 다양한 스냅 촬영 포트폴리오",
    images: ["/og-image.jpg"],
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

