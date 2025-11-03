# 🚀 자동 이미지 업로드 스크립트

> **한 번의 명령으로 모든 샘플 포트폴리오 이미지를 Supabase에 자동 업로드!**

---

## ⚡ 빠른 시작 (3단계)

### 1️⃣ Supabase 설정 확인

```bash
# .env.local 파일에 다음이 있는지 확인:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 2️⃣ Storage Bucket 생성

1. Supabase Dashboard > Storage
2. "New bucket" 클릭
3. 이름: `portfolio-images`
4. Public bucket: ✅ 체크
5. Create!

### 3️⃣ 스크립트 실행

```bash
# 프로젝트 루트에서 실행
node scripts/download-and-upload-images.js
```

**완료!** 🎉

---

## 📸 업로드되는 이미지

이 스크립트는 **9개의 고품질 샘플 이미지**를 자동으로 업로드합니다:

| 카테고리 | 개수 | 설명 |
|---------|------|------|
| 웨딩 (wedding) | 3개 | 봄날의 웨딩, 로맨틱 웨딩, 클래식 웨딩 |
| 커플 (couple) | 2개 | 커플 데이트, 로맨틱 커플 |
| 프로필 (profile) | 2개 | 비즈니스 프로필, 여성 프로필 |
| 가족 (family) | 1개 | 가족 사진 |
| 제품 (product) | 1개 | 제품 촬영 |

---

## 🔧 작동 원리

```
1. Unsplash에서 이미지 다운로드
   ↓
2. 임시 폴더(temp_images/)에 저장
   ↓
3. Supabase Storage에 업로드
   ↓
4. portfolios 테이블에 정보 저장
   ↓
5. 임시 파일 삭제
   ↓
완료!
```

---

## 📋 실행 예시

```bash
$ node scripts/download-and-upload-images.js

🚀 포트폴리오 이미지 자동 업로드 시작!

총 9개의 이미지를 처리합니다.

[1/9] 봄날의 웨딩
카테고리: wedding
  📥 다운로드 중: wedding-1701234567890-0.jpg...
  ✅ 다운로드 완료: wedding-1701234567890-0.jpg
  📤 Supabase 업로드 중: public/wedding/wedding-1701234567890-0.jpg...
  ✅ 업로드 완료!
  💾 DB 저장 중: 봄날의 웨딩...
  ✅ DB 저장 완료!
✨ 완료!

[2/9] 로맨틱 웨딩
...

==================================================
🎉 처리 완료!
✅ 성공: 9개
❌ 실패: 0개
==================================================

✨ 이제 http://localhost:3000/portfolio 에서 확인하세요!
```

---

## ❌ 문제 해결

### 에러 1: "Supabase 설정을 찾을 수 없습니다"

**원인:** `.env.local` 파일이 없거나 설정이 누락됨

**해결:**
```bash
# .env.local 파일 확인
cat .env.local

# 없으면 생성:
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

### 에러 2: "Bucket not found"

**원인:** `portfolio-images` 버킷이 없음

**해결:**
1. Supabase Dashboard > Storage
2. "New bucket" > 이름: `portfolio-images` > Public 체크
3. 스크립트 다시 실행

---

### 에러 3: "The resource already exists"

**원인:** 이미 업로드된 이미지가 있음

**해결:** 
- 스크립트가 자동으로 덮어쓰기(`upsert: true`)
- 걱정하지 마세요! 정상 작동합니다

---

### 에러 4: "RLS policy violation"

**원인:** Storage 정책이 설정되지 않음

**해결:**
```bash
# STORAGE_SETUP.sql 실행
# Supabase Dashboard > SQL Editor에서 실행
```

---

## 🎯 고급 사용법

### 이미지 추가하기

`download-and-upload-images.js` 파일 수정:

```javascript
const portfolioImages = [
  // 기존 이미지들...
  
  // 새 이미지 추가
  {
    url: 'https://images.unsplash.com/photo-YOUR-IMAGE-ID?w=1200',
    category: 'wedding',
    title: '새로운 웨딩',
    description: '멋진 웨딩 사진',
  },
];
```

### 카테고리 변경하기

`category` 값은 다음 중 하나여야 합니다:
- `wedding` (웨딩)
- `couple` (커플)
- `profile` (프로필)
- `family` (가족)
- `product` (제품)

---

## 📁 생성되는 파일 구조

### Supabase Storage:
```
portfolio-images/
├── public/
│   ├── wedding/
│   │   ├── wedding-1701234567890-0.jpg
│   │   ├── wedding-1701234567891-1.jpg
│   │   └── wedding-1701234567892-2.jpg
│   ├── couple/
│   │   ├── couple-1701234567893-3.jpg
│   │   └── couple-1701234567894-4.jpg
│   ├── profile/
│   ├── family/
│   └── product/
```

### DB (portfolios 테이블):
```sql
id | title | category | description | image_url | created_at
---|-------|----------|-------------|-----------|------------
1  | 봄날의 웨딩 | wedding | 아름다운... | https://... | 2024-...
2  | 로맨틱 웨딩 | wedding | 감성 가득... | https://... | 2024-...
...
```

---

## 🧹 정리

### 임시 파일 삭제

스크립트가 자동으로 삭제하지만, 수동으로 삭제하려면:

```bash
rm -rf temp_images/
```

### 업로드한 이미지 모두 삭제

```sql
-- DB에서 삭제
DELETE FROM portfolios;

-- Storage에서 삭제는 Dashboard에서 수동으로
-- Storage > portfolio-images > public > 파일 선택 > Delete
```

---

## 💡 팁

1. **인터넷 연결 확인**
   - Unsplash에서 다운로드하므로 인터넷 필요

2. **처리 시간**
   - 이미지당 약 2-3초
   - 총 9개 = 약 20-30초 소요

3. **반복 실행 가능**
   - `upsert: true`로 설정되어 있어 여러 번 실행해도 OK
   - 기존 파일은 덮어씌워짐

4. **실제 사진으로 교체**
   - 나중에 관리자 페이지(`/admin/portfolio`)에서
   - 샘플 이미지를 삭제하고 실제 사진 업로드

---

## 🎉 완료 확인

### 1. Supabase Dashboard
```
Storage > portfolio-images > public
→ wedding, couple, profile 등 폴더에 이미지 있음
```

### 2. DB 확인
```
Table Editor > portfolios
→ 9개의 레코드 생성됨
```

### 3. 웹사이트 확인
```
http://localhost:3000/portfolio
→ 샘플 이미지들이 표시됨!
```

---

**이제 샘플 포트폴리오가 준비되었습니다!** 🎊📸

