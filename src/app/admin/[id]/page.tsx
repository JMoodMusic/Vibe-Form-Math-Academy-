'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Reservation } from '@/types/reservation'

const STATUSES = ['접수', '연락완료', '확정', '완료', '취소']

const STATUS_COLORS: Record<string, string> = {
  '접수': 'bg-yellow-100 text-yellow-700',
  '연락완료': 'bg-blue-100 text-blue-700',
  '확정': 'bg-purple-100 text-purple-700',
  '완료': 'bg-green-100 text-green-700',
  '취소': 'bg-red-100 text-red-700',
}

export default function AdminDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [memo, setMemo] = useState('')
  const [savedMemo, setSavedMemo] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('reservations')
        .select('*')
        .eq('id', id)
        .single()
      if (data) {
        setReservation(data)
        setMemo(data.admin_memo || '')
        setSavedMemo(data.admin_memo || '')
        setIsEditing(!data.admin_memo)
      }
    }
    fetch()
  }, [id])

  const handleStatusChange = async (newStatus: string) => {
    if (!reservation) return
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', reservation.id)
    if (!error) setReservation({ ...reservation, status: newStatus })
  }

  const handleSaveMemo = async () => {
    if (!reservation) return
    setSaving(true)
    const { error } = await supabase
      .from('reservations')
      .update({ admin_memo: memo, updated_at: new Date().toISOString() })
      .eq('id', reservation.id)
    setSaving(false)
    if (!error) {
      setReservation({ ...reservation, admin_memo: memo })
      setSavedMemo(memo)
      setIsEditing(false)
      alert('메모가 저장되었습니다.')
    } else {
      alert('메모 저장에 실패했습니다. Supabase RLS UPDATE 정책을 확인해주세요.')
    }
  }

  const MEMO_TEMPLATE = `[현재 수준]\n\n[추천 반]\n\n[상담 내용]\n\n[다음 상담일]\n`

  if (!reservation) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">불러오는 중...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="font-bold text-lg">신청 상세</h1>
          <Link href="/admin" className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition">목록으로</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">

        {/* 상태 변경 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">상태 변경</h2>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition ${
                  reservation.status === s
                    ? `${STATUS_COLORS[s]} border-current`
                    : 'border-gray-200 text-gray-500 hover:border-gray-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">기본 정보</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <InfoRow label="신청 유형" value={reservation.reservation_type} />
            <InfoRow label="학생 이름" value={reservation.student_name} />
            <InfoRow label="학년" value={reservation.grade} />
            <InfoRow label="학교명" value={reservation.school || '-'} />
            <InfoRow label="보호자 연락처" value={reservation.parent_phone} />
            <InfoRow label="보호자 이름" value={reservation.parent_name || '-'} />
          </div>
        </div>

        {/* 학습 정보 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">학습 정보</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <InfoRow label="수학 성적 수준" value={reservation.current_math_level || '-'} />
            <InfoRow label="최근 모의고사 점수" value={reservation.recent_exam_score || '-'} />
            <InfoRow label="학습 목표" value={reservation.exam_target || '-'} />
          </div>
        </div>

        {/* 희망 일정 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">희망 일정</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <InfoRow label="희망 날짜" value={reservation.desired_date} />
            <InfoRow label="희망 시간대" value={reservation.desired_time_slot} />
            <InfoRow label="신청일시" value={new Date(reservation.created_at).toLocaleString('ko-KR')} />
          </div>
        </div>

        {/* 관리자 메모 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">관리자 메모</h2>

          {isEditing ? (
            <>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="현재 수준, 추천 반, 상담 내용 요약 등을 기록하세요."
                rows={8}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleSaveMemo}
                  disabled={saving}
                  className="bg-blue-700 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 text-sm"
                >
                  {saving ? '저장 중...' : '저장'}
                </button>
                {savedMemo && (
                  <button
                    onClick={() => { setMemo(savedMemo); setIsEditing(false) }}
                    className="border border-gray-300 text-gray-600 font-bold px-6 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    취소
                  </button>
                )}
                {!memo.trim() && (
                  <button
                    onClick={() => setMemo(MEMO_TEMPLATE)}
                    className="border border-blue-300 text-blue-600 font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition text-sm"
                  >
                    템플릿 불러오기
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-800 whitespace-pre-wrap min-h-[60px]">
                {savedMemo}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 border border-gray-300 text-gray-600 font-bold px-6 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                수정하기
              </button>
            </>
          )}
        </div>

      </div>
    </main>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-gray-400 text-xs mb-1">{label}</div>
      <div className="text-gray-800 font-medium">{value}</div>
    </div>
  )
}
