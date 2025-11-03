/**
 * 비즈니스 연락처 정보 중앙 관리 파일
 *
 * 이 파일에서 이메일, 전화번호, 주소 등 변경 가능한 정보를 한곳에서 관리합니다.
 * 여기서 수정하면 전체 사이트에 자동으로 반영됩니다.
 */

export const businessInfo = {
  // 비즈니스 기본 정보
  businessName: "Moment Snap",

  // 연락처 정보
  contact: {
    // 한국 연락처
    ko: {
      phone: "010-1234-5678",
      phoneFormatted: "010-1234-5678",
      phoneHref: "tel:010-1234-5678",
      email: "contact@momentsnap.com",
      address: "서울시 강남구 테헤란로",
      businessHours: "평일 10:00 - 18:00",
    },
    // 영어권 연락처
    en: {
      phone: "+82-10-1234-5678",
      phoneFormatted: "+82-10-1234-5678",
      phoneHref: "tel:+82-10-1234-5678",
      email: "contact@momentsnap.com",
      address: "Teheran-ro, Gangnam-gu, Seoul",
      businessHours: "Weekdays 10:00 - 18:00",
    },
    // 일본어권 연락처
    ja: {
      phone: "090-1234-5678",
      phoneFormatted: "090-1234-5678",
      phoneHref: "tel:090-1234-5678",
      email: "contact@momentsnap.com",
      address: "ソウル市江南区テヘラン路",
      businessHours: "平日 10:00 - 18:00",
    },
  },

  // 소셜 미디어
  social: {
    instagram: "https://instagram.com/momentsnap",
    facebook: "https://facebook.com/momentsnap",
    // 필요시 추가
    // youtube: "https://youtube.com/@momentsnap",
    // twitter: "https://twitter.com/momentsnap",
  },

  // 기타 설정
  settings: {
    emailResponseTime: "10분 이내", // 평균 응답 시간
    photoDeliveryDays: "3-5일", // 사진 전달 기간
  },
};

// 타입 정의
export type Locale = "ko" | "en" | "ja";

/**
 * 현재 언어에 맞는 연락처 정보를 가져옵니다.
 * @param locale - 'ko' | 'en' | 'ja'
 */
export function getContactInfo(locale: Locale = "ko") {
  return businessInfo.contact[locale];
}
