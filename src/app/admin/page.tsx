'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Reservation } from '@/types/reservation'

const STATUS_COLORS: Record<string, string> = {
  '접수': 'bg-yellow-100 text-yellow-700',
  '연락완료': 'bg-blue-100 text-blue-700',
  '확정': 'bg-purple-100 text-purple-700',
  '완료': 'bg-green-100 text-green-700',
  '취소': 'bg-red-100 text-red-700',
}

export default function AdminPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [filterGrade, setFilterGrade] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDate, setFilterDate] = useState('')

  const handleLogin = () => {
    if (password === 'admin1234') {
      sessionStorage.setItem('admin_authed', 'true')
      setAuthed(true)
    } else {
      alert('비밀번호가 틀렸습니다.')
    }
  }

  const fetchReservations = async () => {
    setLoading(true)
    let query = supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false })

    if (filterGrade) query = query.eq('grade', filterGrade)
    if (filterStatus) query = query.eq('status', filterStatus)
    if (filterDate) query = query.eq('desired_date', filterDate)

    const { data, error } = await query
    setLoading(false)
    if (!error && data) setReservations(data)
  }

  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') === 'true') {
      setAuthed(true)
    }
  }, [])

  useEffect(() => {
    if (authed) fetchReservations()
  }, [authed, filterGrade, filterStatus, filterDate])

  // 로그인 화면
  if (!authed) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm w-full">
          <h1 className="text-xl font-bold text-gray-800 mb-6 text-center">관리자 로그인</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="비밀번호 입력"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm mb-4 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition"
          >
            로그인
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="font-bold text-lg">미라클 수학 관리자</h1>
          <Link href="/" className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition">홈으로</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* 통계 */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {['접수', '연락완료', '확정', '완료', '취소'].map((s) => (
            <div key={s} className="bg-white rounded-xl p-4 shadow-sm text-center">
              <div className={`text-xs font-bold px-2 py-1 rounded-full inline-block mb-1 ${STATUS_COLORS[s]}`}>{s}</div>
              <div className="text-2xl font-bold text-gray-800">
                {reservations.filter((r) => r.status === s).length}
              </div>
            </div>
          ))}
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3">
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">전체 학년</option>
            {['초1','초2','초3','초4','초5','초6','중1','중2','중3','고1','고2','고3'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">전체 상태</option>
            {['접수','연락완료','확정','완료','취소'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={() => { setFilterGrade(''); setFilterStatus(''); setFilterDate('') }}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            필터 초기화
          </button>
        </div>

        {/* 목록 */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">불러오는 중...</div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-12 text-gray-400">신청 내역이 없습니다.</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">이름</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">학년</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">유형</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">희망일</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">시간</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">상태</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">신청일</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => router.push(`/admin/${r.id}`)}
                    className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{r.student_name}</td>
                    <td className="px-4 py-3 text-gray-600">{r.grade}</td>
                    <td className="px-4 py-3 text-gray-600">{r.reservation_type}</td>
                    <td className="px-4 py-3 text-gray-600">{r.desired_date}</td>
                    <td className="px-4 py-3 text-gray-600">{r.desired_time_slot}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[r.status] || ''}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(r.created_at).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
