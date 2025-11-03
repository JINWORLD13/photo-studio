import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, phone, service, message } = await request.json();

    if (process.env.NODE_ENV === 'development') {
      console.log('이메일 발송 시작...');
      console.log('Gmail User:', process.env.GMAIL_USER);
      console.log('Gmail Password 설정:', process.env.GMAIL_APP_PASSWORD ? '있음' : '없음');
    }

    // Gmail SMTP 설정
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail 앱 비밀번호
      },
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('Transporter 생성 완료');
    }

    // 이메일 내용
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_RECIPIENT || process.env.GMAIL_USER, // 받을 이메일 (설정 안 하면 자기 자신)
      subject: `[Moment Snap] 새 문의: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1c1917; border-bottom: 2px solid #78716c; padding-bottom: 10px;">
            📸 새로운 문의가 도착했습니다
          </h2>
          
          <div style="background-color: #fafaf9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #44403c; margin-top: 0;">고객 정보</h3>
            <p><strong>이름:</strong> ${name}</p>
            <p><strong>이메일:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>연락처:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
            <p><strong>관심 서비스:</strong> ${service}</p>
          </div>

          <div style="background-color: #f5f5f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #44403c; margin-top: 0;">문의 내용</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>

          <div style="background-color: #1c1917; color: white; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px;">
              📱 빠른 응답으로 고객을 만족시켜보세요!<br>
              💡 관리자 페이지에서도 확인하실 수 있습니다.
            </p>
          </div>

          <p style="color: #78716c; font-size: 12px; text-align: center; margin-top: 30px;">
            이 메일은 Moment Snap 문의 시스템에서 자동으로 발송되었습니다.
          </p>
        </div>
      `,
    };

    // 이메일 발송
    if (process.env.NODE_ENV === 'development') {
      console.log('이메일 발송 중...');
    }
    const result = await transporter.sendMail(mailOptions);
    if (process.env.NODE_ENV === 'development') {
      console.log('이메일 발송 성공!', result);
    }

    return NextResponse.json({ success: true, message: '이메일이 발송되었습니다.' });
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Email sending error:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
    }
    return NextResponse.json(
      { success: false, message: '이메일 발송에 실패했습니다: ' + error.message },
      { status: 500 }
    );
  }
}

