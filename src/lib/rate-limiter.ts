/**
 * 로그인 시도 제한 (Rate Limiting)
 * Brute Force 공격 방지
 */

interface LoginAttempt {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const STORAGE_KEY = "login_attempts";
const MAX_ATTEMPTS = 5; // 최대 시도 횟수
const TIME_WINDOW = 5 * 60 * 1000; // 5분 (밀리초)
const BLOCK_DURATION = 15 * 60 * 1000; // 15분 차단

/**
 * localStorage에서 로그인 시도 기록 가져오기
 */
function getAttempts(identifier: string): LoginAttempt | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${identifier}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * localStorage에 로그인 시도 기록 저장
 */
function setAttempts(identifier: string, attempts: LoginAttempt): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      `${STORAGE_KEY}_${identifier}`,
      JSON.stringify(attempts)
    );
  } catch {
    // localStorage 사용 불가 시 무시
  }
}

/**
 * 로그인 시도 기록 초기화
 */
function clearAttempts(identifier: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(`${STORAGE_KEY}_${identifier}`);
  } catch {
    // 무시
  }
}

/**
 * 현재 차단되어 있는지 확인
 */
export function isBlocked(identifier: string): {
  blocked: boolean;
  remainingTime?: number;
  message?: string;
} {
  const attempts = getAttempts(identifier);

  if (!attempts) {
    return { blocked: false };
  }

  const now = Date.now();

  // 차단 기간이 설정되어 있고 아직 차단 중인 경우
  if (attempts.blockedUntil && attempts.blockedUntil > now) {
    const remainingTime = Math.ceil((attempts.blockedUntil - now) / 1000 / 60); // 분 단위
    return {
      blocked: true,
      remainingTime,
      message: `너무 많은 로그인 시도가 있었습니다. ${remainingTime}분 후에 다시 시도하세요.`,
    };
  }

  // 차단 기간이 지났으면 기록 초기화
  if (attempts.blockedUntil && attempts.blockedUntil <= now) {
    clearAttempts(identifier);
    return { blocked: false };
  }

  return { blocked: false };
}

/**
 * 로그인 실패 기록
 */
export function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const attempts = getAttempts(identifier);

  if (!attempts) {
    // 첫 번째 실패
    setAttempts(identifier, {
      count: 1,
      firstAttempt: now,
    });
    return;
  }

  // 시간 창이 지났으면 초기화
  if (now - attempts.firstAttempt > TIME_WINDOW) {
    setAttempts(identifier, {
      count: 1,
      firstAttempt: now,
    });
    return;
  }

  // 시도 횟수 증가
  const newCount = attempts.count + 1;

  // 최대 시도 횟수 초과 시 차단
  if (newCount >= MAX_ATTEMPTS) {
    setAttempts(identifier, {
      count: newCount,
      firstAttempt: attempts.firstAttempt,
      blockedUntil: now + BLOCK_DURATION,
    });
    return;
  }

  setAttempts(identifier, {
    count: newCount,
    firstAttempt: attempts.firstAttempt,
  });
}

/**
 * 로그인 성공 시 기록 초기화
 */
export function recordSuccessfulLogin(identifier: string): void {
  clearAttempts(identifier);
}

/**
 * 남은 시도 횟수 확인
 */
export function getRemainingAttempts(identifier: string): number {
  const blockStatus = isBlocked(identifier);
  if (blockStatus.blocked) {
    return 0;
  }

  const attempts = getAttempts(identifier);
  if (!attempts) {
    return MAX_ATTEMPTS;
  }

  const now = Date.now();

  // 시간 창이 지났으면 전체 리셋
  if (now - attempts.firstAttempt > TIME_WINDOW) {
    return MAX_ATTEMPTS;
  }

  return Math.max(0, MAX_ATTEMPTS - attempts.count);
}

/**
 * IP 주소 기반 식별자 생성 (선택사항)
 * 클라이언트 사이드에서는 정확한 IP를 얻을 수 없으므로
 * 서버 사이드 API에서 사용
 */
export function getClientIdentifier(email?: string): string {
  // 이메일이 있으면 이메일 기반, 없으면 브라우저 fingerprint
  if (email) {
    return email.toLowerCase();
  }

  // 간단한 브라우저 fingerprint (완벽하지 않음)
  if (typeof window !== "undefined") {
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
    ].join("|");

    // 간단한 해시 함수
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return `browser_${hash}`;
  }

  return "unknown";
}
