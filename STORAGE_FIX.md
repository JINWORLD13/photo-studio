# 🔧 포트폴리오 이미지가 안 보이는 문제 해결

## 문제 증상
- 관리자 페이지에서 포트폴리오 이미지가 검은색으로 표시됨
- 이미지 업로드는 되는데 화면에 안 보임

## 원인
Supabase Storage 버킷이 제대로 설정되지 않았거나, Public 접근 권한이 없어서 발생합니다.

---

## ✅ 해결 방법

### 1단계: Supabase Dashboard 접속

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. 좌측 메뉴에서 **Storage** 클릭

### 2단계: 버킷 확인 및 생성

**버킷이 이미 있는 경우:**
1. `portfolio-images` 버킷 찾기
2. 버킷 이름 옆 ⚙️ 설정 아이콘 클릭
3. **Public bucket** 옵션이 체크되어 있는지 확인
4. 체크되어 있지 않다면 체크하고 저장

**버킷이 없는 경우:**
1. **New bucket** 버튼 클릭
2. 다음 내용 입력:
   - **Name**: `portfolio-images`
   - **Public bucket**: ✅ **반드시 체크!** (이게 중요!)
   - **File size limit**: 50MB (선택사항)
   - **Allowed MIME types**: `image/*` (선택사항)
3. **Create bucket** 클릭

### 3단계: Storage 정책(RLS) 설정

1. 좌측 메뉴에서 **SQL Editor** 클릭
2. **New query** 클릭
3. 아래 SQL 복사해서 붙여넣기:

```sql
-- 📸 Storage 보안 정책 설정

-- 1. 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Public can view portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete" ON storage.objects;

-- 2. 새로운 정책 생성

-- 📖 누구나 포트폴리오 이미지 조회 가능 (Public Read)
CREATE POLICY "Public can view portfolio images"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

-- 📤 관리자만 이미지 업로드 가능
CREATE POLICY "Admin can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-images' AND
  (
    (auth.jwt()->>'role') = 'admin' OR
    (auth.jwt()->'user_metadata'->>'role') = 'admin'
  )
);

-- ✏️ 관리자만 이미지 수정 가능
CREATE POLICY "Admin can update portfolio images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio-images' AND
  (
    (auth.jwt()->>'role') = 'admin' OR
    (auth.jwt()->'user_metadata'->>'role') = 'admin'
  )
);

-- 🗑️ 관리자만 이미지 삭제 가능
CREATE POLICY "Admin can delete portfolio images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio-images' AND
  (
    (auth.jwt()->>'role') = 'admin' OR
    (auth.jwt()->'user_metadata'->>'role') = 'admin'
  )
);
```

4. **Run** 버튼 클릭 (또는 Ctrl+Enter)
5. 성공 메시지 확인: `Success. No rows returned`

### 4단계: 확인

1. 브라우저에서 관리자 페이지 새로고침 (F5)
2. 포트폴리오 이미지가 제대로 보이는지 확인

---

## 🧪 테스트 방법

### 방법 1: 브라우저 콘솔 확인

1. 관리자 페이지에서 F12 (개발자 도구)
2. Console 탭 확인
3. 다음 메시지가 보이면 성공:
   ```
   ✅ Image loaded successfully: https://xxx.supabase.co/...
   ```

### 방법 2: 이미지 URL 직접 접속

1. 관리자 페이지에서 이미지 위에 마우스 우클릭
2. "이미지 주소 복사" 선택
3. 새 탭에서 해당 URL 붙여넣고 접속
4. 이미지가 보이면 성공!

---

## ❌ 여전히 안 된다면?

### 체크리스트:

- [ ] Storage 버킷 이름이 정확히 `portfolio-images` 인가?
- [ ] Public bucket 옵션이 체크되어 있나?
- [ ] SQL 정책이 에러 없이 실행되었나?
- [ ] 관리자 계정으로 로그인했나?
- [ ] 브라우저 캐시를 지우고 다시 시도했나? (Ctrl+Shift+Delete)

### 추가 확인 사항:

#### 1. Storage 정책 확인

Supabase Dashboard에서:
1. **Storage** > `portfolio-images` 버킷 선택
2. **Policies** 탭 클릭
3. 다음 4개의 정책이 있는지 확인:
   - ✅ Public can view portfolio images (SELECT)
   - ✅ Admin can upload portfolio images (INSERT)
   - ✅ Admin can update portfolio images (UPDATE)
   - ✅ Admin can delete portfolio images (DELETE)

#### 2. 이미지 URL 형식 확인

올바른 형식:
```
https://[your-project-id].supabase.co/storage/v1/object/public/portfolio-images/[filename].jpg
```

잘못된 형식:
```
https://[your-project-id].supabase.co/storage/v1/object/portfolio-images/[filename].jpg
(public 누락)
```

#### 3. 네트워크 에러 확인

F12 > Network 탭에서:
- 이미지 요청의 상태 코드 확인
- 200 ✅ 정상
- 403 ❌ 권한 없음 → Storage 정책 재설정
- 404 ❌ 파일 없음 → 이미지 재업로드

---

## 💡 추가 팁

### 기존 이미지 다시 업로드하기

정책 설정 전에 업로드한 이미지는 제대로 안 보일 수 있습니다.
다음과 같이 해보세요:

1. 관리자 페이지에서 기존 포트폴리오 삭제
2. Storage 정책 설정 완료 후
3. 새로 업로드

### 샘플 이미지 자동 업로드

테스트용 샘플 이미지가 필요하다면:

```bash
# Supabase Dashboard에서 SQL Editor 실행
# INSERT_SAMPLE_PORTFOLIOS.sql 파일 내용 실행
```

이 파일은 Unsplash 이미지 URL을 사용하므로 Storage 설정 없이도 작동합니다.

---

## 🎉 완료!

이제 포트폴리오 이미지가 제대로 보일 것입니다!

