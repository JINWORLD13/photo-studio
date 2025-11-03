# 🚀 SEO 최적화 가이드

이 프로젝트는 완벽한 SEO 최적화가 적용되어 있습니다.

## 📋 목차
- [적용된 SEO 요소](#적용된-seo-요소)
- [메타데이터 설정](#메타데이터-설정)
- [구조화된 데이터](#구조화된-데이터)
- [사이트맵 & robots.txt](#사이트맵--robotstxt)
- [성능 최적화](#성능-최적화)
- [체크리스트](#체크리스트)

---

## ✅ 적용된 SEO 요소

### 1. **메타데이터 (Metadata)**
각 페이지별로 최적화된 메타데이터가 적용되어 있습니다.

#### 📍 루트 레이아웃 (`src/app/layout.tsx`)
- Title Template 설정
- Open Graph 메타태그
- Twitter Card 메타태그
- Canonical URL
- 다국어 alternate links
- Robots 설정
- 구글 Search Console 인증

#### 📍 개별 페이지
- `/portfolio` - 포트폴리오 페이지 메타데이터
- `/services` - 서비스 페이지 메타데이터
- `/contact` - 문의 페이지 메타데이터

### 2. **구조화된 데이터 (JSON-LD Schema.org)**

#### 📍 `src/components/StructuredData.tsx`
다음 스키마를 지원합니다:
- **Organization** - 회사 정보
- **LocalBusiness** - 지역 비즈니스 정보
- **BreadcrumbList** - 브레드크럼 네비게이션
- **Service** - 서비스 정보
- **ImageObject** - 이미지 메타데이터

### 3. **파일 구조**

```
public/
├── robots.txt          ✅ 검색 엔진 크롤링 규칙
├── manifest.json       ✅ PWA 설정
└── favicon.ico         ✅ 파비콘

src/
├── app/
│   ├── layout.tsx      ✅ 글로벌 메타데이터
│   ├── page.tsx        ✅ 홈페이지
│   ├── sitemap.ts      ✅ 동적 사이트맵
│   ├── opengraph-image.tsx ✅ OG 이미지
│   ├── portfolio/
│   │   └── page.tsx    ✅ 포트폴리오 메타데이터
│   ├── services/
│   │   └── page.tsx    ✅ 서비스 메타데이터
│   └── contact/
│       └── page.tsx    ✅ 문의 메타데이터
├── components/
│   └── StructuredData.tsx ✅ JSON-LD 스키마
└── lib/
    └── seo.ts          ✅ SEO 헬퍼 함수
```

---

## 🎯 메타데이터 설정

### Open Graph (Facebook, LinkedIn)
```tsx
openGraph: {
  type: "website",
  locale: "ko_KR",
  url: "https://momentsnap.com",
  title: "Moment Snap - 감성 스냅 포토그래퍼",
  description: "당신의 소중한 순간을...",
  siteName: "Moment Snap",
  images: [{
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
  }],
}
```

### Twitter Card
```tsx
twitter: {
  card: "summary_large_image",
  title: "Moment Snap - 감성 스냅 포토그래퍼",
  description: "당신의 소중한 순간을...",
  images: ["/og-image.jpg"],
}
```

### Robots Meta
```tsx
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
}
```

---

## 📊 구조화된 데이터

### 사용 방법

#### 1. Organization Schema
```tsx
import StructuredData from "@/components/StructuredData";

<StructuredData type="organization" />
```

#### 2. Local Business Schema
```tsx
<StructuredData type="localBusiness" />
```

#### 3. Breadcrumb Schema
```tsx
<StructuredData 
  type="breadcrumb" 
  data={{
    items: [
      { name: "홈", url: "/" },
      { name: "포트폴리오", url: "/portfolio" },
    ]
  }} 
/>
```

#### 4. Service Schema
```tsx
<StructuredData type="service" />
```

---

## 🗺️ 사이트맵 & robots.txt

### Sitemap (`src/app/sitemap.ts`)
Next.js가 자동으로 `/sitemap.xml`을 생성합니다.

**접근 URL:** `https://momentsnap.com/sitemap.xml`

### Robots.txt (`public/robots.txt`)
검색 엔진 크롤러를 위한 규칙이 정의되어 있습니다.

**접근 URL:** `https://momentsnap.com/robots.txt`

#### 크롤링 허용:
- ✅ 모든 공개 페이지
- ✅ 포트폴리오
- ✅ 서비스
- ✅ 문의

#### 크롤링 차단:
- ❌ `/admin/`
- ❌ `/auth/`
- ❌ `/api/`
- ❌ `/debug/`

---

## 🎨 Open Graph 이미지

### 동적 OG 이미지 생성
`src/app/opengraph-image.tsx`에서 동적으로 OG 이미지를 생성합니다.

**생성 URL:** `https://momentsnap.com/opengraph-image`

### 커스터마이징
실제 프로필 이미지를 사용하려면:
1. `public/og-image.jpg` (1200x630px) 추가
2. `layout.tsx`의 `openGraph.images.url` 수정

---

## 📱 PWA (Progressive Web App)

### Manifest (`public/manifest.json`)
- ✅ 앱 이름 및 설명
- ✅ 아이콘 (192x192, 512x512)
- ✅ 테마 색상
- ✅ 디스플레이 모드

### 필요한 아이콘:
```
public/
├── icon-192.png    (192x192px)
├── icon-512.png    (512x512px)
└── favicon.ico     (32x32px)
```

---

## ⚡ 성능 최적화

### 이미지 최적화
```tsx
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="설명적인 alt 텍스트"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### 폰트 최적화
```tsx
// layout.tsx에서 이미 적용됨
import { Noto_Sans_KR } from "next/font/google";

const notoSans = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
});
```

---

## 📝 체크리스트

### 배포 전 필수 작업

#### 1. ⚙️ 설정 파일 업데이트
- [ ] `src/config/business-info.ts` - 실제 연락처로 변경
- [ ] `layout.tsx` - `metadataBase` URL 변경
- [ ] `sitemap.ts` - 실제 도메인으로 변경
- [ ] `robots.txt` - 실제 도메인으로 변경

#### 2. 🖼️ 이미지 준비
- [ ] `/public/og-image.jpg` (1200x630px) 추가
- [ ] `/public/icon-192.png` (192x192px) 추가
- [ ] `/public/icon-512.png` (512x512px) 추가
- [ ] `/public/favicon.ico` (32x32px) 추가

#### 3. 🔍 Search Console 설정
- [ ] Google Search Console 등록
- [ ] 사이트맵 제출 (`/sitemap.xml`)
- [ ] 인증 코드 추가 (`layout.tsx` - `verification.google`)
- [ ] Naver Search Advisor 등록 (선택)

#### 4. 🧪 테스트
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] [Schema.org Validator](https://validator.schema.org/)

#### 5. 📊 성능 체크
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
- [ ] Core Web Vitals 확인

---

## 🔧 커스터마이징 가이드

### 새 페이지에 SEO 추가하기

#### 1. 메타데이터 추가
```tsx
// src/app/new-page/page.tsx
export const metadata = {
  title: "페이지 제목 | Moment Snap",
  description: "페이지 설명...",
  openGraph: {
    title: "페이지 제목",
    description: "페이지 설명...",
    url: "https://momentsnap.com/new-page",
  },
};
```

#### 2. 사이트맵에 추가
```tsx
// src/app/sitemap.ts
{
  url: `${baseUrl}/new-page`,
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.8,
}
```

#### 3. 구조화된 데이터 추가 (선택)
```tsx
<StructuredData type="breadcrumb" data={{
  items: [
    { name: "홈", url: "/" },
    { name: "새 페이지", url: "/new-page" },
  ]
}} />
```

---

## 🌍 다국어 SEO

현재 지원 언어:
- 🇰🇷 한국어 (ko-KR)
- 🇺🇸 영어 (en-US)
- 🇯🇵 일본어 (ja-JP)

### Alternate Links
자동으로 각 페이지에 추가됩니다:
```html
<link rel="alternate" hreflang="ko-KR" href="https://momentsnap.com/" />
<link rel="alternate" hreflang="en-US" href="https://momentsnap.com/en" />
<link rel="alternate" hreflang="ja-JP" href="https://momentsnap.com/ja" />
```

---

## 📈 SEO 모니터링

### 추천 도구
1. **Google Analytics** - 트래픽 분석
2. **Google Search Console** - 검색 성능
3. **Ahrefs / SEMrush** - 키워드 순위
4. **Hotjar** - 사용자 행동 분석

### 주요 지표
- 검색 노출수 (Impressions)
- 클릭률 (CTR)
- 평균 순위 (Average Position)
- Core Web Vitals (LCP, FID, CLS)

---

## 🆘 문제 해결

### OG 이미지가 표시되지 않을 때
1. 이미지 크기 확인 (1200x630px 권장)
2. 절대 URL 사용 (`https://...`)
3. Facebook Debugger로 캐시 새로고침

### 사이트맵이 생성되지 않을 때
```bash
npm run build
```
빌드 후 `/sitemap.xml` 확인

### 구조화된 데이터 오류
- [Google Rich Results Test](https://search.google.com/test/rich-results)에서 검증
- JSON-LD 문법 확인

---

## 📚 참고 자료

- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search/docs)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

---

## ✨ 완료!

모든 SEO 최적화가 완료되었습니다! 🎉

추가 질문이나 도움이 필요하시면 연락주세요.

