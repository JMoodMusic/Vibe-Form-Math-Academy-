import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Supabase에 예약 데이터 저장
    const { error } = await supabase.from('reservations').insert([body])

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: '예약 저장에 실패했습니다.' }, { status: 500 })
    }

    // 이메일 발송 (실패해도 예약은 성공 처리)
    try {
      const adminEmail = process.env.ADMIN_EMAIL
      if (adminEmail && process.env.RESEND_API_KEY) {
        await getResend().emails.send({
          from: '미라클 수학 알림 <onboarding@resend.dev>',
          to: adminEmail,
          subject: `[새 예약] ${body.student_name} - ${body.reservation_type}`,
          html: `
            <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #1d4ed8; margin-bottom: 20px;">새로운 예약이 접수되었습니다</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280; width: 120px;">신청 유형</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${body.reservation_type}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">학생 이름</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${body.student_name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">학년</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${body.grade}</td>
                </tr>
                ${body.school ? `<tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">학교</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${body.school}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">보호자 연락처</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${body.parent_phone}</td>
                </tr>
                ${body.parent_name ? `<tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">보호자 이름</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${body.parent_name}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">희망 날짜</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${body.desired_date}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">희망 시간</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${body.desired_time_slot}</td>
                </tr>
                ${body.current_math_level ? `<tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">수학 수준</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${body.current_math_level}</td>
                </tr>` : ''}
                ${body.recent_exam_score ? `<tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">최근 성적</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${body.recent_exam_score}</td>
                </tr>` : ''}
                ${body.exam_target ? `<tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">학습 목표</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${body.exam_target}</td>
                </tr>` : ''}
              </table>
              <p style="margin-top: 20px; color: #9ca3af; font-size: 13px;">
                관리자 페이지에서 상세 내용을 확인하세요.
              </p>
            </div>
          `,
        })
      }
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // 이메일 실패해도 예약은 성공으로 처리
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: '요청 처리에 실패했습니다.' }, { status: 500 })
  }
}
