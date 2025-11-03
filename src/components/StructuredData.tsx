"use client";

import { businessInfo } from "@/config/business-info";

interface StructuredDataProps {
  type?: "organization" | "localBusiness" | "breadcrumb" | "service";
  data?: any;
}

export default function StructuredData({ type = "organization", data }: StructuredDataProps) {
  const getSchema = () => {
    switch (type) {
      case "organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: businessInfo.businessName,
          url: "https://momentsnap.com",
          logo: "https://momentsnap.com/logo.png",
          description: "감성 스냅 포토그래퍼 - 웨딩, 커플, 프로필, 가족 사진 촬영 전문",
          address: {
            "@type": "PostalAddress",
            addressLocality: "서울시 강남구",
            addressRegion: "서울",
            addressCountry: "KR",
          },
          contactPoint: {
            "@type": "ContactPoint",
            telephone: businessInfo.contact.ko.phone,
            contactType: "Customer Service",
            email: businessInfo.contact.ko.email,
            availableLanguage: ["Korean", "English", "Japanese"],
          },
          sameAs: [
            businessInfo.social.instagram,
            businessInfo.social.facebook,
          ],
        };

      case "localBusiness":
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://momentsnap.com",
          name: businessInfo.businessName,
          image: "https://momentsnap.com/og-image.jpg",
          url: "https://momentsnap.com",
          telephone: businessInfo.contact.ko.phone,
          email: businessInfo.contact.ko.email,
          priceRange: "₩₩₩",
          address: {
            "@type": "PostalAddress",
            streetAddress: businessInfo.contact.ko.address,
            addressLocality: "강남구",
            addressRegion: "서울",
            addressCountry: "KR",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 37.5665,
            longitude: 127.0782,
          },
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "10:00",
            closes: "18:00",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "127",
          },
        };

      case "breadcrumb":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: data?.items?.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `https://momentsnap.com${item.url}`,
          })),
        };

      case "service":
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Photography Services",
          provider: {
            "@type": "LocalBusiness",
            name: businessInfo.businessName,
            telephone: businessInfo.contact.ko.phone,
          },
          areaServed: {
            "@type": "Country",
            name: "South Korea",
          },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Photography Services",
            itemListElement: [
              {
                "@type": "OfferCatalog",
                name: "Wedding Photography",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Wedding Snap Photography",
                      description: "Professional wedding snap photography service",
                    },
                  },
                ],
              },
              {
                "@type": "OfferCatalog",
                name: "Portrait Photography",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Profile & Portrait Photography",
                      description: "Professional profile and portrait photography",
                    },
                  },
                ],
              },
            ],
          },
        };

      default:
        return {};
    }
  };

  const schema = getSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

