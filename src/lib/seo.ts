import { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}

/**
 * SEO 메타데이터 생성 헬퍼 함수
 */
export function generateSEO({
  title,
  description,
  path = "/",
  keywords = [],
  image = "/og-image.jpg",
  noIndex = false,
}: SEOProps): Metadata {
  const baseUrl = "https://momentsnap.com";
  const url = `${baseUrl}${path}`;

  return {
    title,
    description,
    keywords: [
      "스냅사진",
      "포토그래퍼",
      "웨딩스냅",
      "커플촬영",
      "프로필사진",
      ...keywords,
    ],
    alternates: {
      canonical: url,
      languages: {
        "ko-KR": `${baseUrl}/ko${path}`,
        "en-US": `${baseUrl}/en${path}`,
        "ja-JP": `${baseUrl}/ja${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Moment Snap",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@momentsnap",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
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
  };
}

/**
 * 브레드크럼 데이터 생성
 */
export function generateBreadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://momentsnap.com${item.url}`,
    })),
  };
}

/**
 * 이미지 스키마 생성
 */
export function generateImageSchema(images: {
  url: string;
  caption?: string;
  description?: string;
}[]) {
  return images.map((image) => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: image.url,
    caption: image.caption || "",
    description: image.description || "",
    creditText: "Moment Snap",
    creator: {
      "@type": "Organization",
      name: "Moment Snap",
    },
  }));
}

