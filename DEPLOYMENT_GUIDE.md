# 🚀 Vercel 배포 가이드

이 가이드는 사진 스튜디오 웹사이트를 Vercel에 무료로 배포하는 방법을 설명합니다.

## 📋 사전 준비

### 1. GitHub 계정 및 리포지토리

- GitHub 계정이 필요합니다 (없다면 [github.com](https://github.com)에서 생성)
- 이 프로젝트를 GitHub 리포지토리에 업로드해야 합니다

### 2. Supabase 프로젝트

- Supabase 프로젝트가 이미 생성되어 있어야 합니다
- 데이터베이스 테이블과 스토리지가 설정되어 있어야 합니다

### 3. Gmail 계정 (문의 기능용)

- Gmail 앱 비밀번호가 설정되어 있어야 합니다
- 자세한 내용은 `GMAIL_SETUP.md` 참조

---

## 🎯 배포 단계

### Step 1: GitHub에 코드 업로드

#### 1-1. Git 초기화 (처음이라면)

```bash
cd photo-studio
git init
git add .
git commit -m "Initial commit"
```

#### 1-2. GitHub 리포지토리 생성

1. [GitHub](https://github.com)에 로그인
2. 우측 상단 `+` 버튼 클릭 → `New repository`
3. Repository name 입력 (예: `photo-studio`)
4. **Private** 선택 (환경 변수 보안을 위해)
5. `Create repository` 클릭

#### 1-3. GitHub에 푸시

```bash
# GitHub에서 제공하는 명령어 사용
git remote add origin git@github.com:JINWORLD13/photo-studio.git
git branch -M main
git push -u origin main
```

⚠️ **주의**: `.env.local` 파일은 절대 GitHub에 업로드하지 마세요! (`.gitignore`에 이미 포함됨)

---

### Step 2: Vercel 계정 생성 및 프로젝트 연결

#### 2-1. Vercel 가입

1. [vercel.com](https://vercel.com) 방문
2. `Sign Up` 클릭
3. **"Continue with GitHub"** 선택 (권장)
4. GitHub 계정으로 로그인 및 권한 승인

#### 2-2. 새 프로젝트 생성

1. Vercel 대시보드에서 `Add New...` → `Project` 클릭
2. GitHub 리포지토리 목록에서 `photo-studio` 선택
3. `Import` 클릭

#### 2-3. 프로젝트 설정

- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (자동 설정됨)
- **Output Directory**: `.next` (자동 설정됨)

---

### Step 3: 환경 변수 설정 ⚠️ 중요!

#### 3-1. Environment Variables 섹션 열기

프로젝트 설정 페이지에서 `Environment Variables` 섹션을 찾습니다.

#### 3-2. 환경 변수 추가

로컬의 `.env.local` 파일 내용을 하나씩 추가합니다:

| Key                             | Value                       | 설명                       |
| ------------------------------- | --------------------------- | -------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxxxx.supabase.co` | Supabase 프로젝트 URL      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...`                | Supabase Anon 키           |
| `GMAIL_USER`                    | `your-email@gmail.com`      | Gmail 계정                 |
| `GMAIL_APP_PASSWORD`            | `xxxx xxxx xxxx xxxx`       | Gmail 앱 비밀번호 (16자리) |
| `NEXT_PUBLIC_ADMIN_EMAILS`      | `admin@domain.com`          | 관리자 이메일 (선택사항)   |
| `NEXT_PUBLIC_ADMIN_PATH`        | `my_secret_admin`           | 관리자 경로 (선택사항)     |

**입력 방법:**

1. Key 입력란에 변수 이름 입력
2. Value 입력란에 실제 값 입력
3. `Add` 버튼 클릭
4. 모든 변수 추가 후 다음 단계로

#### 📌 환경 변수 찾는 방법:

**Supabase 설정 찾기:**

1. [Supabase 대시보드](https://supabase.com/dashboard) 로그인
2. 프로젝트 선택
3. 좌측 메뉴 `Settings` → `API`
4. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
5. **Project API keys** → `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Gmail 설정 찾기:**

- `GMAIL_SETUP.md` 파일 참조

---

### Step 4: 배포 시작

1. 환경 변수 설정 완료 후 `Deploy` 버튼 클릭
2. 빌드 프로세스 시작 (약 2-5분 소요)
3. 로그에서 진행 상황 확인

#### 배포 성공 시:

```
✓ Build succeeded
✓ Deployment ready
```

4. `Visit` 버튼 클릭하여 배포된 사이트 확인
5. 기본 도메인: `https://your-project.vercel.app`

---

## 🌐 커스텀 도메인 설정 (선택사항)

### 자신의 도메인 연결하기

#### 1. 도메인 구매

- [Namecheap](https://www.namecheap.com)
- [GoDaddy](https://www.godaddy.com)
- [Gabia](https://www.gabia.com) (한국)

#### 2. Vercel에 도메인 추가

1. Vercel 프로젝트 대시보드
2. `Settings` → `Domains`
3. 도메인 입력 (예: `mystudio.com`)
4. `Add` 클릭

#### 3. DNS 설정

Vercel이 제공하는 DNS 레코드를 도메인 제공업체에 추가:

**A 레코드:**

```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME 레코드 (www):**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 4. 확인

- DNS 전파 시간: 최대 48시간 (보통 몇 분~몇 시간)
- Vercel에서 자동으로 SSL 인증서 발급 (무료)

---

## 🔄 자동 배포 설정

### GitHub와 자동 연동

Vercel은 GitHub 리포지토리와 자동 연동됩니다:

- **Main 브랜치에 푸시** → 자동으로 프로덕션 배포
- **다른 브랜치에 푸시** → 프리뷰 배포 생성
- **Pull Request 생성** → 프리뷰 URL 자동 생성

#### 코드 업데이트 방법:

```bash
# 코드 수정 후
git add .
git commit -m "Update: 설명"
git push origin main
```

→ 자동으로 Vercel에 배포됩니다!

---

## 🐛 문제 해결

### 1. 빌드 실패

#### 오류: "Module not found"

```bash
# 로컬에서 확인
npm install
npm run build
```

로컬에서 빌드가 성공하는지 확인 후 다시 푸시

#### 오류: "Environment variable missing"

- Vercel 대시보드 → `Settings` → `Environment Variables`
- 모든 필수 변수가 추가되었는지 확인
- 변수 추가 후 `Redeploy` 클릭

### 2. 런타임 오류

#### Supabase 연결 실패

- `NEXT_PUBLIC_SUPABASE_URL`이 올바른지 확인
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 올바른지 확인
- Supabase 대시보드에서 프로젝트가 활성 상태인지 확인

#### 이메일 발송 실패

- `GMAIL_USER`가 올바른지 확인
- `GMAIL_APP_PASSWORD`가 올바른지 확인 (공백 포함 16자리)
- Gmail 2단계 인증이 활성화되어 있는지 확인

#### 이미지 로딩 실패

- Supabase Storage 버킷이 public으로 설정되어 있는지 확인
- RLS 정책이 올바르게 설정되어 있는지 확인

### 3. 환경 변수 업데이트

환경 변수를 변경한 경우:

1. Vercel 대시보드 → `Settings` → `Environment Variables`
2. 변수 수정
3. `Deployments` 탭으로 이동
4. 최신 배포의 `...` 메뉴 → `Redeploy`

---

## 📊 배포 후 확인 사항

### ✅ 체크리스트

- [ ] 홈페이지가 정상적으로 표시됨
- [ ] 포트폴리오 이미지가 로드됨
- [ ] 언어 전환이 작동함 (한/영/일)
- [ ] 문의 폼이 작동함 (이메일 발송 테스트)
- [ ] 관리자 로그인이 작동함
- [ ] 관리자 페이지에서 포트폴리오 업로드가 작동함
- [ ] 모바일에서 정상 표시됨
- [ ] HTTPS가 적용됨 (자물쇠 아이콘)

---

## 💰 비용 및 제한사항

### Vercel 무료 플랜 제한:

| 항목                    | 무료 플랜 한도 |
| ----------------------- | -------------- |
| 대역폭                  | 100GB/월       |
| 서버리스 함수 실행 시간 | 100시간/월     |
| 이미지 최적화           | 1,000회/월     |
| 빌드 시간               | 6,000분/월     |
| 프로젝트 수             | 무제한         |
| 도메인                  | 무제한         |

### 예상 사용량:

- **소규모 사진 스튜디오**: 무료 플랜으로 충분
- **월 방문자 1,000명**: 약 5-10GB 대역폭
- **포트폴리오 이미지**: Supabase에 저장 (Vercel 용량에 포함 안 됨)

### 한도 초과 시:

1. Vercel에서 이메일 알림
2. 선택지:
   - Pro 플랜 업그레이드 ($20/월)
   - 또는 다음 달까지 대기

---

## 🔒 보안 모범 사례

### 1. 환경 변수 보호

- ✅ GitHub에 `.env.local` 업로드 금지 (`.gitignore` 확인)
- ✅ Vercel에서만 환경 변수 설정
- ✅ API 키를 코드에 직접 작성하지 않기

### 2. 관리자 페이지 보호

- ✅ `NEXT_PUBLIC_ADMIN_PATH` 설정 (예측 불가능한 경로)
- ✅ `NEXT_PUBLIC_ADMIN_EMAILS` 설정 (화이트리스트)
- ✅ Supabase Row Level Security (RLS) 활성화

### 3. Supabase 보안

- ✅ RLS 정책 활성화
- ✅ Anon 키만 사용 (Service 키는 서버에서만)
- ✅ Storage 버킷 정책 확인

---

## 📈 성능 모니터링

### Vercel Analytics (무료)

1. Vercel 대시보드 → 프로젝트 선택
2. `Analytics` 탭
3. 확인 가능 항목:
   - 페이지 뷰
   - 고유 방문자
   - 상위 페이지
   - 국가별 트래픽
   - 성능 점수

### Vercel Speed Insights (무료)

1. 프로젝트 → `Speed Insights` 탭
2. 실시간 성능 메트릭:
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - First Input Delay (FID)

---

## 🎉 배포 완료!

축하합니다! 이제 전 세계 어디서나 사진 스튜디오 웹사이트에 접속할 수 있습니다.

### 다음 단계:

1. **SEO 최적화**: 구글 검색에 노출되도록 설정
2. **Google Analytics**: 방문자 분석 도구 추가
3. **소셜 미디어 연동**: 인스타그램, 페이스북 링크 추가
4. **커스텀 도메인**: 전문적인 도메인 연결

### 유용한 링크:

- 📚 [Vercel 문서](https://vercel.com/docs)
- 🎯 [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- 💾 [Supabase 문서](https://supabase.com/docs)
- 📧 [Gmail 설정 가이드](./GMAIL_SETUP.md)

---

## ❓ 자주 묻는 질문 (FAQ)

### Q: 배포 후 사이트가 안 보여요

A: 빌드 로그 확인 → 환경 변수 확인 → 로컬 빌드 테스트

### Q: 이미지가 안 나와요

A: Supabase Storage 버킷이 public인지 확인 → RLS 정책 확인

### Q: 문의 이메일이 안 와요

A: Gmail 앱 비밀번호 확인 → Vercel 로그 확인 → 스팸 메일함 확인

### Q: 도메인 연결이 안 돼요

A: DNS 설정 확인 (최대 48시간 소요) → Vercel 도메인 상태 확인

### Q: 비용이 청구되나요?

A: 무료 플랜 한도 내에서는 절대 청구 안 됩니다. 한도 초과 시 알림만 옵니다.

---

## 📞 도움이 필요하신가요?

- **Vercel 지원**: [vercel.com/support](https://vercel.com/support)
- **Supabase 지원**: [supabase.com/support](https://supabase.com/support)
- **프로젝트 문서**: 이 리포지토리의 다른 MD 파일들 참조

---

**마지막 업데이트**: 2024년 11월
**버전**: 1.0
