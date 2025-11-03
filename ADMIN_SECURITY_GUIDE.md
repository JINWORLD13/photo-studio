# 🔒 관리자 보안 강화 가이드

관리자 계정을 해킹으로부터 보호하는 여러 보안 강화 방법입니다.

---

## 📋 목차

1. [이메일 화이트리스트](#1-이메일-화이트리스트)
2. [로그인 시도 제한 (Brute Force 방지)](#2-로그인-시도-제한)
3. [관리자 페이지 URL 난독화](#3-관리자-페이지-url-난독화)
4. [세션 타임아웃](#4-세션-타임아웃)
5. [Supabase 보안 설정](#5-supabase-보안-설정)
6. [2단계 인증 (선택)](#6-2단계-인증-선택)

---

## 1. 이메일 화이트리스트

### 개요
특정 이메일만 관리자로 로그인할 수 있도록 제한합니다.

### 설정 방법

#### Step 1: 환경 변수 추가

`.env.local` 파일에 다음 추가:

```bash
# 관리자 이메일 화이트리스트 (쉼표로 구분)
NEXT_PUBLIC_ADMIN_EMAILS=admin@yourdomain.com,owner@yourdomain.com
```

#### Step 2: 코드 적용

이미 구현되어 있습니다! `src/lib/admin-auth.ts` 참고

### 장점
- ✅ Supabase에 role을 설정하지 않아도 됨
- ✅ 환경 변수만 수정하면 즉시 적용
- ✅ 다른 사람이 회원가입해도 관리자 권한 없음

---

## 2. 로그인 시도 제한

### 개요
짧은 시간에 여러 번 로그인 실패 시 일시적으로 차단 (Brute Force 공격 방지)

### 작동 방식
- 5분 내 5회 실패 → 15분 차단
- localStorage에 시도 기록 저장
- IP 기반 차단도 추가 가능

### 설정 방법

이미 구현되어 있습니다! `src/lib/rate-limiter.ts` 참고

### 효과
```
해커가 1분에 100번 시도 → ❌ 5번만 시도하고 차단됨
정상 사용자가 비밀번호 잊음 → ✅ 5번까지는 재시도 가능
```

---

## 3. 관리자 페이지 URL 난독화

### 개요
`/admin` 같은 예측 가능한 URL 대신 복잡한 URL 사용

### 설정 방법

#### Step 1: 환경 변수 추가

`.env.local` 파일:

```bash
# 관리자 페이지 비밀 경로 (아무도 모르게!)
NEXT_PUBLIC_ADMIN_PATH=d4sh80ard_x7k9p
```

#### Step 2: 폴더 이름 변경

```bash
# 현재: src/app/admin/
# 변경: src/app/d4sh80ard_x7k9p/

# 또는 동적 경로 사용 (자동 적용됨)
src/app/[admin_path]/
```

이미 구현되어 있습니다! 환경 변수로 경로를 설정할 수 있습니다.

### 접근 방법

```
일반 사용자: /admin → 404 Not Found
관리자만 알고 있는 URL: /d4sh80ard_x7k9p → 접근 가능
```

---

## 4. 세션 타임아웃

### 개요
일정 시간 동안 활동이 없으면 자동 로그아웃

### 설정

Supabase 대시보드에서 설정:

1. **Authentication > Settings**
2. **JWT expiry limit**: `3600` (1시간)
3. **Refresh token rotation**: 활성화 ✅

### 코드에서 추가 제한

`src/lib/session-manager.ts` 참고:
- 10분 동안 활동 없으면 경고
- 15분 후 자동 로그아웃

---

## 5. Supabase 보안 설정

### Row Level Security (RLS) 강화

이미 `supabase-setup.sql`에 적용되어 있지만, 추가 확인:

```sql
-- 관리자만 모든 contacts 조회 가능
create policy "Admins can view all contacts"
  on contacts for select
  using (
    (auth.jwt()->'user_metadata'->>'role') = 'admin'
  );
```

### Supabase 대시보드 보안

1. **Authentication > Settings > Email Auth**
   - **Enable email confirmations**: ON ✅
   - **Secure email change**: ON ✅

2. **API Settings**
   - **Enable RLS**: 모든 테이블에 적용 ✅
   - **Disable API access**: Public 접근 차단 (필요시)

3. **Database > Roles**
   - `anon` role 권한 최소화
   - `authenticated` role만 필요한 권한 부여

---

## 6. 2단계 인증 (선택)

### Supabase MFA (Multi-Factor Authentication)

Supabase는 기본적으로 MFA를 지원합니다!

#### 설정 방법

1. **Supabase 대시보드 > Authentication > Settings**
2. **Multi-Factor Authentication** 활성화
3. 사용자가 로그인 시 Google Authenticator 등록

#### 코드 적용

```typescript
// 2FA 등록
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
});

// QR 코드 표시
console.log(data.totp.qr_code);

// 2FA 확인
await supabase.auth.mfa.verify({
  factorId: data.id,
  code: '123456', // 사용자가 입력한 6자리 코드
});
```

---

## 🎯 권장 설정 조합

### 최소 보안 (필수)
1. ✅ 이메일 화이트리스트
2. ✅ 로그인 시도 제한
3. ✅ 강력한 비밀번호 (12자 이상)

### 중간 보안 (권장)
1. ✅ 최소 보안 + 
2. ✅ 관리자 URL 난독화
3. ✅ 세션 타임아웃 (1시간)
4. ✅ RLS 정책 강화

### 최대 보안 (paranoid mode 😎)
1. ✅ 중간 보안 +
2. ✅ 2단계 인증 (MFA)
3. ✅ IP 화이트리스트
4. ✅ 로그인 알림 이메일
5. ✅ 관리자 활동 로깅

---

## 🚀 빠른 시작 (5분 설정)

### 1단계: 환경 변수 추가

`.env.local` 파일:

```bash
# 기존 설정...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 🔒 보안 설정 추가
NEXT_PUBLIC_ADMIN_EMAILS=your-email@gmail.com
NEXT_PUBLIC_ADMIN_PATH=my_secret_admin_path_2024
```

### 2단계: 개발 서버 재시작

```bash
npm run dev
```

### 3단계: 테스트

1. 관리자 이메일로 로그인 → ✅ 성공
2. 다른 이메일로 로그인 → ❌ "관리자 권한이 없습니다"
3. 새로운 관리자 URL 접속: `http://localhost:3000/my_secret_admin_path_2024`

---

## 🔍 보안 체크리스트

배포 전 반드시 확인:

- [ ] `.env.local` 파일이 Git에 업로드되지 않았는지 확인 (`.gitignore`에 포함)
- [ ] 관리자 이메일 화이트리스트 설정
- [ ] Supabase에서 RLS 활성화
- [ ] 강력한 비밀번호 사용 (12자 이상, 특수문자 포함)
- [ ] 관리자 URL 변경 (선택)
- [ ] Vercel 환경 변수에 `NEXT_PUBLIC_ADMIN_EMAILS` 추가
- [ ] 로그인 시도 제한 테스트

---

## 🆘 문제 해결

### Q1. 관리자 이메일로 로그인했는데 접근 안 됨

**확인사항:**
1. `.env.local`에 `NEXT_PUBLIC_ADMIN_EMAILS` 설정 확인
2. 개발 서버 재시작 (`npm run dev`)
3. 브라우저 캐시 삭제 (Ctrl + Shift + R)
4. Supabase에서 해당 이메일로 사용자가 생성되어 있는지 확인

### Q2. 로그인 시도 제한이 작동하지 않음

**확인사항:**
1. `src/lib/rate-limiter.ts` 파일 존재 확인
2. localStorage 지원 브라우저 사용 확인
3. 시크릿 모드에서는 초기화됨 (정상)

### Q3. 관리자 URL을 잊어버렸어요!

**해결:**
1. `.env.local` 파일에서 `NEXT_PUBLIC_ADMIN_PATH` 확인
2. 또는 코드에서 기본값 확인: `src/lib/admin-auth.ts`

---

## 📚 추가 참고 자료

- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [OWASP Top 10 보안](https://owasp.org/www-project-top-ten/)

---

**이제 관리자 계정이 훨씬 안전합니다! 🔒**

