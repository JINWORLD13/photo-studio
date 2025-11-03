/**
 * 관리자 인증 및 보안 유틸리티
 * 
 * 기능:
 * 1. 이메일 화이트리스트 체크
 * 2. 관리자 권한 확인
 * 3. 보안 강화
 */

import { User } from '@supabase/supabase-js';

/**
 * 환경 변수에서 관리자 이메일 목록 가져오기
 */
export function getAdminEmails(): string[] {
  const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  
  if (!adminEmailsEnv) {
    return [];
  }
  
  // 쉼표로 구분된 이메일들을 배열로 변환
  return adminEmailsEnv
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);
}

/**
 * 특정 이메일이 관리자 화이트리스트에 있는지 확인
 */
export function isEmailInWhitelist(email: string): boolean {
  const adminEmails = getAdminEmails();
  
  // 화이트리스트가 비어있으면 모든 이메일 허용 (기본값)
  if (adminEmails.length === 0) {
    return true;
  }
  
  return adminEmails.includes(email.toLowerCase());
}

/**
 * 사용자가 관리자인지 확인
 * 
 * 체크 순서:
 * 1. 이메일 화이트리스트 확인 (최우선)
 * 2. Supabase user_metadata.role 확인
 * 3. Supabase app_metadata.role 확인
 */
export function checkIsAdmin(user: User | null): boolean {
  if (!user) {
    return false;
  }
  
  const email = user.email || '';
  
  // 1. 이메일 화이트리스트 체크 (환경 변수)
  const adminEmails = getAdminEmails();
  if (adminEmails.length > 0) {
    return isEmailInWhitelist(email);
  }
  
  // 2. Supabase metadata role 체크 (기존 방식)
  const role = user.user_metadata?.role || user.app_metadata?.role;
  
  // kingofphotostudio role만 허용
  const allowedRoles = ['kingofphotostudio'];
  return allowedRoles.includes(role);
}

/**
 * 관리자 페이지 경로 가져오기
 * 환경 변수에 설정되어 있으면 사용, 없으면 기본값
 */
export function getAdminPath(): string {
  return process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin';
}

/**
 * 관리자 페이지 전체 URL 가져오기
 */
export function getAdminUrl(): string {
  return `/${getAdminPath()}`;
}

/**
 * 포트폴리오 관리 페이지 URL
 */
export function getPortfolioAdminUrl(): string {
  return `/${getAdminPath()}/portfolio`;
}

/**
 * 관리자 권한 에러 메시지
 */
export const ADMIN_ERROR_MESSAGES = {
  notLoggedIn: '로그인이 필요합니다.',
  notAdmin: '관리자 권한이 없습니다. 승인된 이메일로 로그인하세요.',
  sessionExpired: '세션이 만료되었습니다. 다시 로그인하세요.',
  tooManyAttempts: '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도하세요.',
} as const;

/**
 * 관리자 로그 기록 (선택사항)
 */
export function logAdminAction(
  action: string,
  user: User | null,
  details?: Record<string, any>
) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[ADMIN ACTION]', {
      timestamp: new Date().toISOString(),
      action,
      user: user?.email || 'anonymous',
      ...details,
    });
  }
  
  // 프로덕션에서는 실제 로깅 서비스로 전송 가능
  // 예: Sentry, LogRocket, 또는 Supabase 테이블에 저장
}

