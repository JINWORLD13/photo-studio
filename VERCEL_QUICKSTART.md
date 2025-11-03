# ⚡ Vercel 배포 빠른 시작 가이드

5분 만에 무료로 배포하기!

---

## 🎯 3단계로 끝내는 배포

### 1️⃣ GitHub에 업로드 (2분)

```bash
# 프로젝트 폴더에서 실행
cd photo-studio

# Git 초기화
git init
git add .
git commit -m "Initial commit"

# GitHub 리포지토리 생성 후 (https://github.com/new)
git remote add origin https://github.com/당신의사용자명/photo-studio.git
git branch -M main
git push -u origin main
```

✅ **완료!** GitHub에 코드가 업로드되었습니다.

---

### 2️⃣ Vercel에 연결 (1분)

1. **https://vercel.com** 접속
2. **"Sign Up with GitHub"** 클릭
3. **"Import Project"** 클릭
4. **photo-studio 리포지토리 선택**
5. **"Import"** 클릭

✅ **완료!** Vercel이 프로젝트를 인식했습니다.

---

### 3️⃣ 환경 변수 설정 (2분)

**Environment Variables** 섹션에서 다음을 추가:

```bash
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Gmail (필수 - 문의 기능용)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# 관리자 설정 (선택)
NEXT_PUBLIC_ADMIN_EMAILS=admin@domain.com
NEXT_PUBLIC_ADMIN_PATH=my_secret_admin_2024
```

**"Deploy"** 버튼 클릭!

✅ **완료!** 2-5분 후 사이트가 배포됩니다.

---

## 🎉 배포 완료!

```
✓ Build succeeded
✓ Deployment ready
🌐 https://your-project.vercel.app
```

**"Visit"** 버튼을 눌러 사이트를 확인하세요!

---

## 📝 환경 변수 찾는 곳

### Supabase 키 찾기:

1. https://supabase.com/dashboard 로그인
2. 프로젝트 선택
3. **Settings → API**
4. **Project URL** 복사 → `NEXT_PUBLIC_SUPABASE_URL`
5. **anon public** 키 복사 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Gmail 앱 비밀번호:

- `GMAIL_SETUP.md` 파일 참조
- 또는 https://myaccount.google.com/apppasswords

---

## 🔄 업데이트 방법

코드를 수정하면 자동으로 재배포됩니다:

```bash
# 코드 수정 후
git add .
git commit -m "업데이트 내용"
git push origin main
```

→ Vercel이 자동으로 감지하고 재배포! 🚀

---

## ❗ 문제 해결

### 빌드 실패?

```bash
# 로컬에서 먼저 테스트
npm install
npm run build
```

### 사이트가 안 열려요?

- Vercel 대시보드에서 빌드 로그 확인
- 환경 변수가 모두 입력되었는지 확인

### 이미지가 안 나와요?

- Supabase Storage 버킷이 **public**인지 확인
- RLS 정책 확인

---

## 📚 더 자세한 가이드

완전한 배포 가이드는 `DEPLOYMENT_GUIDE.md`를 참조하세요.

- 커스텀 도메인 설정
- 보안 설정
- 성능 모니터링
- FAQ

---

**준비 완료!** 🚀 이제 배포를 시작하세요!
cd photo-studio

# 1. 새로운 고아 브랜치 생성
git checkout --orphan latest_branch

# 2. 모든 파일 스테이징
git add -A

# 3. 새로운 초기 커밋
git commit -m "Initial commit"

# 4. 기존 main 브랜치 삭제
git branch -D main

# 5. 현재 브랜치 이름을 main으로 변경
git branch -m main

# 6. 원격 저장소에 강제 푸시
git push -f origin main