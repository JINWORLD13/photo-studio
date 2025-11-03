# 🔧 문제 해결 가이드 (Troubleshooting Guide)

## 📋 목차
1. [연락처 조회 오류](#1-연락처-조회-오류-error-fetching-contacts)
2. [Supabase 연결 오류](#2-supabase-연결-오류)
3. [인증 관련 오류](#3-인증-관련-오류)
4. [이메일 전송 오류](#4-이메일-전송-오류)

---

## 1. 연락처 조회 오류 (Error fetching contacts)

### 증상
```
Error fetching contacts: {}
```

### 원인
Supabase의 Row Level Security (RLS) 정책 때문에 사용자가 자신의 문의를 조회할 수 없는 경우입니다.

### 해결 방법

#### ✅ 방법 1: RLS 정책 업데이트 (권장)

1. **Supabase Dashboard** 접속
   - URL: https://your-project.supabase.co
   - 프로젝트 선택

2. **SQL Editor** 열기 (왼쪽 메뉴)

3. **기존 정책 확인 및 삭제**
   ```sql
   -- 기존 정책 목록 확인
   SELECT * FROM pg_policies WHERE tablename = 'contacts';
   
   -- 문제가 있는 정책 삭제
   DROP POLICY IF EXISTS "Users can view own contacts" ON contacts;
   ```

4. **새로운 정책 생성**
   ```sql
   -- 사용자는 본인의 문의만 조회 가능
   CREATE POLICY "Users can view own contacts"
     ON contacts FOR SELECT
     USING (auth.uid() = user_id);
   ```

5. **정책 적용 확인**
   ```sql
   -- 정책이 제대로 생성되었는지 확인
   SELECT * FROM pg_policies WHERE tablename = 'contacts';
   ```

#### ✅ 방법 2: 데이터 확인

1. **Table Editor**에서 contacts 테이블 확인
   - 데이터가 있는지 확인
   - `user_id` 컬럼 값 확인

2. **현재 로그인한 사용자 ID 확인**
   - 브라우저 개발자 도구 (F12) 열기
   - Console 탭에서 다음 실행:
   ```javascript
   const { data } = await supabase.auth.getUser()
   console.log('Current User ID:', data.user?.id)
   ```

3. **데이터의 user_id와 현재 사용자 ID가 일치하는지 확인**

#### ✅ 방법 3: 개발 중 임시 해결 (비추천 - 보안 위험)

**주의: 프로덕션 환경에서는 사용하지 마세요!**

```sql
-- RLS 일시 비활성화 (개발 전용)
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
```

**나중에 다시 활성화:**
```sql
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
```

---

## 2. Supabase 연결 오류

### 증상
```
Failed to connect to Supabase
supabaseUrl is empty
```

### 해결 방법

1. **.env.local 파일 확인**
   ```bash
   # 파일이 있는지 확인
   ls -la .env.local
   
   # 내용 확인
   cat .env.local
   ```

2. **환경 변수 설정 확인**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **개발 서버 재시작**
   ```bash
   # 서버 중지 (Ctrl + C)
   # 다시 시작
   npm run dev
   ```

4. **Supabase Project Settings 확인**
   - Dashboard → Settings → API
   - Project URL 복사
   - anon/public key 복사

---

## 3. 인증 관련 오류

### 증상 A: "Email not confirmed"
```
Email not confirmed
```

### 해결 방법
1. Supabase Dashboard → Authentication → Users
2. 해당 사용자 클릭
3. "Email confirmed" 체크박스 활성화

### 증상 B: "Invalid login credentials"
```
Invalid login credentials
```

### 해결 방법
1. 비밀번호 확인
2. 이메일 주소 확인 (공백 없는지)
3. Supabase Dashboard에서 사용자 존재 확인

### 증상 C: 관리자 권한 오류
```
관리자 권한이 필요합니다.
```

### 해결 방법

#### SQL Editor에서 실행:
```sql
-- 관리자 역할 부여
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-admin@email.com';
```

#### 또는 Dashboard에서:
1. Authentication → Users
2. 사용자 클릭
3. "Raw User Meta Data" 수정:
   ```json
   {
     "role": "admin"
   }
   ```

---

## 4. 이메일 전송 오류

### 증상
```
Failed to send email
```

### 해결 방법

1. **.env.local에 Gmail 설정 확인**
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   ```

2. **Gmail 앱 비밀번호 생성**
   - Google 계정 → 보안
   - 2단계 인증 활성화
   - 앱 비밀번호 생성
   - 자세한 내용: `GMAIL_SETUP.md` 참고

3. **API Route 확인**
   ```bash
   # 로그 확인
   # 개발 서버 실행 중 터미널에서 에러 메시지 확인
   ```

4. **방화벽/네트워크 확인**
   - 포트 587, 465가 열려있는지 확인
   - VPN 사용 중이면 끄고 시도

---

## 5. React Key 오류

### 증상
```
Encountered two children with the same key, `[object Object]`
Objects are not valid as a React child (found: object with keys {key, label})
```

### 원인
React에서 배열을 렌더링할 때 객체를 잘못 사용하는 경우:
1. `key` prop에 객체 전체를 전달 (예: `key={category}`)
2. JSX에서 객체를 직접 렌더링 (예: `{category}`)

### 해결 방법

#### ❌ 잘못된 코드:
```typescript
{categories.map((category) => (
  <button key={category}>  {/* 객체를 key로 사용 */}
    {category}  {/* 객체를 직접 렌더링 */}
  </button>
))}
```

#### ✅ 올바른 코드:
```typescript
{categories.map((category) => (
  <button key={category.key}>  {/* 문자열/숫자를 key로 사용 */}
    {category.label}  {/* 문자열을 렌더링 */}
  </button>
))}
```

#### 주요 원칙:
1. **key prop**: 항상 고유한 문자열/숫자 사용
2. **렌더링**: JSX 안에서는 문자열, 숫자, React 요소만 가능
3. **객체 표시**: `{JSON.stringify(obj)}` 또는 객체의 특정 속성만 표시

---

## 6. 빌드 오류

### 증상
```
Type error: ...
Module not found: ...
```

### 해결 방법

1. **의존성 재설치**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript 오류**
   ```bash
   # 타입 체크
   npm run type-check
   
   # 자동 수정 가능한 항목
   npm run lint -- --fix
   ```

3. **캐시 삭제**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

## 7. 개발 서버 포트 충돌

### 증상
```
Port 3000 is already in use
```

### 해결 방법

#### Windows:
```powershell
# 3000 포트 사용 프로세스 찾기
netstat -ano | findstr :3000

# PID로 프로세스 종료
taskkill /PID <PID> /F
```

#### Mac/Linux:
```bash
# 3000 포트 사용 프로세스 찾기
lsof -i :3000

# 프로세스 종료
kill -9 <PID>
```

#### 또는 다른 포트 사용:
```bash
PORT=3001 npm run dev
```

---

## 8. 로그 확인 방법

### 브라우저 개발자 도구
1. F12 키 또는 우클릭 → 검사
2. Console 탭: JavaScript 오류 확인
3. Network 탭: API 요청/응답 확인

### Supabase 로그
1. Dashboard → Logs → API
2. 실시간 요청/오류 확인

### Next.js 서버 로그
- 터미널에서 `npm run dev` 실행 중 출력 확인

---

## 9. 자주 묻는 질문 (FAQ)

### Q: RLS를 완전히 비활성화해도 되나요?
**A:** 개발 중에는 가능하지만, 프로덕션에서는 절대 비활성화하지 마세요. RLS는 중요한 보안 기능입니다.

### Q: contacts 테이블에 데이터가 안 보여요
**A:** 
1. RLS 정책 확인
2. SQL Editor에서 직접 조회: `SELECT * FROM contacts;`
3. 정책을 우회해서 확인: `SELECT * FROM contacts` (RLS 없이)

### Q: 관리자와 일반 사용자의 차이는?
**A:**
- **관리자**: 모든 문의 조회/삭제 가능, /admin 페이지 접근 가능
- **일반 사용자**: 자신의 문의만 조회 가능, /mypage 페이지 접근 가능

### Q: 이메일 전송은 필수인가요?
**A:** 아니요. Supabase에 데이터는 저장되므로 이메일 없이도 작동합니다. 이메일은 알림 용도입니다.

---

## 10. 긴급 복구 방법

### 모든 게 망가졌을 때:

```bash
# 1. 클린 시작
rm -rf node_modules .next package-lock.json
npm install

# 2. 환경 변수 재확인
cat .env.local

# 3. Supabase 재설정
# supabase-setup.sql 파일의 모든 SQL을 다시 실행

# 4. 개발 서버 재시작
npm run dev
```

---

## 📞 추가 도움이 필요하신가요?

1. **공식 문서 확인**
   - Next.js: https://nextjs.org/docs
   - Supabase: https://supabase.com/docs
   - Framer Motion: https://www.framer.com/motion/

2. **GitHub Issues 확인**
   - 프로젝트 저장소의 Issues 탭

3. **커뮤니티 질문**
   - Stack Overflow
   - Supabase Discord
   - Next.js Discord

---

**마지막 업데이트: 2025-11-03**

