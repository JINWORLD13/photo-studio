# 🚀 프로젝트 기술 스택 완벽 가이드 (심화편)

> **대상:** React 경험자 (Node.js, SCSS, MongoDB, GCP 사용 경험)  
> **목적:** Next.js, Tailwind CSS, Turbopack, Supabase를 **개념부터 실전까지** 완벽 이해  
> **특징:** 실제 프로젝트에 구현된 모든 기능 포함 (인증, 파일 업로드, 관리자 페이지 등)

---

## 📚 목차

### 🎓 **Part 1: 핵심 개념 이해**

1. [Next.js 14 완벽 이해](#1-nextjs-14-완벽-이해)
2. [Tailwind CSS v4 마스터](#2-tailwind-css-v4-마스터)
3. [Turbopack 동작 원리](#3-turbopack-동작-원리)
4. [Supabase 심화](#4-supabase-심화)
5. [다국어 처리 (i18n) 완전 정복](#5-다국어-처리-i18n-완전-정복)

### 🛠️ **Part 2: 고급 기능 구현**

6. [인증 시스템 (Authentication)](#6-인증-시스템-authentication)
7. [파일 업로드 & Storage](#7-파일-업로드--storage)
8. [관리자 페이지 구현](#8-관리자-페이지-구현)
9. [이메일 발송 시스템](#9-이메일-발송-시스템)
10. [Row Level Security (RLS)](#10-row-level-security-rls)

### 📦 **Part 3: 실전 가이드**

11. [프로젝트 구조 완벽 분석](#11-프로젝트-구조-완벽-분석)
12. [라우팅 시스템 심화](#12-라우팅-시스템-심화)
13. [API Routes 완전 정복](#13-api-routes-완전-정복)
14. [실전 예제 모음](#14-실전-예제-모음)
15. [성능 최적화](#15-성능-최적화)

---

## 1. Next.js 14 (App Router)

### 🤔 React vs Next.js

#### **React (CRA/Vite):**

```javascript
// React는 클라이언트 사이드만
// SEO 약함, 초기 로딩 느림
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### **Next.js 14:**

```typescript
// Next.js는 서버 사이드 렌더링 + 클라이언트
// SEO 강력, 초기 로딩 빠름
// 파일 기반 라우팅 (폴더만 만들면 자동으로 라우트 생성)

// src/app/page.tsx = 홈페이지 (/)
// src/app/about/page.tsx = About 페이지 (/about)
```

---

### 📁 App Router (새로운 방식)

Next.js 13+에서 도입된 **App Router**는 기존 Pages Router를 대체합니다.

#### **기존 Pages Router (구식):**

```
pages/
  index.js       → /
  about.js       → /about
  blog/
    [id].js      → /blog/:id
```

#### **App Router (최신):**

```
app/
  page.tsx       → /
  layout.tsx     → 전체 레이아웃
  about/
    page.tsx     → /about
  blog/
    [id]/
      page.tsx   → /blog/:id
```

---

### 🎯 핵심 개념

#### **1. Server Components vs Client Components**

**Server Component (기본):**

```typescript
// app/page.tsx
// 'use client' 없으면 서버 컴포넌트

export default async function HomePage() {
  // 서버에서 데이터 가져오기 (빠름!)
  const data = await fetch("https://api.example.com/data");

  return <div>{data.title}</div>;
}

// 장점:
// - 빠른 초기 로딩
// - SEO 최적화
// - 데이터베이스 직접 접근 가능
// 단점:
// - useState, useEffect 사용 불가
// - onClick 같은 이벤트 핸들러 사용 불가
```

**Client Component:**

```typescript
"use client"; // ← 이거 추가하면 클라이언트 컴포넌트

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}

// 장점:
// - useState, useEffect 사용 가능
// - 이벤트 핸들러 사용 가능
// - 브라우저 API 사용 가능
// 단점:
// - 초기 로딩 느림
// - JavaScript 번들 크기 증가
```

---

#### **2. layout.tsx (레이아웃)**

```typescript
// app/layout.tsx
// 모든 페이지에 공통 적용되는 레이아웃

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Navbar /> {/* 모든 페이지에 표시 */}
        {children} {/* 각 페이지 내용 */}
        <Footer /> {/* 모든 페이지에 표시 */}
      </body>
    </html>
  );
}
```

**중첩 레이아웃:**

```typescript
// app/admin/layout.tsx
// /admin 하위 페이지에만 적용

export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminSidebar />
      {children}
    </div>
  );
}
```

---

#### **3. page.tsx (페이지)**

```typescript
// app/contact/page.tsx
// /contact 경로의 페이지

export default function ContactPage() {
  return <div>Contact Us</div>;
}
```

---

#### **4. loading.tsx (로딩 상태)**

```typescript
// app/loading.tsx
// 페이지 로딩 중 자동으로 표시

export default function Loading() {
  return <div>Loading...</div>;
}
```

---

#### **5. error.tsx (에러 처리)**

```typescript
"use client"; // 에러는 클라이언트에서만

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>에러 발생!</h2>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  );
}
```

---

### 🔗 Link vs Router

```typescript
// 1. Link 컴포넌트 (권장)
import Link from "next/link";

<Link href="/about">About 페이지로</Link>;

// 2. useRouter (프로그래밍 방식)
("use client");
import { useRouter } from "next/navigation";

function MyComponent() {
  const router = useRouter();

  const goToAbout = () => {
    router.push("/about");
  };

  return <button onClick={goToAbout}>Go to About</button>;
}
```

---

### 📸 이미지 최적화

```typescript
import Image from 'next/image';

// 일반 <img> (나쁨)
<img src="/photo.jpg" alt="Photo" />

// Next.js Image (좋음!)
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  priority  // 우선 로드
/>

// 장점:
// - 자동 최적화 (WebP 변환)
// - Lazy loading
// - 반응형 이미지
```

---

## 2. Tailwind CSS v4

### 🎨 SCSS vs Tailwind CSS

#### **SCSS (기존 방식):**

```scss
// styles.scss
.button {
  padding: 1rem 2rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.5rem;

  &:hover {
    background-color: #2563eb;
  }
}
```

```jsx
<button className="button">Click me</button>
```

#### **Tailwind CSS (유틸리티 클래스):**

```jsx
<button className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
  Click me
</button>

// 장점:
// - CSS 파일 불필요
// - 빠른 개발 속도
// - 일관된 디자인
// - 작은 번들 크기 (사용하지 않는 클래스 자동 제거)

// 단점:
// - 클래스 이름이 길어짐
// - 처음엔 익숙하지 않음
```

---

### 📖 Tailwind CSS 문법

#### **레이아웃:**

```jsx
// Flexbox
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

// Grid
<div className="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

// 반응형
<div className="
  w-full           // 모바일: 100% 너비
  md:w-1/2         // 태블릿: 50% 너비
  lg:w-1/3         // 데스크톱: 33% 너비
">
  Responsive Box
</div>
```

#### **색상:**

```jsx
<div
  className="
  bg-stone-100     // 배경색
  text-stone-900   // 텍스트 색
  border-stone-200 // 테두리 색
"
>
  Content
</div>
```

#### **간격 (Spacing):**

```jsx
// 패딩: p-{size}
<div className="p-4">       // 전체 padding: 1rem (16px)
<div className="px-4 py-2"> // x축: 1rem, y축: 0.5rem
<div className="pt-4">      // top만

// 마진: m-{size}
<div className="m-4">       // 전체 margin
<div className="mx-auto">   // 가운데 정렬
```

#### **타이포그래피:**

```jsx
<h1
  className="
  text-4xl        // 크기
  font-bold       // 굵기
  text-center     // 정렬
  leading-tight   // 줄 간격
"
>
  Heading
</h1>
```

#### **호버 효과:**

```jsx
<button
  className="
  bg-blue-500
  hover:bg-blue-600    // 호버 시 색상 변경
  transition-colors    // 부드러운 전환
"
>
  Hover me
</button>
```

---

### 🆕 Tailwind CSS v4 차이점

```css
/* v3 (이전) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 (최신) */
@import "tailwindcss";

/* v4에서 변경된 점: */
/* 1. @apply 사용 불가 (직접 CSS 작성) */
/* 2. @theme inline 사용 */
/* 3. 더 빠른 빌드 속도 */
```

---

## 3. Turbopack

### ⚡ Webpack vs Turbopack

#### **Webpack (기존):**

```bash
npm run dev
# 시작까지 5-10초 걸림
# 파일 수정 후 반영까지 1-2초
```

#### **Turbopack (최신):**

```bash
npm run dev
# 시작까지 1초 미만
# 파일 수정 후 즉시 반영 (0.1초)
```

### 🔥 Turbopack 특징

- **Rust로 작성** (Node.js보다 10배 빠름)
- **증분 빌드** (변경된 부분만 다시 빌드)
- **자동 활성화** (Next.js 14에서 기본)

```javascript
// package.json
{
  "scripts": {
    "dev": "next dev --turbo"  // ← Turbopack 활성화
  }
}
```

---

## 4. Supabase

### 🗄️ MongoDB vs Supabase

#### **MongoDB (NoSQL):**

```javascript
// MongoDB (기존)
const db = require("mongoose");

const User = new mongoose.Schema({
  name: String,
  email: String,
});

// 데이터 저장
await User.create({ name: "John", email: "john@example.com" });
```

#### **Supabase (PostgreSQL + API):**

```typescript
// Supabase (SQL 기반 + 자동 API)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 테이블 생성 (SQL)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT
);

// 데이터 저장 (JavaScript)
const { data, error } = await supabase
  .from('users')
  .insert({ name: 'John', email: 'john@example.com' });
```

---

### 🎯 Supabase 핵심 기능

#### **1. 데이터베이스 (PostgreSQL)**

```typescript
// 데이터 가져오기
const { data, error } = await supabase
  .from("contacts")
  .select("*")
  .order("created_at", { ascending: false });

// 데이터 삽입
const { data, error } = await supabase
  .from("contacts")
  .insert([{ name: "John", email: "john@example.com" }]);

// 데이터 업데이트
const { data, error } = await supabase
  .from("contacts")
  .update({ name: "Jane" })
  .eq("id", "123");

// 데이터 삭제
const { data, error } = await supabase
  .from("contacts")
  .delete()
  .eq("id", "123");
```

#### **2. 인증 (Authentication)**

```typescript
// 회원가입
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password123",
});

// 로그인
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123",
});

// 로그아웃
await supabase.auth.signOut();

// 현재 사용자 확인
const {
  data: { user },
} = await supabase.auth.getUser();
```

#### **3. 실시간 구독**

```typescript
// 실시간 데이터 변경 감지
const channel = supabase
  .channel("contacts-changes")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "contacts" },
    (payload) => {
      console.log("새 문의:", payload.new);
    }
  )
  .subscribe();
```

---

### 📦 Supabase 설정

```typescript
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// 타입 정의
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
}
```

---

## 5. 다국어 처리 (i18n)

### 🌍 다국어 구현 방법

#### **방법 1: next-intl (라이브러리 사용)**

```bash
npm install next-intl
```

**장점:** 강력한 기능, URL 기반 라우팅  
**단점:** 복잡한 설정, 프로젝트 구조 변경 필요

#### **방법 2: 커스텀 Hook (우리 프로젝트)**

```bash
# 추가 설치 불필요
```

**장점:** 간단, 빠름, 유연함  
**단점:** 직접 구현 필요

---

### 🎯 우리 프로젝트의 다국어 시스템

#### **1. 번역 파일 구조**

```
src/locales/
  ko/
    common.json      # 한국어 번역
  en/
    common.json      # 영어 번역
  ja/
    common.json      # 일본어 번역
```

#### **2. 번역 파일 내용**

```json
// src/locales/ko/common.json
{
  "nav": {
    "home": "홈",
    "portfolio": "포트폴리오",
    "services": "서비스",
    "contact": "문의하기"
  },
  "home": {
    "hero": {
      "title": "당신의 순간을 영원히",
      "subtitle": "일상의 특별함을 담는 감성 스냅 포토그래퍼"
    }
  }
}
```

#### **3. 커스텀 Hook**

```typescript
// src/hooks/useTranslation.ts
"use client";

import { useState, useEffect } from "react";

type Locale = "ko" | "en" | "ja";

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>("ko");
  const [messages, setMessages] = useState<any>({});

  useEffect(() => {
    // localStorage에서 언어 불러오기
    const savedLang = localStorage.getItem("language") as Locale;
    const currentLang = savedLang || "ko";

    setLocale(currentLang);

    // 번역 파일 동적 로드
    import(`../locales/${currentLang}/common.json`).then((module) =>
      setMessages(module.default)
    );
  }, []);

  // 번역 키로 텍스트 가져오기
  const t = (key: string) => {
    const keys = key.split("."); // 'nav.home' → ['nav', 'home']
    let value: any = messages;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }

    return value || key;
  };

  return { t, locale };
}
```

#### **4. 사용 방법**

```typescript
"use client";

import { useTranslation } from "@/hooks/useTranslation";

export default function Navbar() {
  const { t } = useTranslation();

  return (
    <nav>
      <Link href="/">{t("nav.home")}</Link>
      <Link href="/portfolio">{t("nav.portfolio")}</Link>
      <Link href="/services">{t("nav.services")}</Link>
      <Link href="/contact">{t("nav.contact")}</Link>
    </nav>
  );
}
```

#### **5. 언어 전환 컴포넌트**

```typescript
"use client";

import { useState } from "react";

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("ko");

  const changeLanguage = (lang: string) => {
    localStorage.setItem("language", lang);
    setCurrentLang(lang);
    window.location.reload(); // 페이지 새로고침
  };

  return (
    <div>
      <button onClick={() => changeLanguage("ko")}>🇰🇷 한국어</button>
      <button onClick={() => changeLanguage("en")}>🇺🇸 English</button>
      <button onClick={() => changeLanguage("ja")}>🇯🇵 日本語</button>
    </div>
  );
}
```

---

## 6. 주요 라이브러리

### 📦 설치된 패키지

```json
{
  "dependencies": {
    // 핵심
    "next": "16.0.1", // Next.js 프레임워크
    "react": "19.0.0", // React
    "react-dom": "19.0.0", // React DOM

    // 스타일링
    "tailwindcss": "^4.0.0", // CSS 프레임워크

    // 데이터베이스 & 인증
    "@supabase/supabase-js": "^2.47.10", // Supabase 클라이언트

    // 이메일
    "nodemailer": "^6.9.16", // 이메일 발송

    // 애니메이션 & UI
    "framer-motion": "^11.13.5", // 애니메이션
    "lucide-react": "^0.462.0" // 아이콘
  }
}
```

---

### 🎭 Framer Motion (애니메이션)

```typescript
import { motion } from 'framer-motion';

// 기본 애니메이션
<motion.div
  initial={{ opacity: 0, y: 20 }}     // 초기 상태
  animate={{ opacity: 1, y: 0 }}      // 애니메이션 후
  transition={{ duration: 0.6 }}      // 지속 시간
>
  내용
</motion.div>

// 스크롤 시 애니메이션
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}        // 화면에 보이면
  viewport={{ once: true }}           // 한 번만 실행
>
  내용
</motion.div>

// 호버 애니메이션
<motion.button
  whileHover={{ scale: 1.05 }}        // 호버 시 확대
  whileTap={{ scale: 0.95 }}          // 클릭 시 축소
>
  버튼
</motion.button>
```

---

### 🎨 Lucide React (아이콘)

```typescript
import { Mail, Phone, Camera, Menu, X } from 'lucide-react';

// 기본 사용
<Mail className="w-6 h-6 text-blue-500" />

// 크기 조절
<Camera className="w-8 h-8" />  // 8 = 32px

// 색상
<Phone className="text-red-500" />

// 전체 아이콘 목록: https://lucide.dev/icons
```

---

## 7. 프로젝트 구조

```
photo-studio/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # 전체 레이아웃
│   │   ├── page.tsx             # 홈 페이지 (/)
│   │   ├── globals.css          # 전역 스타일
│   │   ├── portfolio/
│   │   │   └── page.tsx         # /portfolio
│   │   ├── services/
│   │   │   └── page.tsx         # /services
│   │   ├── contact/
│   │   │   └── page.tsx         # /contact
│   │   ├── login/
│   │   │   └── page.tsx         # /login
│   │   ├── admin/
│   │   │   └── page.tsx         # /admin
│   │   └── api/                 # API 라우트
│   │       └── send-email/
│   │           └── route.ts     # POST /api/send-email
│   │
│   ├── components/              # 재사용 컴포넌트
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── LanguageSwitcher.tsx
│   │
│   ├── lib/                     # 유틸리티
│   │   └── supabase.ts          # Supabase 클라이언트
│   │
│   ├── hooks/                   # 커스텀 Hooks
│   │   └── useTranslation.ts    # 다국어 Hook
│   │
│   ├── locales/                 # 번역 파일
│   │   ├── ko/common.json
│   │   ├── en/common.json
│   │   └── ja/common.json
│   │
│   └── config/                  # 설정 파일
│       └── business-info.ts     # 비즈니스 정보
│
├── public/                      # 정적 파일
│   └── images/
│
├── .env.local                   # 환경 변수 (비밀!)
├── package.json
├── tsconfig.json               # TypeScript 설정
├── tailwind.config.ts          # Tailwind 설정
└── next.config.ts              # Next.js 설정
```

---

## 8. 라우팅 시스템

### 📂 파일 기반 라우팅

```
app/
├── page.tsx                    → /
├── about/
│   └── page.tsx               → /about
├── blog/
│   ├── page.tsx               → /blog
│   └── [id]/
│       └── page.tsx           → /blog/123
└── shop/
    └── [category]/
        └── [product]/
            └── page.tsx       → /shop/clothes/shirt
```

---

### 🎯 동적 라우트

```typescript
// app/blog/[id]/page.tsx

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { id } = await params;

  return <div>Blog Post ID: {id}</div>;
}

// /blog/123 → id = "123"
// /blog/456 → id = "456"
```

---

### 🔗 네비게이션

```typescript
import Link from "next/link";
import { useRouter } from "next/navigation";

function MyComponent() {
  const router = useRouter();

  return (
    <>
      {/* Link 컴포넌트 (권장) */}
      <Link href="/about">About</Link>

      {/* 프로그래밍 방식 */}
      <button onClick={() => router.push("/about")}>Go to About</button>

      {/* 뒤로가기 */}
      <button onClick={() => router.back()}>뒤로가기</button>

      {/* 쿼리 파라미터 */}
      <Link href="/search?q=nextjs">Search</Link>
    </>
  );
}
```

---

## 9. API Routes

### 🔌 서버리스 API

Next.js에서는 **API Routes**를 사용하여 백엔드 없이 API를 만들 수 있습니다.

```typescript
// app/api/hello/route.ts

export async function GET(request: Request) {
  return Response.json({ message: "Hello World" });
}

export async function POST(request: Request) {
  const body = await request.json();

  return Response.json({
    message: "Received",
    data: body,
  });
}
```

**호출:**

```typescript
// 클라이언트에서
const response = await fetch("/api/hello");
const data = await response.json();
```

---

### 📧 이메일 API 예제 (우리 프로젝트)

```typescript
// app/api/send-email/route.ts

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Gmail SMTP 설정
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 이메일 발송
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `[문의] ${name}`,
      html: `
        <h2>새 문의</h2>
        <p><strong>이름:</strong> ${name}</p>
        <p><strong>이메일:</strong> ${email}</p>
        <p><strong>내용:</strong> ${message}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "이메일 발송 완료",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "이메일 발송 실패" },
      { status: 500 }
    );
  }
}
```

**호출:**

```typescript
const response = await fetch("/api/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "홍길동",
    email: "hong@example.com",
    message: "문의 내용",
  }),
});
```

---

## 10. 실전 예제

### 🎯 문의 폼 전체 구현

```typescript
// app/contact/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Mail, Send } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Supabase에 저장
      const { error: dbError } = await supabase
        .from("contacts")
        .insert([formData]);

      if (dbError) throw dbError;

      // 2. 이메일 발송
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // 3. 성공 처리
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("전송 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 bg-stone-50">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-center mb-8">
            {t("contact.title")}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("contact.form.name")}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("contact.form.email")}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("contact.form.message")}
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    message: e.target.value,
                  })
                }
                required
                rows={6}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                t("contact.form.submitting")
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t("contact.form.submit")}
                </>
              )}
            </button>
          </form>

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg"
            >
              {t("contact.form.success")}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
```

---

## 📚 학습 순서 추천

1. **Next.js 기본** (1-2일)

   - App Router 이해
   - Server/Client Component 차이
   - 라우팅 시스템

2. **Tailwind CSS** (1일)

   - 기본 클래스 익히기
   - 반응형 디자인
   - 호버/애니메이션

3. **Supabase** (1-2일)

   - 테이블 생성
   - 데이터 CRUD
   - 인증 구현

4. **다국어** (1일)

   - 번역 파일 작성
   - useTranslation 사용
   - 언어 전환

5. **API Routes** (1일)
   - 기본 API 생성
   - 이메일 발송
   - 에러 처리

---

## 🔗 유용한 리소스

- **Next.js 공식 문서:** https://nextjs.org/docs
- **Tailwind CSS 문서:** https://tailwindcss.com/docs
- **Supabase 문서:** https://supabase.com/docs
- **Framer Motion:** https://www.framer.com/motion
- **Lucide Icons:** https://lucide.dev

---

## 💡 꿀팁

### 1. **개발 중 자동 새로고침 안 되면:**

```bash
# Ctrl + C로 서버 종료 후
npm run dev
```

### 2. **Tailwind CSS 클래스 자동 완성:**

```bash
# VS Code 확장 설치
Tailwind CSS IntelliSense
```

### 3. **환경 변수 읽기:**

```typescript
// 클라이언트에서 접근 가능
process.env.NEXT_PUBLIC_SUPABASE_URL;

// 서버에서만 접근 가능
process.env.GMAIL_APP_PASSWORD;
```

### 4. **타입스크립트 에러 무시 (임시):**

```typescript
// @ts-ignore
const value = someFunction();
```

### 5. **빠른 디버깅:**

```typescript
console.log("디버깅:", data);
```

---

이 가이드로 프로젝트의 모든 기술을 이해할 수 있을 것입니다! 🚀

궁금한 점이 있으면 언제든 물어보세요! 😊
