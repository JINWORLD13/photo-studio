/**
 * 세션 관리 및 자동 로그아웃
 * 일정 시간 동안 활동이 없으면 자동으로 로그아웃
 */

import { supabase } from './supabase';

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15분
const WARNING_TIMEOUT = 10 * 60 * 1000; // 10분 (경고 표시)
const STORAGE_KEY = 'last_activity';

/**
 * 마지막 활동 시간 업데이트
 */
export function updateActivity(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  } catch {
    // localStorage 사용 불가 시 무시
  }
}

/**
 * 마지막 활동 시간 가져오기
 */
export function getLastActivity(): number | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
}

/**
 * 비활성 시간 확인 (밀리초)
 */
export function getInactiveTime(): number {
  const lastActivity = getLastActivity();
  if (!lastActivity) return 0;
  
  return Date.now() - lastActivity;
}

/**
 * 세션이 만료되었는지 확인
 */
export function isSessionExpired(): boolean {
  const inactiveTime = getInactiveTime();
  return inactiveTime > INACTIVITY_TIMEOUT;
}

/**
 * 세션 만료 경고가 필요한지 확인
 */
export function shouldShowWarning(): boolean {
  const inactiveTime = getInactiveTime();
  return inactiveTime > WARNING_TIMEOUT && inactiveTime < INACTIVITY_TIMEOUT;
}

/**
 * 세션 만료까지 남은 시간 (초)
 */
export function getRemainingTime(): number {
  const inactiveTime = getInactiveTime();
  const remaining = INACTIVITY_TIMEOUT - inactiveTime;
  return Math.max(0, Math.floor(remaining / 1000));
}

/**
 * 자동 로그아웃 실행
 */
export async function autoLogout(): Promise<void> {
  try {
    await supabase.auth.signOut();
    
    // 세션 데이터 정리
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    
    // 로그인 페이지로 리다이렉트
    if (typeof window !== 'undefined') {
      window.location.href = '/auth?expired=1';
    }
  } catch (error) {
    console.error('Auto logout failed:', error);
  }
}

/**
 * 세션 모니터링 시작
 * 
 * 사용법:
 * ```tsx
 * useEffect(() => {
 *   const cleanup = startSessionMonitoring();
 *   return cleanup;
 * }, []);
 * ```
 */
export function startSessionMonitoring(
  onWarning?: () => void,
  onExpire?: () => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  
  // 초기 활동 시간 설정
  updateActivity();
  
  // 사용자 활동 감지 이벤트들
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  
  const activityHandler = () => {
    updateActivity();
  };
  
  // 이벤트 리스너 등록
  events.forEach(event => {
    window.addEventListener(event, activityHandler);
  });
  
  // 주기적으로 세션 확인 (10초마다)
  const intervalId = setInterval(() => {
    if (isSessionExpired()) {
      if (onExpire) {
        onExpire();
      } else {
        autoLogout();
      }
    } else if (shouldShowWarning()) {
      if (onWarning) {
        onWarning();
      }
    }
  }, 10000);
  
  // Cleanup 함수 반환
  return () => {
    events.forEach(event => {
      window.removeEventListener(event, activityHandler);
    });
    clearInterval(intervalId);
  };
}

/**
 * 세션 초기화 (로그인 시 호출)
 */
export function initSession(): void {
  updateActivity();
}

/**
 * 세션 종료 (로그아웃 시 호출)
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 무시
  }
}

