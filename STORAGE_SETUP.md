# 📸 Supabase Storage 설정 가이드

## Storage 버킷이 필요한 이유
관리자 페이지에서 포트폴리오 이미지를 업로드할 때 Supabase Storage에 저장됩니다.

## 설정 방법

### 1단계: Storage 버킷 생성

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. 좌측 메뉴에서 **Storage** 클릭
4. **New bucket** 버튼 클릭
5. 버킷 설정:
   - **Name**: `portfolio-images`
   - **Public bucket**: ✅ 체크 (중요!)
   - **File size limit**: 50MB (선택사항)
   - **Allowed MIME types**: `image/*` (선택사항)
6. **Create bucket** 클릭

### 2단계: Storage 정책 설정 (SQL)

SQL Editor로 이동하여 아래 쿼리 실행:

```sql
-- 누구나 포트폴리오 이미지 조회 가능
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio-images' );

-- 관리자만 이미지 업로드 가능
CREATE POLICY "Admin can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-images' AND (
    (auth.jwt()->>'role') = 'admin' OR
    (auth.jwt()->'user_metadata'->>'role') = 'admin'
  )
);

-- 관리자만 이미지 업데이트 가능
CREATE POLICY "Admin can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio-images' AND (
    (auth.jwt()->>'role') = 'admin' OR
    (auth.jwt()->'user_metadata'->>'role') = 'admin'
  )
);

-- 관리자만 이미지 삭제 가능
CREATE POLICY "Admin can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio-images' AND (
    (auth.jwt()->>'role') = 'admin' OR
    (auth.jwt()->'user_metadata'->>'role') = 'admin'
  )
);
```

### 3단계: 확인

1. Storage > portfolio-images 버킷 클릭
2. Public URL 형식 확인:
   ```
   https://[your-project-ref].supabase.co/storage/v1/object/public/portfolio-images/[filename]
   ```

## Dashboard에서 정책 설정 (SQL 대신)

SQL을 사용하지 않고 Dashboard에서도 설정 가능:

1. **Storage** > **portfolio-images** 버킷 클릭
2. **Policies** 탭 선택
3. 각 정책 추가:

#### SELECT 정책 (읽기)
- **Policy name**: Public Access
- **Policy definition**: `true`
- **Target roles**: public

#### INSERT 정책 (업로드)
- **Policy name**: Admin can upload
- **Policy definition**: 
  ```
  (auth.jwt()->>'role') = 'admin' OR
  (auth.jwt()->'user_metadata'->>'role') = 'admin'
  ```
- **Target roles**: authenticated

#### UPDATE & DELETE 정책
- 위와 동일한 방식으로 설정

## 테스트

### 관리자 페이지에서 테스트
1. `/admin/portfolio` 접속
2. 관리자로 로그인
3. "새 작품 추가" 클릭
4. 이미지 업로드 테스트

### 에러가 발생한다면

#### "new row violates row-level security policy"
→ Storage 정책이 제대로 설정되지 않음. 위 정책을 다시 확인

#### "Bucket not found"
→ 버킷 이름이 `portfolio-images`인지 확인

#### "The resource already exists"
→ 정책이 이미 존재함. 기존 정책을 삭제하고 다시 생성:
```sql
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete" ON storage.objects;
```

## 프로필 이미지 Storage (추가)

사용자 프로필 이미지도 필요하다면:

1. 새 버킷 생성: `profile-images`
2. Public bucket으로 설정
3. 정책 설정 (위와 유사하게)

## 완료 체크리스트

- [ ] `portfolio-images` 버킷 생성 완료
- [ ] Public bucket으로 설정 완료
- [ ] Storage 정책 4개 생성 완료 (SELECT, INSERT, UPDATE, DELETE)
- [ ] 관리자 페이지에서 이미지 업로드 테스트 성공
- [ ] 일반 사용자 페이지에서 이미지 조회 테스트 성공

