# 📧 Gmail API 설정 가이드

Gmail을 통해 **완전 무료**로 문의 알림 이메일을 받을 수 있습니다!

---

## ✅ 장점

- 💰 **완전 무료** (하루 500통, 월 15,000통)
- 🚀 **빠른 전송** (Google 인프라)
- 🔒 **안전함** (Gmail 보안)
- ⏰ **영구 무료** (추가 비용 없음)

---

## 🎯 설정 방법 (5분!)

### 1️⃣ Gmail 앱 비밀번호 생성 (3분)

#### **Step 1: 2단계 인증 활성화**

1. Gmail 계정으로 이동
2. Google 계정 관리: https://myaccount.google.com
3. 왼쪽 메뉴: **보안** 클릭
4. **2단계 인증** 찾기
5. **2단계 인증 사용** 버튼 클릭
6. 안내에 따라 설정 (휴대폰 인증)

**✅ 2단계 인증이 이미 활성화되어 있다면 다음 단계로!**

---

#### **Step 2: 앱 비밀번호 생성**

1. Google 계정 관리 > **보안** 페이지에서
2. **앱 비밀번호** 검색 (검색창에 "앱 비밀번호" 입력)
3. 또는 직접 이동: https://my지account.google.com/apppasswords
4. **앱 비밀번호 만들기** 클릭
5. 앱 이름: `Moment Snap` 입력
6. **만들기** 클릭
7. **16자리 비밀번호 복사** (예: `abcd efgh ijkl mnop`)

```
⚠️ 중요: 이 비밀번호는 다시 볼 수 없습니다!
지금 바로 메모장에 복사해두세요!
```

---

### 2️⃣ .env.local 파일 수정 (2분)

프로젝트 폴더에서 `.env.local` 파일을 열고 다음을 수정:

```bash
# Gmail 설정
GMAIL_USER=your-email@gmail.com          # ← 여기에 Gmail 주소 입력
GMAIL_APP_PASSWORD=abcdefghijklmnop      # ← 생성한 16자리 앱 비밀번호 (공백 제거)
```

**예시:**

```bash
GMAIL_USER=momentsnap@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**⚠️ 주의:**

- 앱 비밀번호에서 **공백을 제거**하세요
- `abcd efgh ijkl mnop` → `abcdefghijklmnop`

---

### 3️⃣ 개발 서버 재시작

```bash
# 터미널에서 Ctrl+C로 서버 중지 후
npm run dev
```

---

## ✅ 테스트

### 1. 브라우저에서 테스트

1. http://localhost:3000/contact 접속
2. 문의 폼 작성
3. 전송 버튼 클릭
4. **Gmail 받은편지함 확인!** 📧

---

### 2. 예상 결과

#### ✅ 성공 시:

```
✓ "문의가 성공적으로 접수되었습니다!" 메시지
✓ Gmail로 알림 메일 도착
✓ 관리자 페이지에서도 확인 가능
```

#### ❌ 실패 시:

```
✗ "문의 전송에 실패했습니다" 메시지
→ .env.local 파일 확인
→ 앱 비밀번호 다시 생성
→ 개발 서버 재시작
```

---

## 🎨 받는 이메일 형식

Gmail로 받는 이메일은 이렇게 보입니다:

```
제목: [Moment Snap] 새 문의: 홍길동

──────────────────────────
📸 새로운 문의가 도착했습니다

고객 정보
이름: 홍길동
이메일: customer@example.com
연락처: 010-1234-5678
관심 서비스: 웨딩스냅

문의 내용
다음 달 결혼식 스냅 촬영을
의뢰하고 싶습니다...
──────────────────────────
```

**깔끔하고 전문적이죠?** ✨

---

## 🔧 문제 해결

### Q1. "Invalid login: 535-5.7.8 Username and Password not accepted"

**원인:** 앱 비밀번호가 잘못되었거나 2단계 인증이 안 되어 있음

**해결:**

1. 2단계 인증이 활성화되어 있는지 확인
2. 앱 비밀번호를 새로 생성
3. 공백 없이 입력했는지 확인
4. `.env.local` 저장 후 서버 재시작

---

### Q2. "Missing credentials for 'PLAIN'"

**원인:** `.env.local` 파일에 값이 없음

**해결:**

```bash
# .env.local 파일 확인
GMAIL_USER=your-email@gmail.com  # ← 실제 이메일로 수정했나요?
GMAIL_APP_PASSWORD=abcdefgh...    # ← 앱 비밀번호 입력했나요?
```

---

### Q3. 이메일이 안 와요!

**확인사항:**

1. **스팸 폴더** 확인
2. Gmail 앱 비밀번호 다시 생성
3. `.env.local` 파일의 `GMAIL_USER` 확인 (받을 이메일 주소)
4. 개발 서버 재시작
5. 브라우저 콘솔에서 에러 메시지 확인 (F12)

---

### Q4. 앱 비밀번호 메뉴가 안 보여요!

**원인:** 2단계 인증이 비활성화되어 있음

**해결:**

1. Google 계정 관리 > 보안
2. 2단계 인증 활성화
3. 인증 완료 후 앱 비밀번호 메뉴 나타남

---

## 💡 추가 설정 (선택사항)

### 여러 이메일로 알림 받기

`.env.local` 파일 수정:

```bash
# 쉼표로 구분하여 여러 이메일 추가
GMAIL_RECIPIENTS=owner@example.com,manager@example.com
```

그리고 `src/app/api/send-email/route.ts` 수정:

```typescript
const mailOptions = {
  from: process.env.GMAIL_USER,
  to: process.env.GMAIL_RECIPIENTS || process.env.GMAIL_USER, // 여러 수신자
  subject: `[Moment Snap] 새 문의: ${name}`,
  // ...
};
```

---

## 📊 비용 및 제한

### 무료 할당량:

```
일일: 500통
월간: 15,000통
연간: 180,000통

현실적으로:
- 월 1,000건 문의: 문제없음 ✅
- 월 10,000건 문의: 여유있음 ✅
- 월 15,000건 초과: 거의 불가능 (하루 500건)
```

### 제한 초과 시:

```
→ 자동으로 다음 날까지 대기
→ 추가 비용 없음
→ 계정 정지 없음
```

---

## 🎯 배포 시 (Vercel)

Vercel 배포 시 환경 변수 설정:

1. Vercel 프로젝트 > **Settings** > **Environment Variables**
2. 다음 변수 추가:
   ```
   GMAIL_USER = your-email@gmail.com
   GMAIL_APP_PASSWORD = your-app-password
   ```
3. **Save** 후 재배포

---

## ✅ 완료 체크리스트

설정이 완료되었는지 확인하세요:

- [ ] 2단계 인증 활성화
- [ ] Gmail 앱 비밀번호 생성
- [ ] `.env.local` 파일 수정 (GMAIL_USER, GMAIL_APP_PASSWORD)
- [ ] 개발 서버 재시작
- [ ] 테스트 문의 전송
- [ ] Gmail 받은편지함 확인

**모두 체크되었나요? 축하합니다! 🎉**

---

## 🆘 여전히 안 되나요?

1. **개발 서버 로그 확인** (터미널)
2. **브라우저 콘솔 확인** (F12)
3. **Gmail 앱 비밀번호 재생성**
4. **다른 Gmail 계정으로 테스트**

---

## 💰 비용 요약

| 항목        | 비용         |
| ----------- | ------------ |
| Gmail API   | **무료**     |
| 하루 500통  | **무료**     |
| 월 15,000통 | **무료**     |
| GCP 비용    | **무료**     |
| 카드 등록   | **불필요**   |
| **총 비용** | **$0/월** ✅ |

**완전 무료입니다!** 🎉

---

**설정 완료 후 `SETUP_GUIDE.md`로 돌아가세요!**
