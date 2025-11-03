# 🎓 프로젝트 기술 스택 심화 가이드

> **완전 초보를 위한 개념부터 실전까지**  
> React 경험자가 Next.js 14 전문가가 되는 완벽한 가이드

---

## 📖 이 가이드의 특징

- ✅ **개념 중심 설명**: "왜 이렇게 작동하는가?"
- ✅ **React와 비교**: 기존 지식을 활용한 학습
- ✅ **실전 예제**: 실제 프로젝트에서 사용한 모든 코드
- ✅ **추가 기능 포함**: 인증, 파일 업로드, 관리자 페이지 등

---

# Part 1: 핵심 개념 완벽 이해

## 1. Next.js 14 완벽 이해

### 🧠 핵심 개념: SSR vs CSR

#### **CSR (Client Side Rendering) - React의 기본 방식**

```
사용자 접속
    ↓
빈 HTML 다운로드 (index.html에는 <div id="root"></div>만 있음)
    ↓
JavaScript 다운로드 (수 MB)
    ↓
JavaScript 실행
    ↓
React 앱 렌더링
    ↓
데이터 가져오기 (API 호출)
    ↓
화면에 내용 표시
    
⏱️ 총 시간: 3-5초
🤖 SEO: 검색 엔진이 빈 페이지만 봄
```

**문제점:**
1. 초기 로딩이 느림
2. SEO가 약함 (구글 검색 노출 안 됨)
3. JavaScript 비활성화 시 아무것도 안 보임

#### **SSR (Server Side Rendering) - Next.js의 기본 방식**

```
사용자 접속
    ↓
서버에서 완성된 HTML 생성
    ↓
완성된 HTML 다운로드 (이미 내용이 있음!)
    ↓
화면에 즉시 표시 (읽을 수 있음)
    ↓
JavaScript 다운로드 (백그라운드)
    ↓
Hydration (인터랙션 활성화)
    ↓
완전한 React 앱으로 작동

⏱️ 총 시간: 0.5-1초 (첫 화면 표시)
🤖 SEO: 검색 엔진이 완전한 HTML을 봄
```

**장점:**
1. 초기 로딩이 빠름
2. SEO 최적화
3. JavaScript 없어도 내용 보임

---

### 🎯 Server Components의 혁명

#### **기존 방식 (모든 컴포넌트가 클라이언트에서 실행):**

```typescript
// React (Vite/CRA)
import { useState, useEffect } from 'react';

function BlogPost({ id }) {
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    // 브라우저에서 API 호출
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data));
  }, [id]);
  
  if (!post) return <div>Loading...</div>;
  
  return <div>{post.title}</div>;
}

// 문제점:
// 1. 로딩 화면이 보임
// 2. API 키가 브라우저에 노출될 수 있음
// 3. 데이터베이스 직접 접근 불가
// 4. JavaScript 번들 크기 증가
```

#### **Next.js 방식 (Server Component):**

```typescript
// Next.js 14
// 'use client' 없으면 자동으로 서버 컴포넌트

async function BlogPost({ id }: { id: string }) {
  // 서버에서 직접 데이터 가져오기
  const post = await fetch(`https://api.example.com/posts/${id}`);
  const data = await post.json();
  
  // 또는 데이터베이스 직접 접근
  // const post = await supabase.from('posts').select('*').eq('id', id);
  
  return <div>{data.title}</div>;
}

// 장점:
// 1. 로딩 화면 없음 (서버에서 이미 렌더링됨)
// 2. API 키가 서버에만 존재 (안전!)
// 3. 데이터베이스 직접 접근 가능
// 4. JavaScript 번들 크기 감소 (이 컴포넌트는 브라우저로 안 감)
```

---

### 📐 Server vs Client Components 완벽 비교

| 특징 | Server Component | Client Component |
|------|------------------|------------------|
| **선언** | 기본값 (아무것도 안 써도 됨) | `'use client'` 필수 |
| **실행 위치** | 서버 | 브라우저 |
| **useState** | ❌ 사용 불가 | ✅ 사용 가능 |
| **useEffect** | ❌ 사용 불가 | ✅ 사용 가능 |
| **onClick** | ❌ 사용 불가 | ✅ 사용 가능 |
| **async/await** | ✅ 사용 가능 | ❌ 컴포넌트 자체는 불가* |
| **DB 접근** | ✅ 직접 가능 | ❌ API 통해서만 |
| **환경 변수** | ✅ 모든 변수 | ⚠️ NEXT_PUBLIC_만 |
| **SEO** | ✅ 완벽 | ⚠️ 일부만 |
| **번들 크기** | 0KB (서버에만 있음) | 브라우저로 전송됨 |

*useEffect 안에서는 가능

---

### 🏗️ App Router 구조 이해

#### **1. layout.tsx - 레이아웃의 중첩**

```typescript
// app/layout.tsx (루트 레이아웃)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GlobalNav />     {/* 모든 페이지에 표시 */}
        {children}        {/* 하위 페이지/레이아웃 */}
        <GlobalFooter />  {/* 모든 페이지에 표시 */}
      </body>
    </html>
  );
}

// app/admin/layout.tsx (관리자 레이아웃)
export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <AdminSidebar />   {/* /admin 하위에만 표시 */}
      <main>{children}</main>
    </div>
  );
}

// app/admin/portfolio/page.tsx
// 실제 렌더링 결과:
// <html>
//   <body>
//     <GlobalNav />
//     <div className="flex">
//       <AdminSidebar />
//       <main>
//         {/* 포트폴리오 페이지 내용 */}
//       </main>
//     </div>
//     <GlobalFooter />
//   </body>
// </html>
```

**개념:**
- 레이아웃은 **중첩**됩니다
- 각 폴더는 **자신의 레이아웃**을 가질 수 있습니다
- 하위 페이지는 **모든 상위 레이아웃**을 상속받습니다

---

#### **2. loading.tsx - 스트리밍**

```typescript
// app/blog/loading.tsx
export default function Loading() {
  return <div>Loading blog posts...</div>;
}

// app/blog/page.tsx
async function BlogPage() {
  const posts = await fetch('https://slow-api.com/posts');
  return <PostList posts={posts} />;
}
```

**작동 원리:**
```
사용자가 /blog 접속
    ↓
즉시 loading.tsx 표시 ("Loading blog posts...")
    ↓
백그라운드에서 page.tsx 렌더링
    ↓
데이터 가져오기 완료
    ↓
loading.tsx를 page.tsx로 교체 (부드러운 전환)
```

**React Suspense와의 관계:**
```typescript
// Next.js가 자동으로 이렇게 변환:
<Suspense fallback={<Loading />}>
  <BlogPage />
</Suspense>
```

---

#### **3. error.tsx - 에러 경계**

```typescript
// app/blog/error.tsx
'use client'; // Error는 반드시 클라이언트 컴포넌트

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>문제가 발생했습니다!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

**작동 원리:**
```
page.tsx에서 에러 발생
    ↓
Next.js가 자동으로 error.tsx로 대체
    ↓
reset() 호출 시 page.tsx 다시 렌더링 시도
```

---

### 🔄 Data Fetching 완벽 가이드

#### **방법 1: Server Component에서 직접 가져오기 (권장)**

```typescript
// app/posts/page.tsx
async function PostsPage() {
  // 1. fetch API 사용
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache',  // 캐시 사용 (기본값)
    // cache: 'no-store',   // 매번 새로 가져오기
    // next: { revalidate: 60 } // 60초마다 재검증
  });
  const posts = await res.json();
  
  // 2. 데이터베이스 직접 접근
  const { data } = await supabase
    .from('posts')
    .select('*');
  
  return <PostList posts={posts} />;
}
```

**장점:**
- 서버에서 미리 렌더링됨 (빠름!)
- SEO 최적화
- 로딩 화면 불필요

---

#### **방법 2: Client Component에서 가져오기**

```typescript
'use client';

import { useState, useEffect } from 'react';

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('https://api.example.com/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return <PostList posts={posts} />;
}
```

**사용 시기:**
- 사용자 상호작용이 필요할 때
- 실시간 업데이트가 필요할 때
- 폼 제출, 버튼 클릭 후 데이터 로드

---

## 2. Tailwind CSS v4 마스터

### 🎨 왜 Tailwind인가?

#### **SCSS의 문제점:**

```scss
// styles.scss
.card {
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  
  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  &__content {
    color: #666;
    line-height: 1.6;
  }
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
}

// 문제점:
// 1. 클래스 이름 고민 필요
// 2. CSS 파일 크기 계속 증가
// 3. 사용하지 않는 스타일도 번들에 포함
// 4. 다른 컴포넌트에 영향 줄 수 있음
```

#### **Tailwind의 해결책:**

```jsx
<div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
  <p className="text-gray-600 leading-relaxed">Content</p>
</div>

// 장점:
// 1. 클래스 이름 고민 불필요
// 2. 사용한 클래스만 번들에 포함 (PurgeCSS)
// 3. 일관된 디자인 시스템
// 4. 컴포넌트 단위로 독립적
```

---

### 🧮 Tailwind 크기 시스템 이해

```
숫자 단위 = 0.25rem = 4px

p-1  = padding: 0.25rem  (4px)
p-2  = padding: 0.5rem   (8px)
p-3  = padding: 0.75rem  (12px)
p-4  = padding: 1rem     (16px)  ← 가장 많이 사용
p-5  = padding: 1.25rem  (20px)
p-6  = padding: 1.5rem   (24px)
p-8  = padding: 2rem     (32px)
p-12 = padding: 3rem     (48px)
p-16 = padding: 4rem     (64px)

// 방향별
px-4 = padding-left: 1rem; padding-right: 1rem;
py-2 = padding-top: 0.5rem; padding-bottom: 0.5rem;
pt-4 = padding-top: 1rem;
pr-2 = padding-right: 0.5rem;
pb-3 = padding-bottom: 0.75rem;
pl-1 = padding-left: 0.25rem;

// Margin도 동일
m-4, mx-2, my-3, mt-1, mr-2, mb-3, ml-4
```

---

### 🎨 색상 시스템

```
// Tailwind 색상 팔레트
stone-50   // 가장 밝음 (거의 흰색)
stone-100
stone-200
stone-300
stone-400
stone-500  // 중간
stone-600
stone-700
stone-800
stone-900  // 가장 어두움 (거의 검정)

// 사용 예시
bg-stone-100   // 배경: 아주 연한 회색
text-stone-900 // 텍스트: 거의 검정
border-stone-200 // 테두리: 연한 회색
```

---

### 📱 반응형 디자인 마스터

```jsx
// 모바일 First 접근
<div className="
  w-full        // 기본(모바일): 100% 너비
  md:w-1/2      // 태블릿(768px+): 50% 너비
  lg:w-1/3      // 데스크톱(1024px+): 33% 너비
  xl:w-1/4      // 큰 화면(1280px+): 25% 너비
">
  Content
</div>

// Breakpoints:
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

**실전 예제:**
```jsx
// 모바일: 세로 스택, 태블릿+: 가로 배치
<div className="
  flex 
  flex-col        // 모바일: 세로
  md:flex-row     // 태블릿+: 가로
  gap-4
">
  <div className="w-full md:w-1/2">Left</div>
  <div className="w-full md:w-1/2">Right</div>
</div>
```

---

### ⚡ 상호작용 유틸리티

```jsx
// Hover
<button className="
  bg-blue-500 
  hover:bg-blue-600     // 호버 시 색상 변경
  hover:scale-105       // 호버 시 약간 확대
  transition-all        // 부드러운 전환
  duration-300          // 0.3초 동안
">
  Hover me
</button>

// Focus (폼 요소)
<input className="
  border 
  border-gray-300
  focus:border-blue-500   // 포커스 시 테두리 색 변경
  focus:ring-2            // 포커스 링 추가
  focus:ring-blue-500     // 링 색상
  outline-none            // 기본 아웃라인 제거
" />

// Active (클릭 중)
<button className="
  bg-blue-500
  active:bg-blue-700      // 클릭 중 색상
  active:scale-95         // 클릭 중 약간 축소
">
  Click me
</button>

// Disabled
<button 
  disabled
  className="
    bg-gray-500
    disabled:opacity-50      // 비활성 시 투명도
    disabled:cursor-not-allowed  // 커서 변경
  "
>
  Disabled
</button>
```

---

### 🎭 Tailwind v4 주요 변경사항

#### **변경 1: Import 방식**

```css
/* v3 (이전) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 (최신) */
@import "tailwindcss";
```

#### **변경 2: @apply 제거**

```css
/* v3 (가능) */
.button {
  @apply px-4 py-2 bg-blue-500 text-white rounded;
}

/* v4 (불가능 - 직접 CSS 작성) */
.button {
  padding: 1rem 0.5rem;
  background-color: rgb(59 130 246);
  color: white;
  border-radius: 0.25rem;
}
```

#### **변경 3: @theme 사용**

```css
/* globals.css */
@import "tailwindcss";

@theme inline {
  --color-primary: #3b82f6;
  --color-secondary: #6366f1;
  --font-sans: system-ui, sans-serif;
}

/* 이제 사용 가능 */
.my-class {
  color: var(--color-primary);
}
```

---

## 3. Turbopack 동작 원리

### ⚡ Webpack의 한계

#### **Webpack의 문제:**

```
프로젝트 구조:
src/
  ├── App.tsx (imports 50 components)
  ├── components/ (50개 파일)
  └── utils/ (20개 파일)

Webpack 빌드 과정:
1. 모든 파일 읽기 (70개)
2. 의존성 그래프 생성
3. 모든 파일 변환 (TypeScript → JavaScript)
4. 번들링
5. 최적화

⏱️ 초기 시작: 8-15초
⏱️ 파일 수정 후 반영: 2-3초
```

---

#### **Turbopack의 해결책:**

```
1. Rust로 작성 (Node.js보다 10-20배 빠름)
2. 증분 빌드 (변경된 부분만 다시 빌드)
3. 병렬 처리 (모든 CPU 코어 활용)

Turbopack 빌드 과정:
1. 변경된 파일만 감지
2. 해당 파일과 의존하는 파일만 다시 변환
3. 캐시 최대 활용

⏱️ 초기 시작: 1-2초
⏱️ 파일 수정 후 반영: 0.1초 (즉시!)
```

---

### 🔍 Turbopack 캐싱 시스템

```
첫 빌드:
src/App.tsx ────> [Turbopack] ────> 캐시 저장
                                    
                                    dist/App.js

두 번째 빌드 (App.tsx 변경 없음):
src/App.tsx ────> [캐시 확인] ────> 캐시에서 불러옴 ✨
                                    (변환 안 함!)

두 번째 빌드 (App.tsx 변경됨):
src/App.tsx ────> [변경 감지] ────> 다시 변환
                                    캐시 업데이트
```

---

## 4. Supabase 심화

### 🧠 PostgreSQL vs MongoDB 개념 비교

#### **MongoDB (NoSQL) - 기존 경험**

```javascript
// 스키마 없음 (유연함)
db.users.insertOne({
  name: "John",
  email: "john@example.com",
  age: 25,
  hobbies: ["reading", "gaming"]  // 배열 가능
});

// 다른 구조도 OK
db.users.insertOne({
  name: "Jane",
  country: "Korea",  // 다른 필드여도 OK
  nickname: "JJ"
});
```

#### **PostgreSQL (SQL) - Supabase 사용**

```sql
-- 스키마 필수 (엄격함)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 정확히 정의된 필드만 가능
INSERT INTO users (name, email, age)
VALUES ('John', 'john@example.com', 25);

-- 정의되지 않은 필드는 에러
INSERT INTO users (name, email, nickname)  -- 에러!
VALUES ('Jane', 'jane@example.com', 'JJ');
```

**장단점:**

| 특징 | MongoDB | PostgreSQL |
|------|---------|------------|
| **스키마** | 자유로움 | 엄격함 |
| **데이터 정합성** | 낮음 | 높음 |
| **복잡한 쿼리** | 어려움 | 쉬움 |
| **JOIN** | 불편함 | 강력함 |
| **트랜잭션** | 제한적 | 완벽 |
| **학습 난이도** | 쉬움 | 중간 |

---

### 🔐 Supabase의 핵심 기능

#### **1. 자동 API 생성**

```sql
-- 테이블 생성
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Supabase가 자동으로 생성하는 API:
-- GET    /rest/v1/posts          (모든 게시물)
-- GET    /rest/v1/posts?id=eq.123 (특정 게시물)
-- POST   /rest/v1/posts          (게시물 생성)
-- PATCH  /rest/v1/posts?id=eq.123 (수정)
-- DELETE /rest/v1/posts?id=eq.123 (삭제)
```

**JavaScript에서 사용:**
```typescript
// 직접 API 호출 불필요!
const { data } = await supabase
  .from('posts')
  .select('*');  // ← Supabase가 알아서 API 호출
```

---

#### **2. 실시간 Subscriptions**

```typescript
// MongoDB Change Streams와 유사하지만 더 쉬움
const channel = supabase
  .channel('posts-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',      // 새 데이터 추가 시
      schema: 'public',
      table: 'posts'
    },
    (payload) => {
      console.log('새 게시물:', payload.new);
      // UI 자동 업데이트
    }
  )
  .subscribe();

// 구독 해제
channel.unsubscribe();
```

**실전 예제: 실시간 채팅**
```typescript
function Chat() {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // 기존 메시지 로드
    loadMessages();
    
    // 실시간 구독
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', table: 'messages' },
        (payload) => {
          // 새 메시지 자동 추가
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();
    
    return () => channel.unsubscribe();
  }, []);
  
  return <MessageList messages={messages} />;
}
```

---

#### **3. Storage (파일 업로드)**

```typescript
// 1. 파일 업로드
const file = event.target.files[0];

const { data, error } = await supabase.storage
  .from('portfolio-images')        // 버킷 이름
  .upload(`public/${file.name}`, file, {
    cacheControl: '3600',
    upsert: false                  // 중복 파일 덮어쓰기 여부
  });

// 2. 파일 URL 가져오기
const { data: urlData } = supabase.storage
  .from('portfolio-images')
  .getPublicUrl(`public/${file.name}`);

console.log(urlData.publicUrl);
// https://xxx.supabase.co/storage/v1/object/public/portfolio-images/public/image.jpg

// 3. 파일 삭제
await supabase.storage
  .from('portfolio-images')
  .remove([`public/${file.name}`]);
```

---

## 5. 다국어 처리 (i18n) 완전 정복

### 🌍 다국어 구현 방식 비교

#### **방법 1: next-intl (라이브러리)**

```typescript
// 장점: 강력한 기능, URL 라우팅 지원
// 단점: 복잡한 설정, 폴더 구조 변경 필요

// [locale]/page.tsx 형식으로 변경해야 함
app/
  [locale]/
    page.tsx      // /ko, /en, /ja
    about/
      page.tsx    // /ko/about, /en/about
```

#### **방법 2: 커스텀 Hook (우리 프로젝트)**

```typescript
// 장점: 간단, 빠름, 유연함
// 단점: URL 기반 라우팅 없음 (localStorage 사용)

app/
  page.tsx        // / (모든 언어)
  about/
    page.tsx      // /about (언어는 localStorage)
```

---

### 🛠️ 커스텀 다국어 시스템 구현 원리

#### **1. 번역 파일 구조**

```json
// src/locales/ko/common.json
{
  "nav": {
    "home": "홈",
    "about": "소개"
  },
  "home": {
    "title": "환영합니다",
    "description": "우리 사이트에 오신 것을 환영합니다"
  }
}

// src/locales/en/common.json
{
  "nav": {
    "home": "Home",
    "about": "About"
  },
  "home": {
    "title": "Welcome",
    "description": "Welcome to our site"
  }
}
```

---

#### **2. useTranslation Hook 동작 원리**

```typescript
// src/hooks/useTranslation.ts
'use client';

import { useState, useEffect } from 'react';

export function useTranslation() {
  const [messages, setMessages] = useState({});
  
  useEffect(() => {
    // 1. localStorage에서 저장된 언어 확인
    const savedLang = localStorage.getItem('language') || 'ko';
    
    // 2. 해당 언어의 번역 파일 동적 로드
    import(`../locales/${savedLang}/common.json`)
      .then(module => setMessages(module.default));
  }, []);
  
  // 3. 번역 키를 텍스트로 변환하는 함수
  const t = (key: string) => {
    // "nav.home" → ["nav", "home"]
    const keys = key.split('.');
    
    // messages.nav.home을 찾아감
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;  // 못 찾으면 키 그대로 반환
  };
  
  return { t };
}
```

**사용 예시:**
```typescript
function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      {/* 
        한국어: "환영합니다"
        영어: "Welcome"
      */}
    </div>
  );
}
```

---

#### **3. 언어 전환 메커니즘**

```typescript
// LanguageSwitcher.tsx
function LanguageSwitcher() {
  const changeLanguage = (lang: string) => {
    // 1. localStorage에 저장
    localStorage.setItem('language', lang);
    
    // 2. 페이지 새로고침 (번역 파일 다시 로드)
    window.location.reload();
  };
  
  return (
    <div>
      <button onClick={() => changeLanguage('ko')}>🇰🇷</button>
      <button onClick={() => changeLanguage('en')}>🇺🇸</button>
      <button onClick={() => changeLanguage('ja')}>🇯🇵</button>
    </div>
  );
}
```

**작동 흐름:**
```
1. 사용자가 🇺🇸 버튼 클릭
    ↓
2. localStorage.setItem('language', 'en')
    ↓
3. window.location.reload()
    ↓
4. useTranslation Hook 재실행
    ↓
5. localStorage.getItem('language') → 'en'
    ↓
6. import('../locales/en/common.json')
    ↓
7. 모든 t() 호출이 영어 텍스트 반환
```

---

# Part 2: 고급 기능 구현

## 6. 인증 시스템 (Authentication)

### 🔐 Supabase Auth 동작 원리

#### **전통적인 인증 (JWT)**

```javascript
// 1. 로그인
POST /api/login
{ email, password }
    ↓
// 2. 서버에서 JWT 생성
const token = jwt.sign({ userId: 123 }, SECRET_KEY);
    ↓
// 3. 클라이언트에 전송
res.json({ token });
    ↓
// 4. 클라이언트가 localStorage에 저장
localStorage.setItem('token', token);
    ↓
// 5. 이후 요청마다 헤더에 포함
fetch('/api/protected', {
  headers: { Authorization: `Bearer ${token}` }
});
```

#### **Supabase Auth (자동 관리)**

```typescript
// 1. 로그인 (Supabase가 알아서 처리)
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Supabase가 자동으로:
// - JWT 생성
// - localStorage에 저장
// - 자동 갱신 (만료 전)
// - 모든 API 요청에 자동으로 토큰 포함

// 2. 현재 사용자 확인 (간단!)
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  console.log('로그인됨:', user.email);
} else {
  console.log('로그인 안 됨');
}
```

---

### 🎯 실전: 관리자 인증 구현

```typescript
// app/auth/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        alert('로그인 실패: ' + error.message);
        return;
      }
      
      // 관리자 권한 확인
      const isAdmin = data.user?.user_metadata?.role === 'admin';
      
      if (isAdmin) {
        router.push('/admin');
      } else {
        alert('관리자 권한이 필요합니다');
        await supabase.auth.signOut();
      }
      
    } else {
      // 회원가입
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'user'  // 기본적으로 일반 사용자
          }
        }
      });
      
      if (error) {
        alert('회원가입 실패: ' + error.message);
        return;
      }
      
      alert('회원가입 완료! 이메일 인증을 확인하세요.');
    }
  };
  
  return (
    <form onSubmit={handleAuth}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        required
      />
      <button type="submit">
        {isLogin ? '로그인' : '회원가입'}
      </button>
      <button 
        type="button"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? '회원가입하기' : '로그인하기'}
      </button>
    </form>
  );
}
```

---

### 🛡️ 보호된 라우트 구현

```typescript
// app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    // 1. 로그인 확인
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // 로그인 안 됨 → 로그인 페이지로
      router.push('/auth');
      return;
    }
    
    // 2. 관리자 권한 확인
    const isAdmin = user.user_metadata?.role === 'admin';
    
    if (!isAdmin) {
      // 관리자 아님 → 홈으로
      alert('관리자 권한이 필요합니다');
      router.push('/');
      return;
    }
    
    // 3. 통과!
    setLoading(false);
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return <div>{children}</div>;
}
```

---

## 7. 파일 업로드 & Storage

### 📦 Supabase Storage 구조

```
Supabase Storage
├── portfolio-images (Bucket)
│   ├── public/
│   │   ├── wedding-1.jpg
│   │   ├── wedding-2.jpg
│   │   └── couple-1.jpg
│   └── private/
│       └── draft-1.jpg
└── user-avatars (Bucket)
    ├── user-123.jpg
    └── user-456.jpg
```

**Bucket = 폴더 같은 개념**
- Public: 누구나 접근 가능
- Private: 인증된 사용자만 접근

---

### 📤 파일 업로드 완전 구현

```typescript
// app/admin/portfolio/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PortfolioUpload() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  
  // 1. 파일 선택 시 미리보기
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // 파일 타입 검증
    if (!selectedFile.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다');
      return;
    }
    
    // 파일 크기 검증 (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다');
      return;
    }
    
    setFile(selectedFile);
    
    // 미리보기 URL 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };
  
  // 2. 파일 업로드
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    try {
      // 고유한 파일 이름 생성
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `public/${fileName}`;
      
      // Supabase Storage에 업로드
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // 공개 URL 가져오기
      const { data: urlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);
      
      // DB에 저장
      const { error: dbError } = await supabase
        .from('portfolios')
        .insert({
          title: file.name,
          image_url: urlData.publicUrl,
          category: '웨딩스냅'
        });
      
      if (dbError) throw dbError;
      
      alert('업로드 완료!');
      setFile(null);
      setPreview('');
      
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('업로드 실패: ' + error.message);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div>
      {/* 파일 선택 */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      
      {/* 미리보기 */}
      {preview && (
        <div>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ maxWidth: '300px' }}
          />
        </div>
      )}
      
      {/* 업로드 버튼 */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? '업로드 중...' : '업로드'}
      </button>
    </div>
  );
}
```

---

### 🗑️ 파일 삭제

```typescript
const handleDelete = async (portfolioId: string, imageUrl: string) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  
  try {
    // 1. Storage에서 이미지 삭제
    // URL에서 파일 경로 추출
    // https://xxx.supabase.co/storage/v1/object/public/portfolio-images/public/abc.jpg
    // → public/abc.jpg
    const path = imageUrl.split('/portfolio-images/')[1];
    
    await supabase.storage
      .from('portfolio-images')
      .remove([path]);
    
    // 2. DB에서 레코드 삭제
    await supabase
      .from('portfolios')
      .delete()
      .eq('id', portfolioId);
    
    alert('삭제 완료!');
    
  } catch (error: any) {
    alert('삭제 실패: ' + error.message);
  }
};
```

---

## 8. 관리자 페이지 구현

### 🎯 관리자 포트폴리오 관리 시스템

```typescript
// app/admin/portfolio/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Upload } from 'lucide-react';

interface Portfolio {
  id: string;
  title: string;
  image_url: string;
  category: string;
  created_at: string;
}

export default function AdminPortfolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPortfolios();
  }, []);
  
  const fetchPortfolios = async () => {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error:', error);
    } else {
      setPortfolios(data);
    }
    
    setLoading(false);
  };
  
  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    
    try {
      // Storage에서 이미지 삭제
      const path = imageUrl.split('/portfolio-images/')[1];
      await supabase.storage
        .from('portfolio-images')
        .remove([path]);
      
      // DB에서 삭제
      await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);
      
      // UI 업데이트
      setPortfolios(prev => prev.filter(p => p.id !== id));
      alert('삭제 완료!');
      
    } catch (error: any) {
      alert('삭제 실패: ' + error.message);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        포트폴리오 관리
      </h1>
      
      {/* 업로드 버튼 */}
      <button className="mb-6 px-4 py-2 bg-blue-500 text-white rounded">
        <Upload className="inline mr-2" />
        새 이미지 업로드
      </button>
      
      {/* 포트폴리오 그리드 */}
      <div className="grid grid-cols-4 gap-4">
        {portfolios.map((item) => (
          <div 
            key={item.id}
            className="relative group"
          >
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-64 object-cover rounded"
            />
            
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => handleDelete(item.id, item.image_url)}
                className="p-2 bg-red-500 text-white rounded"
              >
                <Trash2 />
              </button>
            </div>
            
            <div className="mt-2">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 9. 이메일 발송 시스템

### 📧 Gmail SMTP 완전 구현

```typescript
// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // 1. 요청 데이터 파싱
    const { name, email, phone, message } = await request.json();
    
    // 2. Gmail SMTP Transporter 생성
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,         // your-email@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD, // 앱 비밀번호 (16자리)
      },
    });
    
    // 3. 이메일 내용 구성
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,  // 자기 자신에게 전송
      subject: `[문의] ${name}님의 문의`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>새로운 문의가 도착했습니다</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h3>문의자 정보</h3>
            <p><strong>이름:</strong> ${name}</p>
            <p><strong>이메일:</strong> ${email}</p>
            <p><strong>전화번호:</strong> ${phone || '없음'}</p>
          </div>
          
          <div style="margin-top: 20px;">
            <h3>문의 내용</h3>
            <p>${message}</p>
          </div>
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="color: #666; font-size: 12px;">
            이 이메일은 Moment Snap 문의 폼에서 자동 발송되었습니다.
          </p>
        </div>
      `,
    };
    
    // 4. 이메일 발송
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ 이메일 발송 성공:', result.messageId);
    
    return NextResponse.json({
      success: true,
      message: '이메일이 발송되었습니다.'
    });
    
  } catch (error: any) {
    console.error('❌ 이메일 발송 실패:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '이메일 발송에 실패했습니다: ' + error.message
      },
      { status: 500 }
    );
  }
}
```

**호출:**
```typescript
// app/contact/page.tsx
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    message: '촬영 문의드립니다'
  })
});

const data = await response.json();

if (data.success) {
  alert('문의가 전송되었습니다!');
}
```

---

## 10. Row Level Security (RLS)

### 🛡️ RLS 개념 이해

**RLS 없는 경우:**
```typescript
// 누구나 모든 데이터에 접근 가능
const { data } = await supabase
  .from('contacts')
  .select('*');  // 모든 사용자의 문의가 보임! 😱
```

**RLS 있는 경우:**
```typescript
// 본인의 데이터만 조회 가능
const { data } = await supabase
  .from('contacts')
  .select('*');  // 로그인한 사용자의 문의만 보임 ✅
```

---

### 🎯 RLS 정책 구현

```sql
-- 1. RLS 활성화
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 2. 누구나 삽입 가능 (문의 작성)
CREATE POLICY "Anyone can insert contacts"
  ON contacts FOR INSERT
  WITH CHECK (true);

-- 3. 본인 것만 조회 가능
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id);

-- 4. 관리자는 모두 조회 가능
CREATE POLICY "Admins can view all contacts"
  ON contacts FOR SELECT
  USING (
    (auth.jwt()->'user_metadata'->>'role') = 'admin'
  );

-- 5. 관리자는 모두 삭제 가능
CREATE POLICY "Admins can delete contacts"
  ON contacts FOR DELETE
  USING (
    (auth.jwt()->'user_metadata'->>'role') = 'admin'
  );
```

---

# Part 3: 실전 가이드

## 11. 프로젝트 구조 완벽 분석

```
photo-studio/
├── src/
│   ├── app/                      # App Router (페이지)
│   │   ├── layout.tsx           # 전역 레이아웃
│   │   ├── page.tsx             # 홈 (/)
│   │   ├── globals.css          # 전역 CSS
│   │   │
│   │   ├── portfolio/           # 포트폴리오 (/portfolio)
│   │   │   └── page.tsx
│   │   │
│   │   ├── services/            # 서비스 (/services)
│   │   │   └── page.tsx
│   │   │
│   │   ├── contact/             # 문의 (/contact)
│   │   │   └── page.tsx
│   │   │
│   │   ├── auth/                # 인증 (/auth)
│   │   │   └── page.tsx
│   │   │
│   │   ├── admin/               # 관리자 (/admin)
│   │   │   ├── layout.tsx       # 관리자 전용 레이아웃
│   │   │   ├── page.tsx         # 대시보드
│   │   │   └── portfolio/       # 포트폴리오 관리
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                 # API Routes
│   │       └── send-email/
│   │           └── route.ts     # POST /api/send-email
│   │
│   ├── components/              # 재사용 컴포넌트
│   │   ├── Navbar.tsx           # 네비게이션 바
│   │   ├── Footer.tsx           # 푸터
│   │   └── LanguageSwitcher.tsx # 언어 전환
│   │
│   ├── lib/                     # 라이브러리 & 유틸리티
│   │   └── supabase.ts          # Supabase 클라이언트
│   │
│   ├── hooks/                   # 커스텀 Hooks
│   │   └── useTranslation.ts    # 다국어 Hook
│   │
│   ├── locales/                 # 번역 파일
│   │   ├── ko/
│   │   │   └── common.json
│   │   ├── en/
│   │   │   └── common.json
│   │   └── ja/
│   │       └── common.json
│   │
│   ├── config/                  # 설정 파일
│   │   └── business-info.ts     # 비즈니스 정보
│   │
│   └── i18n/                    # i18n 설정
│       ├── config.ts
│       └── request.ts
│
├── public/                      # 정적 파일
│   └── images/
│
├── .env.local                   # 환경 변수 (비밀!)
├── package.json                 # 의존성
├── tsconfig.json               # TypeScript 설정
├── tailwind.config.ts          # Tailwind 설정
└── next.config.ts              # Next.js 설정
```

---

## 12. 환경 변수 완벽 가이드

### 🔐 .env.local 파일 구조

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...

# Gmail (서버 전용)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop

# 기타
NODE_ENV=development
```

---

### 🎯 NEXT_PUBLIC_ 의 의미

```typescript
// ❌ 클라이언트에서 접근 불가
console.log(process.env.GMAIL_APP_PASSWORD);
// → undefined

// ✅ NEXT_PUBLIC_이 붙으면 접근 가능
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
// → https://xxx.supabase.co

// 이유: 보안!
// GMAIL_APP_PASSWORD는 브라우저에 노출되면 안 됨
// NEXT_PUBLIC_은 브라우저 번들에 포함됨
```

---

## 13. 성능 최적화

### ⚡ 이미지 최적화

```typescript
// ❌ 나쁨 (느림, 큰 파일)
<img src="/photo.jpg" alt="Photo" />

// ✅ 좋음 (빠름, 자동 최적화)
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  quality={85}      // 압축 품질 (1-100)
  priority          // 우선 로딩 (첫 화면에 보이는 이미지)
  placeholder="blur" // 로딩 중 블러 효과
/>

// Next.js가 자동으로:
// 1. WebP 형식으로 변환
// 2. 적절한 크기로 리사이징
// 3. Lazy loading 적용
// 4. 모던 브라우저에 최적화
```

---

### 🚀 동적 Import

```typescript
// ❌ 나쁨 (모든 컴포넌트가 번들에 포함)
import HeavyChart from '@/components/HeavyChart';

export default function Dashboard() {
  return <HeavyChart />;
}

// ✅ 좋음 (필요할 때만 로드)
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('@/components/HeavyChart'),
  {
    loading: () => <p>Loading chart...</p>,
    ssr: false  // 서버 렌더링 안 함 (브라우저에서만)
  }
);

export default function Dashboard() {
  return <HeavyChart />;
}
```

---

### 🎯 React.memo 활용

```typescript
// ❌ 나쁨 (부모가 리렌더링될 때마다 자식도 리렌더링)
function ChildComponent({ name }) {
  console.log('Child rendered');
  return <div>{name}</div>;
}

// ✅ 좋음 (props가 변경될 때만 리렌더링)
import { memo } from 'react';

const ChildComponent = memo(function ChildComponent({ name }) {
  console.log('Child rendered');
  return <div>{name}</div>;
});
```

---

## 14. 디버깅 팁

### 🐛 자주 발생하는 에러

#### **1. "Hydration failed"**

```
원인: 서버와 클라이언트의 HTML이 다름

// ❌ 문제 코드
function MyComponent() {
  return <div>{Date.now()}</div>;
  // 서버: 1234567890
  // 클라이언트: 1234567891 (다름!)
}

// ✅ 해결
'use client';

import { useEffect, useState } from 'react';

function MyComponent() {
  const [time, setTime] = useState(null);
  
  useEffect(() => {
    setTime(Date.now());  // 클라이언트에서만 실행
  }, []);
  
  if (!time) return null;
  
  return <div>{time}</div>;
}
```

---

#### **2. "localStorage is not defined"**

```typescript
// ❌ 문제: 서버에서는 localStorage가 없음
const lang = localStorage.getItem('language');

// ✅ 해결 1: 클라이언트 컴포넌트로
'use client';

function MyComponent() {
  const lang = localStorage.getItem('language');
}

// ✅ 해결 2: useEffect 사용
function MyComponent() {
  const [lang, setLang] = useState('ko');
  
  useEffect(() => {
    const saved = localStorage.getItem('language');
    setLang(saved || 'ko');
  }, []);
}
```

---

## 15. 학습 로드맵

### 📅 1주일 완성 계획

**Day 1: Next.js 기초**
- App Router 이해
- Server/Client Component 차이
- 간단한 페이지 만들기

**Day 2: Tailwind CSS**
- 기본 클래스 익히기
- 반응형 디자인
- 실제 페이지 스타일링

**Day 3: Supabase 기초**
- 프로젝트 생성
- 테이블 만들기
- CRUD 작업

**Day 4: 인증 구현**
- 로그인/회원가입
- 보호된 라우트
- 관리자 권한

**Day 5: 파일 업로드**
- Storage 사용
- 이미지 업로드
- 미리보기

**Day 6: API Routes**
- 이메일 발송
- 외부 API 호출
- 에러 처리

**Day 7: 다국어 & 배포**
- i18n 구현
- Vercel 배포
- 최종 테스트

---

## 🎓 추가 학습 자료

- **Next.js 공식 문서:** https://nextjs.org/docs
- **Tailwind 공식 문서:** https://tailwindcss.com/docs
- **Supabase 공식 문서:** https://supabase.com/docs
- **Next.js Learn:** https://nextjs.org/learn (무료 인터랙티브 튜토리얼)

---

## 💬 마무리

이 가이드는 실제 프로젝트에서 사용된 **모든 기술과 패턴**을 설명합니다.

**핵심 원칙:**
1. Server Component를 기본으로, 필요할 때만 Client Component
2. Tailwind로 빠르게 스타일링
3. Supabase로 빠르게 백엔드 구축
4. TypeScript로 안전하게 개발

**성공의 비결:**
- 작은 것부터 시작
- 에러를 두려워하지 말기
- 공식 문서 참고
- 많이 만들어보기

---

**이제 여러분은 Next.js 전문가입니다! 🚀**

