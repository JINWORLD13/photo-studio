-- ======================================
-- 🔐 로그인 필수 문의 RLS 정책
-- ======================================
-- 
-- 목적: 로그인한 사용자만 문의 작성 및 조회 가능
-- 
-- 작동 방식:
-- 1. 문의 작성: 로그인한 사용자만 가능 (user_id 필수)
-- 2. 문의 조회: 본인이 작성한 문의만 조회 가능
-- 3. 비로그인 문의: 불가능 (로그인 페이지로 리다이렉트)
-- 
-- 실행 방법:
-- 1. Supabase Dashboard > SQL Editor
-- 2. 이 파일 내용 복사 & 붙여넣기
-- 3. Run 버튼 클릭
-- ======================================

-- Step 1: 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can view own contacts or anonymous" ON contacts;
DROP POLICY IF EXISTS "Users can view own contacts by user_id or email" ON contacts;
DROP POLICY IF EXISTS "Anyone can insert contacts" ON contacts;

-- Step 2: 사용자는 본인의 문의만 조회 가능
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id);

-- Step 3: 로그인한 사용자만 문의 작성 가능
CREATE POLICY "Authenticated users can insert contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Step 4: 관리자는 모든 문의 조회 가능
DROP POLICY IF EXISTS "Admins can view all contacts" ON contacts;
CREATE POLICY "Admins can view all contacts"
  ON contacts FOR SELECT
  USING (
    (auth.jwt()->'user_metadata'->>'role') = 'admin'
  );

-- Step 5: 관리자는 문의 삭제 가능
DROP POLICY IF EXISTS "Admins can delete contacts" ON contacts;
CREATE POLICY "Admins can delete contacts"
  ON contacts FOR DELETE
  USING (
    (auth.jwt()->'user_metadata'->>'role') = 'admin'
  );

-- ======================================
-- ✅ 정책 확인
-- ======================================
-- 아래 쿼리로 정책이 제대로 생성되었는지 확인하세요

SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'contacts';

-- ======================================
-- 🧪 테스트 방법
-- ======================================
-- 
-- 1. 비로그인 문의 작성 테스트:
--    - /contact 페이지에서 로그아웃 상태로 문의 작성
--    - email: test@example.com 사용
-- 
-- 2. 로그인 후 조회 테스트:
--    - test@example.com으로 회원가입/로그인
--    - /mypage에서 문의 내역 확인
--    - 비로그인으로 작성한 문의가 보여야 함!
-- 
-- ======================================

