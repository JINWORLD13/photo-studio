# ✅ Vercel 배포 체크리스트

배포 전후 확인해야 할 사항들입니다.

---

## 📋 배포 전 체크리스트

### 1. 코드 준비
- [x] ✅ 로컬 빌드 테스트 완료 (`npm run build`)
- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] 모든 기능이 로컬에서 정상 작동하는지 테스트
  - [ ] 홈페이지 로딩
  - [ ] 포트폴리오 페이지
  - [ ] 문의 폼
  - [ ] 관리자 로그인
  - [ ] 언어 전환 (한/영/일)

### 2. Supabase 준비
- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 테이블 생성 완료
  - [ ] `portfolios` 테이블
  - [ ] `portfolio_translations` 테이블
  - [ ] `profiles` 테이블 (필요시)
- [ ] Storage 버킷 설정 완료
  - [ ] `portfolios` 버킷 생성
  - [ ] Public 접근 설정
  - [ ] RLS 정책 설정
- [ ] Row Level Security (RLS) 정책 활성화
- [ ] API 키 준비
  - [ ] Project URL 복사
  - [ ] Anon Key 복사

### 3. Gmail 준비 (문의 기능용)
- [ ] Gmail 계정 준비
- [ ] 2단계 인증 활성화
- [ ] 앱 비밀번호 생성 (16자리)
- [ ] 이메일 수신 테스트

### 4. GitHub 준비
- [ ] GitHub 계정 생성
- [ ] 새 리포지토리 생성
  - [ ] 리포지토리 이름: `photo-studio` (또는 원하는 이름)
  - [ ] Private 선택 권장
  - [ ] README 추가하지 않음 (이미 있음)

---

## 🚀 배포 진행 체크리스트

### Step 1: GitHub에 푸시
```bash
cd photo-studio
git init
git add .
git commit -m "Initial commit: Photo studio website"
git remote add origin https://github.com/YOUR_USERNAME/photo-studio.git
git branch -M main
git push -u origin main
```

- [ ] Git 초기화 완료
- [ ] GitHub 리포지토리에 푸시 완료
- [ ] GitHub에서 코드 확인 완료
- [ ] `.env.local` 파일이 업로드되지 않았는지 확인 ⚠️ 중요!

### Step 2: Vercel 계정 생성
- [ ] https://vercel.com 접속
- [ ] "Sign Up with GitHub" 클릭
- [ ] GitHub 계정 연동 완료
- [ ] 권한 승인 완료

### Step 3: 프로젝트 임포트
- [ ] Vercel 대시보드에서 "Add New Project" 클릭
- [ ] GitHub 리포지토리 선택
- [ ] Framework: Next.js 자동 감지 확인
- [ ] Root Directory: `./` 확인

### Step 4: 환경 변수 설정 ⚠️ 필수!
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 추가
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가
- [ ] `GMAIL_USER` 추가
- [ ] `GMAIL_APP_PASSWORD` 추가
- [ ] `NEXT_PUBLIC_ADMIN_EMAILS` 추가 (선택)
- [ ] `NEXT_PUBLIC_ADMIN_PATH` 추가 (선택)
- [ ] 모든 변수에 오타가 없는지 재확인

### Step 5: 배포 시작
- [ ] "Deploy" 버튼 클릭
- [ ] 빌드 로그 모니터링
- [ ] 빌드 성공 확인 (✓ Build succeeded)
- [ ] 배포 URL 확인

---

## 🧪 배포 후 테스트 체크리스트

### 기본 기능 테스트
- [ ] 사이트가 열리는지 확인 (https://your-project.vercel.app)
- [ ] HTTPS 적용 확인 (자물쇠 아이콘)
- [ ] 모든 페이지 접속 테스트
  - [ ] 홈페이지 (/)
  - [ ] 포트폴리오 (/portfolio)
  - [ ] 서비스 (/services)
  - [ ] 문의 (/contact)
  - [ ] 로그인 (/auth)

### 이미지 및 콘텐츠
- [ ] 로고 이미지 로딩 확인
- [ ] 포트폴리오 이미지 로딩 확인
- [ ] Supabase Storage 연결 확인
- [ ] 이미지 최적화 작동 확인

### 다국어 기능
- [ ] 한국어 표시 확인
- [ ] 영어 전환 확인
- [ ] 일본어 전환 확인
- [ ] 언어 전환 시 콘텐츠 변경 확인

### 문의 폼 테스트 ⚠️ 중요!
- [ ] 문의 폼 열기
- [ ] 모든 필드 입력
- [ ] "문의하기" 버튼 클릭
- [ ] 성공 메시지 확인
- [ ] Gmail에서 이메일 수신 확인 (5분 대기)
- [ ] 스팸 메일함도 확인

### 관리자 기능 테스트
- [ ] 관리자 페이지 접속 (/admin 또는 커스텀 경로)
- [ ] 로그인 기능 확인
- [ ] 포트폴리오 관리 페이지 접속 (/admin/portfolio)
- [ ] 포트폴리오 업로드 테스트
- [ ] 포트폴리오 수정 테스트
- [ ] 포트폴리오 삭제 테스트

### 반응형 디자인
- [ ] 데스크톱 (1920px)
- [ ] 노트북 (1366px)
- [ ] 태블릿 (768px)
- [ ] 모바일 (375px)
- [ ] 네비게이션 메뉴 작동
- [ ] 이미지 반응형 확인

### 성능 테스트
- [ ] 페이지 로딩 속도 확인 (3초 이내)
- [ ] Lighthouse 점수 확인 (권장)
  - Performance: 80+ 
  - Accessibility: 90+
  - Best Practices: 90+
  - SEO: 90+

---

## 🔒 보안 체크리스트

### 환경 변수 보안
- [ ] GitHub에 `.env.local` 파일이 없는지 확인 ⚠️
- [ ] Vercel에서만 환경 변수 관리 확인
- [ ] API 키가 코드에 하드코딩되지 않았는지 확인

### Supabase 보안
- [ ] RLS (Row Level Security) 활성화 확인
- [ ] Storage 버킷 정책 확인
- [ ] Admin 권한 설정 확인
- [ ] Anon 키만 사용하는지 확인 (Service 키 미사용)

### 관리자 페이지 보안
- [ ] `NEXT_PUBLIC_ADMIN_PATH` 설정됨
- [ ] `NEXT_PUBLIC_ADMIN_EMAILS` 화이트리스트 설정됨
- [ ] 비인가 사용자 접근 차단 확인
- [ ] 로그인 세션 관리 확인

---

## 📊 모니터링 설정

### Vercel Analytics
- [ ] Vercel 대시보드 → Analytics 탭
- [ ] 페이지 뷰 추적 확인
- [ ] 트래픽 모니터링 설정

### Vercel Speed Insights
- [ ] Speed Insights 활성화
- [ ] 성능 메트릭 확인
- [ ] Core Web Vitals 모니터링

### 에러 로깅
- [ ] Vercel 로그 확인 방법 숙지
- [ ] 런타임 에러 모니터링
- [ ] 빌드 에러 알림 설정

---

## 🌐 SEO 및 마케팅 (선택사항)

### 메타 태그
- [ ] 페이지 제목 설정 확인
- [ ] 메타 설명 확인
- [ ] Open Graph 이미지 설정
- [ ] Favicon 확인

### 검색 엔진 등록
- [ ] Google Search Console 등록
- [ ] Naver 웹마스터 도구 등록
- [ ] Sitemap 제출
- [ ] robots.txt 확인

### 분석 도구
- [ ] Google Analytics 연동 (선택)
- [ ] Meta Pixel 연동 (선택)
- [ ] 네이버 애널리틱스 (선택)

---

## 🎯 커스텀 도메인 (선택사항)

### 도메인 구매
- [ ] 도메인 구매 (예: mystudio.com)
- [ ] 도메인 제공업체 로그인

### Vercel 연결
- [ ] Vercel → Settings → Domains
- [ ] 도메인 추가
- [ ] DNS 레코드 설정
  - [ ] A 레코드: 76.76.21.21
  - [ ] CNAME (www): cname.vercel-dns.com
- [ ] DNS 전파 대기 (최대 48시간)
- [ ] SSL 인증서 자동 발급 확인

### 도메인 테스트
- [ ] http://yourdomain.com 접속
- [ ] https://yourdomain.com 접속 (SSL)
- [ ] www.yourdomain.com 리다이렉트 확인

---

## 🐛 문제 해결 체크리스트

### 빌드 실패 시
- [ ] Vercel 빌드 로그 확인
- [ ] 로컬에서 `npm run build` 테스트
- [ ] `package.json` 의존성 확인
- [ ] Node.js 버전 확인

### 런타임 에러 시
- [ ] Vercel 함수 로그 확인
- [ ] 환경 변수 재확인
- [ ] 브라우저 콘솔 에러 확인
- [ ] Network 탭에서 API 요청 확인

### 이미지 로딩 실패 시
- [ ] Supabase Storage URL 확인
- [ ] 버킷이 public인지 확인
- [ ] RLS 정책 확인
- [ ] CORS 설정 확인

### 이메일 발송 실패 시
- [ ] `GMAIL_USER` 환경 변수 확인
- [ ] `GMAIL_APP_PASSWORD` 확인 (공백 포함 16자리)
- [ ] Gmail 2단계 인증 활성화 확인
- [ ] 스팸 메일함 확인
- [ ] Vercel 함수 로그 확인

---

## 📞 지원 리소스

### 문서
- [ ] `DEPLOYMENT_GUIDE.md` - 상세 배포 가이드
- [ ] `VERCEL_QUICKSTART.md` - 빠른 시작 가이드
- [ ] `GMAIL_SETUP.md` - Gmail 설정 가이드
- [ ] `SUPABASE_EMAIL_TEMPLATE.md` - Supabase 설정

### 외부 리소스
- [ ] Vercel 문서: https://vercel.com/docs
- [ ] Next.js 문서: https://nextjs.org/docs
- [ ] Supabase 문서: https://supabase.com/docs

### 커뮤니티
- [ ] Vercel Discord
- [ ] Next.js GitHub Discussions
- [ ] Supabase Discord

---

## ✅ 최종 확인

모든 체크리스트 항목이 완료되었나요?

- [ ] 배포 전 준비 완료
- [ ] 배포 성공
- [ ] 모든 기능 테스트 완료
- [ ] 보안 설정 완료
- [ ] 모니터링 설정 완료

### 🎉 축하합니다!

사진 스튜디오 웹사이트가 성공적으로 배포되었습니다!

**배포 URL**: `https://_____________________.vercel.app`

**배포 날짜**: ___________________

**담당자**: ___________________

---

## 📝 배포 후 할 일

### 즉시
1. 모든 기능 테스트
2. 고객/팀에게 URL 공유
3. 소셜 미디어 업데이트

### 1주일 내
1. 트래픽 모니터링
2. 사용자 피드백 수집
3. 성능 최적화
4. SEO 최적화

### 1개월 내
1. Google Analytics 분석
2. 콘텐츠 업데이트
3. 포트폴리오 추가
4. 커스텀 도메인 고려

---

**배포 완료를 축하합니다! 🚀**

