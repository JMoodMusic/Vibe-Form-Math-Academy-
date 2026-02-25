'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const GRADES = [
  '초1', '초2', '초3', '초4', '초5', '초6',
  '중1', '중2', '중3',
  '고1', '고2', '고3',
]

const TIME_SLOTS = [
  '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00',
]

function getSchoolSuffix(grade: string) {
  if (grade.startsWith('초')) return '초등학교'
  if (grade.startsWith('중')) return '중학교'
  if (grade.startsWith('고')) return '고등학교'
  return ''
}

function ReserveForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(false)
  const [schoolName, setSchoolName] = useState('')
  const [examScore, setExamScore] = useState('')

  const [form, setForm] = useState({
    reservation_type: searchParams.get('type') || '',
    student_name: '',
    grade: '',
    parent_phone: '010-',
    parent_name: '',
    current_math_level: '',
    exam_target: '',
    desired_date: '',
    desired_time_slot: '',
  })

  const schoolSuffix = getSchoolSuffix(form.grade)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 학년 변경 시 학교 구분이 바뀌면 학교명 초기화
  const handleGradeChange = (grade: string) => {
    if (getSchoolSuffix(grade) !== getSchoolSuffix(form.grade)) {
      setSchoolName('')
    }
    setForm({ ...form, grade })
  }

  // 전화번호 자동 포맷 (010-XXXX-XXXX)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nums = e.target.value.replace(/\D/g, '')
    if (nums.length < 3 || !nums.startsWith('010')) {
      setForm(prev => ({ ...prev, parent_phone: '010-' }))
      return
    }
    const rest = nums.slice(3)
    if (rest.length === 0) {
      setForm(prev => ({ ...prev, parent_phone: '010-' }))
    } else if (rest.length <= 4) {
      setForm(prev => ({ ...prev, parent_phone: `010-${rest}` }))
    } else {
      setForm(prev => ({ ...prev, parent_phone: `010-${rest.slice(0, 4)}-${rest.slice(4, 8)}` }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.reservation_type) return alert('신청 유형을 선택해주세요.')
    if (!form.student_name) return alert('학생 이름을 입력해주세요.')
    if (!form.grade) return alert('학년을 선택해주세요.')
    if (!form.parent_phone || form.parent_phone === '010-') return alert('보호자 연락처를 입력해주세요.')
    if (!form.desired_date) return alert('희망 날짜를 선택해주세요.')
    if (!form.desired_time_slot) return alert('희망 시간대를 선택해주세요.')

    const school = schoolName ? schoolName + schoolSuffix : ''
    const recent_exam_score = examScore ? examScore + '점' : ''

    setLoading(true)
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          school,
          recent_exam_score,
        }),
      })

      if (!res.ok) {
        alert('오류가 발생했습니다. 다시 시도해주세요.')
        return
      }

      router.push('/complete')
    } catch {
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">상담 / 레벨테스트 신청</h1>
            <p className="text-gray-500 mt-1 text-sm">작성하신 내용을 확인 후 담당자가 연락드립니다.</p>
          </div>
          <Link
            href="/"
            className="bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition whitespace-nowrap"
          >
            홈으로
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-8">

          {/* 1. 신청 유형 */}
          <section>
            <h2 className="font-bold text-gray-700 mb-3">
              신청 유형 <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {['상담 신청', '무료 레벨테스트'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, reservation_type: type })}
                  className={`py-4 rounded-xl border-2 font-semibold text-sm transition ${
                    form.reservation_type === type
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          {/* 2. 학생 정보 */}
          <section>
            <h2 className="font-bold text-gray-700 mb-3">학생 정보</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  학생 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="student_name"
                  value={form.student_name}
                  onChange={handleChange}
                  placeholder="홍길동"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  학년 <span className="text-red-500">*</span>
                </label>
                <select
                  name="grade"
                  value={form.grade}
                  onChange={(e) => handleGradeChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">학년 선택</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">학교명 (선택)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder={schoolSuffix ? '학교 이름 입력' : '○○학교'}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                  {schoolSuffix && (
                    <span className="text-gray-600 font-medium text-sm whitespace-nowrap bg-gray-100 border border-gray-300 rounded-lg px-4 py-3">
                      {schoolSuffix}
                    </span>
                  )}
                </div>
                {schoolSuffix && schoolName && (
                  <p className="text-xs text-blue-500 mt-1">저장되는 학교명: {schoolName}{schoolSuffix}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  보호자 연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="parent_phone"
                  value={form.parent_phone}
                  onChange={handlePhoneChange}
                  placeholder="010-0000-0000"
                  maxLength={13}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">보호자 이름 (선택)</label>
                <input
                  type="text"
                  name="parent_name"
                  value={form.parent_name}
                  onChange={handleChange}
                  placeholder="홍부모"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          {/* 3. 학습 정보 */}
          <section>
            <h2 className="font-bold text-gray-700 mb-3">학습 정보 (선택)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">현재 수학 성적 수준</label>
                <div className="flex gap-3">
                  {['상', '중', '하'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setForm({ ...form, current_math_level: level })}
                      className={`flex-1 py-3 rounded-lg border-2 font-semibold text-sm transition ${
                        form.current_math_level === level
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">최근 수학 성적 (선택)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={examScore}
                    onChange={(e) => setExamScore(e.target.value)}
                    placeholder="예: 85"
                    min="0"
                    max="100"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-gray-600 font-medium text-sm bg-gray-100 border border-gray-300 rounded-lg px-4 py-3">
                    점
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">학습 목표 (선택)</label>
                <div className="flex gap-3">
                  {['내신', '수능', '특목고 대비'].map((target) => (
                    <button
                      key={target}
                      type="button"
                      onClick={() => setForm({ ...form, exam_target: target })}
                      className={`flex-1 py-3 rounded-lg border-2 font-semibold text-sm transition ${
                        form.exam_target === target
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      }`}
                    >
                      {target}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 4. 희망 일정 */}
          <section>
            <h2 className="font-bold text-gray-700 mb-3">희망 일정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  희망 날짜 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="desired_date"
                  value={form.desired_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  희망 시간대 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setForm({ ...form, desired_time_slot: time })}
                      className={`py-3 rounded-lg border-2 font-semibold text-sm transition ${
                        form.desired_time_slot === time
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white font-bold py-4 rounded-xl text-lg hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? '제출 중...' : '신청하기'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function ReservePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">로딩 중...</div>}>
      <ReserveForm />
    </Suspense>
  )
}
