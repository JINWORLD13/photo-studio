# Moment Snap - 스냅사진 전문 포토그래퍼 웹사이트

🌐 **Live Demo**: [https://photo-studio-topaz.vercel.app/](https://photo-studio-topaz.vercel.app/)

감성 스냅 포토그래퍼를 위한 현대적이고 반응형 웹사이트입니다.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-DB-3ecf8e)

---

## 시작하기

상세한 가이드 문서는 프로젝트 로컬 환경에 포함되어 있습니다.

---

## 주요 기능

### 프론트엔드

- **홈페이지**: Hero 섹션, 특징 소개, 포트폴리오 미리보기
- **포트폴리오**: 카테고리별 필터링 가능한 갤러리
- **서비스**: 3가지 패키지 가격표 및 촬영 과정 안내
- **문의 폼**: **로그인 필수** - 안전한 고객 문의 접수
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **다국어 지원**: 한국어/영어/일본어

### 백엔드

- **Supabase 연동**: PostgreSQL 데이터베이스
- **인증 시스템**: Supabase Auth (로그인 필수 문의)
- **관리자 대시보드**: 문의 내역 조회 및 관리
- **Gmail 이메일 알림**: 완전 무료 (하루 500통)
- **파일 업로드**: Supabase Storage
- **보안 강화**: Row Level Security (RLS) 적용

### SEO 최적화

- **메타데이터**: 페이지별 최적화된 title, description, keywords
- **Open Graph**: Facebook/LinkedIn 공유 최적화
- **Twitter Card**: Twitter 공유 최적화
- **구조화된 데이터**: Schema.org JSON-LD (Organization, LocalBusiness, Service)
- **Sitemap**: 자동 생성 XML 사이트맵
- **Robots.txt**: 검색 엔진 크롤링 최적화
- **PWA**: Progressive Web App 지원 (manifest.json)
- **다국어 SEO**: hreflang 태그 및 Canonical URL

---

## 5분 빠른 시작

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
# Windows
Copy-Item env.example .env.local

# Mac/Linux
cp env.example .env.local
```

`.env.local` 파일 수정:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 확인!

---

## 기술 스택

### Frontend

- **Next.js 16.0.1**: React 프레임워크 (App Router) + Turbopack
- **TypeScript**: 타입 안정성
- **Tailwind CSS v4**: 유틸리티 우선 CSS
- **Framer Motion**: 애니메이션
- **Lucide React**: 아이콘

### Backend & Services

- **Supabase**: PostgreSQL 데이터베이스 + 인증 + Storage
- **Gmail API**: 이메일 알림 (완전 무료)

### Deployment

- **Vercel**: 프론트엔드 호스팅 (무료)
- **Supabase**: 백엔드 서버리스 (무료 500MB)

---

## 페이지 목록

| 페이지          | 경로               | 설명                                              |
| --------------- | ------------------ | ------------------------------------------------- |
| 홈              | `/`                | Hero 섹션, 특징, 포트폴리오 미리보기              |
| 포트폴리오      | `/portfolio`       | 작품 갤러리 (카테고리 필터)                       |
| 서비스          | `/services`        | 패키지 가격 및 촬영 과정                          |
| 문의하기        | `/contact`         | **로그인 필수** - 문의 폼 (DB 저장 + 이메일 알림) |
| 로그인          | `/auth`            | 사용자 로그인/회원가입                            |
| 마이페이지      | `/mypage`          | 내 문의 내역 조회                                 |
| 관리자          | `/admin`           | 문의 내역 관리 (관리자 전용)                      |
| 포트폴리오 관리 | `/admin/portfolio` | 작품 업로드 및 관리 (관리자 전용)                 |

---

## 비용 안내

### 무료로 시작 (월 5,000 방문자까지)

| 항목                 | 비용           | 제한            |
| -------------------- | -------------- | --------------- |
| **Vercel 호스팅**    | 무료           | 100GB 대역폭/월 |
| **Supabase DB**      | 무료           | 500MB 데이터    |
| **Supabase Storage** | 무료           | 1GB 파일        |
| **Gmail API**        | 무료           | 500통/일        |
| **도메인**           | 연 12,000원    | 선택사항        |
| **총계**             | **월 1,000원** | -               |

---

## 주요 개념 설명

### Turbopack이란?

**Webpack의 후속작** - Next.js 16에서 기본 사용

- Webpack보다 700배 빠름
- Rust로 작성 (초고속)
- 개발 서버 시작 10초 → 1초
- Hot Reload 2초 → 0.1초

### Unsplash란?

**무료 고품질 이미지 제공 사이트**

- 상업적 사용 가능
- 저작권 걱정 없음
- CDN 제공 (빠른 로딩)
- 개발/테스트용으로 완벽
- 실제 운영 시 Supabase Storage로 교체 권장

### Supabase란?

**Firebase의 오픈소스 대안** - PostgreSQL 기반

- 완전한 SQL 지원
- 무료 500MB (Firebase보다 저렴)
- 인증 + DB + Storage 통합
- Row Level Security (보안 강력)
- 실시간 구독 가능

---

## 배포 가이드

### 빠른 시작 (5분)

배포 가이드 문서는 로컬 프로젝트에 포함되어 있습니다.

### 간단 요약

```bash
# 1. 로컬 빌드 테스트
npm run build

# 2. GitHub에 푸시
git init
git add .
git commit -m "Initial commit"
git push

# 3. Vercel 연동
# https://vercel.com → Sign Up with GitHub → Import Project

# 4. 환경 변수 설정 (Vercel Dashboard)
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# GMAIL_USER
# GMAIL_APP_PASSWORD

# 5. Deploy 버튼 클릭!
```

**무료 플랜으로 충분합니다!** (월 방문자 수천 명까지 무료)

---

## 보안

- **로그인 필수 문의 시스템** (NEW!)
  - 비로그인 사용자는 문의 불가
  - 모든 문의는 user_id와 연결
  - 본인 문의만 조회 가능
- Supabase RLS (Row Level Security) 적용
- 환경 변수로 민감 정보 관리
- 관리자 페이지는 인증 필요
- 이메일 화이트리스트
- 로그인 시도 제한 (5회 실패 시 15분 차단)
- 세션 타임아웃 (15분 비활성 시 자동 로그아웃)

---

## 프로젝트 구조

```
photo-studio/
├── src/
│   ├── app/                      # Next.js App Router (페이지)
│   │   ├── page.tsx             # 홈
│   │   ├── layout.tsx           # 루트 레이아웃 (글로벌 메타데이터)
│   │   ├── sitemap.ts           # 동적 사이트맵
│   │   ├── opengraph-image.tsx  # OG 이미지 생성
│   │   ├── portfolio/
│   │   │   ├── page.tsx         # 포트폴리오
│   │   │   └── layout.tsx       # 포트폴리오 메타데이터
│   │   ├── services/
│   │   │   ├── page.tsx         # 서비스
│   │   │   └── layout.tsx       # 서비스 메타데이터
│   │   ├── contact/
│   │   │   ├── page.tsx         # 문의
│   │   │   └── layout.tsx       # 문의 메타데이터
│   │   ├── auth/page.tsx        # 로그인
│   │   └── admin/               # 관리자
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── StructuredData.tsx   # JSON-LD 스키마
│   ├── config/
│   │   └── business-info.ts     # 비즈니스 정보 (여기만 수정!)
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── seo.ts               # SEO 헬퍼 함수
│   └── locales/                  # 다국어 (한/영/일)
├── public/
│   ├── robots.txt               # 검색 엔진 크롤링 규칙
│   ├── manifest.json            # PWA 설정
│   └── favicon.ico
├── SEO_GUIDE.md                 # SEO 완벽 가이드
└── package.json
```

---

## 빠른 체크리스트

### 개발 환경

- [ ] Node.js 설치 (v18+)
- [ ] `npm install` 실행
- [ ] `.env.local` 파일 생성
- [ ] `npm run dev` 실행 성공

### Supabase 설정

- [ ] Supabase 계정 생성
- [ ] 프로젝트 생성
- [ ] `supabase-setup.sql` 실행
- [ ] **`supabase-rls-login-required.sql` 실행** (NEW!)
- [ ] API Keys 복사
- [ ] 관리자 계정 생성

### 기능 테스트

- [ ] 모든 페이지 로딩 확인
- [ ] 로그인 없이 `/contact` 접근 시 로그인 페이지로 리다이렉트 확인
- [ ] 로그인 후 문의 폼 제출 테스트
- [ ] 마이페이지에서 본인 문의 내역 확인
- [ ] 관리자 로그인 테스트
- [ ] 포트폴리오 업로드 테스트

### SEO 설정 (배포 전 필수!)

- [ ] `src/config/business-info.ts` 실제 정보로 업데이트
- [ ] `src/app/layout.tsx` - `metadataBase` URL 변경
- [ ] `src/app/sitemap.ts` - 도메인 URL 변경
- [ ] `public/robots.txt` - 도메인 URL 변경
- [ ] Open Graph 이미지 추가 (`/public/og-image.jpg`)
- [ ] PWA 아이콘 추가 (`/public/icon-192.png`, `/public/icon-512.png`)
- [ ] Google Search Console 등록 및 사이트맵 제출
- [ ] SEO 테스트: [Google Rich Results Test](https://search.google.com/test/rich-results)

### 배포

- [ ] GitHub에 푸시
- [ ] Vercel 연동
- [ ] 환경 변수 설정
- [ ] 배포 성공 확인
- [ ] `/sitemap.xml` 접근 확인
- [ ] `/robots.txt` 접근 확인

---

## 문제 해결

### Unsplash 이미지가 안 보여요!

**해결:**

```typescript
// next.config.ts 확인
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
  ],
}
```

**서버 재시작 필수:** `npm run dev`

### 로그인 필수 문의 시스템 (NEW!)

문의 페이지 접근 시 로그인이 필요합니다:

**작동 방식:**

1. 비로그인 상태로 `/contact` 접근
2. 자동으로 `/auth?redirect=/contact`로 리다이렉트
3. 로그인/회원가입 후 다시 문의 페이지로 복귀
4. 사용자 정보가 자동으로 채워진 폼으로 문의 작성

**상세 가이드:**

- `LOGIN_REQUIRED_UPDATE.md` - 전체 변경 사항
- `TROUBLESHOOTING.md` - RLS 정책 설정

### 더 많은 문제 해결

로컬 프로젝트의 가이드 문서를 참고하세요.

---

## 지원

문제가 발생하면 공식 문서를 참고하세요:

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)

---

## 라이선스

MIT License - 자유롭게 사용하세요!

---

## 감사의 말

- [Next.js](https://nextjs.org/) - React 프레임워크
- [Supabase](https://supabase.com/) - 백엔드 서비스
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [Framer Motion](https://www.framer.com/motion/) - 애니메이션
- [Unsplash](https://unsplash.com/) - 무료 이미지 제공
- [Vercel](https://vercel.com/) - 무료 호스팅

---

**만든 사람**: 외주 웹 개발 프로젝트  
**버전**: 2.1.0 - 로그인 필수 문의 시스템  
**업데이트**: 2025년 11월 3일

---

## 최신 업데이트 (v2.1.0)

### 로그인 필수 문의 시스템

- 문의 페이지 접근 시 로그인 필수
- 로그인 후 원래 페이지로 자동 복귀
- 사용자 정보 자동 채우기 (이름, 이메일)
- 본인 문의만 조회 가능 (마이페이지)
- RLS 정책 강화
