# Supabase 이메일 템플릿 커스터마이징 가이드

Supabase에서 자동으로 보내는 회원가입 확인 이메일을 예쁘게 꾸미는 방법입니다.

---

## 빠른 시작 (3분)

1. Supabase 대시보드 → **Authentication** → **Email Templates**
2. **Confirm signup** 템플릿 선택
3. 아래 HTML 복사 & 붙여넣기
4. **Save** 클릭
5. 테스트 계정 생성하여 확인!

---

## 설정 방법

### 1단계: Supabase 대시보드 접속

1. [supabase.com](https://supabase.com)에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **Authentication** 클릭
4. **Email Templates** 클릭

### 2단계: Confirm signup 템플릿 선택

- **Confirm signup** 템플릿을 선택합니다
- 이것이 회원가입 시 보내지는 이메일입니다

### 3단계: 아래 템플릿 복사 및 붙여넣기

기존 템플릿을 삭제하고 아래 HTML을 붙여넣으세요:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>이메일 확인</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <!-- 메인 컨테이너 -->
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- 헤더 섹션 -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                Moment Snap
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px; font-weight: 400;">
                                감성 스냅 포토그래퍼
                            </p>
                        </td>
                    </tr>
                    
                    <!-- 본문 섹션 -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">
                                이메일 주소를 확인해주세요
                            </h2>
                            <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                안녕하세요! Moment Snap에 가입해 주셔서 감사합니다.<br>
                                아래 버튼을 클릭하여 이메일 주소를 확인해주세요.
                            </p>
                            
                            <!-- 확인 버튼 -->
                            <table role="presentation" style="margin: 0 auto 30px; border-collapse: collapse;">
                                <tr>
                                    <td style="border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);">
                                        <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 48px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">
                                            이메일 확인하기
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- 추가 안내 -->
                            <table role="presentation" style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
                                <tr>
                                    <td style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 20px; border-radius: 4px;">
                                        <p style="margin: 0; color: #2d3748; font-size: 14px; line-height: 1.6;">
                                            <strong>참고:</strong> 이 링크는 24시간 동안 유효합니다.<br>
                                            버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- 링크 URL -->
                            <p style="margin: 0 0 30px 0; color: #718096; font-size: 13px; word-break: break-all; background-color: #f7fafc; padding: 15px; border-radius: 6px;">
                                {{ .ConfirmationURL }}
                            </p>
                            
                            <!-- 요청하지 않은 경우 -->
                            <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                이 이메일을 요청하지 않으셨다면 무시하셔도 됩니다.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- 푸터 섹션 -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; color: #718096; font-size: 13px; text-align: center;">
                                Moment Snap - 당신의 특별한 순간을 영원히
                            </p>
                            <p style="margin: 0; color: #a0aec0; font-size: 12px; text-align: center;">
                                이 이메일은 자동으로 발송되었습니다. 답장하지 마세요.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- 최하단 공지 -->
                <p style="margin: 30px 0 0 0; color: #a0aec0; font-size: 12px; text-align: center; max-width: 600px;">
                    © 2024 Moment Snap. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## 템플릿 특징

### 디자인
- 깔끔하고 현대적인 디자인
- 브랜드 컬러 (보라색 그라데이션) 적용
- 모바일 반응형 (스마트폰에서도 예쁘게 보임)
- 그림자 효과로 입체감 추가

### 구조
1. **헤더**: Moment Snap 로고 및 부제목
2. **본문**: 환영 메시지 및 확인 버튼
3. **안내 박스**: 링크 유효 기간 및 사용법
4. **URL 표시**: 버튼이 안 될 때 복사할 수 있는 링크
5. **푸터**: 브랜드 정보 및 자동 발송 안내

### 사용자 경험
- 큰 버튼으로 클릭하기 쉬움
- 명확한 안내 문구
- 문제 상황 대비 (버튼 안 될 때 URL 제공)
- 스팸이 아님을 명확히 표시

---

## 다른 이메일 템플릿도 꾸미기

같은 방식으로 다른 템플릿도 수정할 수 있습니다:

### Invite user (사용자 초대)
- 관리자가 사용자를 초대할 때 보내는 이메일
- Confirm signup 템플릿과 비슷하게 수정

### Magic Link (매직 링크 로그인)
- 비밀번호 없이 이메일로 로그인할 때 사용
- 빠른 로그인을 강조하는 문구 추가

### Change Email Address (이메일 변경)
- 사용자가 이메일 주소를 변경할 때
- 보안 관련 문구 강조

### Reset Password (비밀번호 재설정)
- 비밀번호를 잊어버렸을 때
- 보안 경고 및 주의사항 추가

---

## 비밀번호 재설정 이메일 템플릿

참고용으로 비밀번호 재설정 템플릿도 제공합니다:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>비밀번호 재설정</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- 헤더 -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                Moment Snap
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px; font-weight: 400;">
                                감성 스냅 포토그래퍼
                            </p>
                        </td>
                    </tr>
                    
                    <!-- 본문 -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">
                                비밀번호 재설정
                            </h2>
                            <p style="margin: 0 0 30px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                비밀번호 재설정 요청을 받았습니다.<br>
                                아래 버튼을 클릭하여 새로운 비밀번호를 설정해주세요.
                            </p>
                            
                            <!-- 재설정 버튼 -->
                            <table role="presentation" style="margin: 0 auto 30px; border-collapse: collapse;">
                                <tr>
                                    <td style="border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);">
                                        <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; padding: 16px 48px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">
                                            비밀번호 재설정하기
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- 보안 경고 -->
                            <table role="presentation" style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
                                <tr>
                                    <td style="background-color: #fff5f5; border-left: 4px solid #f56565; padding: 20px; border-radius: 4px;">
                                        <p style="margin: 0 0 10px 0; color: #742a2a; font-size: 14px; font-weight: 600;">
                                            보안 안내
                                        </p>
                                        <p style="margin: 0; color: #742a2a; font-size: 14px; line-height: 1.6;">
                                            • 이 링크는 1시간 동안 유효합니다<br>
                                            • 본인이 요청하지 않았다면 즉시 무시하세요<br>
                                            • 링크를 타인과 공유하지 마세요
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- 링크 URL -->
                            <p style="margin: 0 0 30px 0; color: #718096; font-size: 13px; word-break: break-all; background-color: #f7fafc; padding: 15px; border-radius: 6px;">
                                {{ .ConfirmationURL }}
                            </p>
                            
                            <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                비밀번호 재설정을 요청하지 않으셨다면 이 이메일을 무시하세요.<br>
                                계정은 안전하게 보호됩니다.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- 푸터 -->
                    <tr>
                        <td style="background-color: #f7fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; color: #718096; font-size: 13px; text-align: center;">
                                Moment Snap - 당신의 특별한 순간을 영원히
                            </p>
                            <p style="margin: 0; color: #a0aec0; font-size: 12px; text-align: center;">
                                이 이메일은 자동으로 발송되었습니다. 답장하지 마세요.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <p style="margin: 30px 0 0 0; color: #a0aec0; font-size: 12px; text-align: center; max-width: 600px;">
                    © 2024 Moment Snap. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## 테스트 방법

### 1. 템플릿 저장 후 테스트

1. Supabase 대시보드에서 템플릿을 저장합니다
2. 새로운 계정을 생성해봅니다
3. 이메일을 확인하여 템플릿이 제대로 적용되었는지 확인

### 2. 여러 디바이스에서 확인

- **데스크톱**: Outlook, Gmail, Apple Mail
- **모바일**: Gmail 앱, iPhone 메일 앱
- **웹메일**: Gmail, Naver, Daum

### 3. 스팸 폴더 확인

처음에는 스팸 폴더에 들어갈 수 있으니 확인해보세요.

---

## 커스터마이징 팁

### 색상 변경

```css
/* 보라색 그라데이션 (현재) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 파란색 그라데이션 */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* 분홍색 그라데이션 */
background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);

/* 녹색 그라데이션 */
background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
```

### 로고 추가

헤더 부분에 이미지를 추가할 수 있습니다:

```html
<tr>
    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
        <!-- 로고 이미지 추가 -->
        <img src="https://your-domain.com/logo.png" alt="Moment Snap" style="width: 120px; height: auto; margin-bottom: 20px;">
        
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
            Moment Snap
        </h1>
    </td>
</tr>
```

### 연락처 정보 추가

푸터에 연락처를 추가할 수 있습니다:

```html
<tr>
    <td style="background-color: #f7fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 15px 0; color: #718096; font-size: 13px; text-align: center;">
            Moment Snap - 당신의 특별한 순간을 영원히
        </p>
        
        <!-- 연락처 추가 -->
        <p style="margin: 0 0 10px 0; color: #a0aec0; font-size: 12px; text-align: center;">
            문의: contact@momentsnap.com | 010-1234-5678
        </p>
        
        <p style="margin: 0; color: #a0aec0; font-size: 12px; text-align: center;">
            이 이메일은 자동으로 발송되었습니다.
        </p>
    </td>
</tr>
```

---

## 주의사항

### 이메일 HTML 제약사항

1. **CSS는 인라인으로**: `<style>` 태그 대신 `style=""` 속성 사용
2. **테이블 레이아웃**: `<div>` 대신 `<table>` 사용 (구형 이메일 클라이언트 호환)
3. **이미지 경로**: 상대 경로 불가, 절대 URL 사용 필수
4. **JavaScript 불가**: 보안상 이메일에서는 JS 실행 안 됨
5. **폰트**: 시스템 폰트 사용 권장 (웹폰트는 일부 클라이언트에서 안 보임)

### Supabase 템플릿 변수

사용 가능한 변수들:
- `{{ .ConfirmationURL }}` - 이메일 확인 링크 (회원가입, 이메일 변경)
- `{{ .Token }}` - 6자리 인증 코드 (OTP 사용 시)
- `{{ .TokenHash }}` - 토큰 해시값
- `{{ .SiteURL }}` - 사이트 기본 URL
- `{{ .Email }}` - 사용자 이메일 주소

### 테스트 필수

- 템플릿 변경 후 반드시 실제 이메일로 테스트하세요
- 여러 이메일 클라이언트에서 확인하세요
- 모바일에서도 테스트하세요

---

## 완료 체크리스트

- [ ] Supabase 대시보드 > Authentication > Email Templates 접속
- [ ] Confirm signup 템플릿 선택
- [ ] 위의 HTML 템플릿 복사 및 붙여넣기
- [ ] Save 버튼 클릭
- [ ] 테스트 계정 생성하여 이메일 확인
- [ ] 다른 템플릿도 동일하게 적용 (선택사항)

---

## 참고 자료

- [Supabase Email Templates 공식 문서](https://supabase.com/docs/guides/auth/auth-email-templates)
- [이메일 HTML 작성 가이드](https://www.campaignmonitor.com/css/)
- [반응형 이메일 테스트 도구](https://www.emailonacid.com/)

---

**템플릿 적용 완료! 이제 회원가입 확인 이메일이 훨씬 더 전문적으로 보입니다!**

