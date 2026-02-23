import Link from 'next/link'

export default function CompletePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">신청이 완료되었습니다!</h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          담당자가 확인 후 연락드립니다.<br />
          보통 1~2 영업일 내에 연락드립니다.
        </p>
        <div className="bg-blue-50 rounded-xl p-4 mb-8 text-sm text-blue-700">
          문의사항이 있으시면 <strong>02-2026-0224</strong>으로 연락주세요.
        </div>
        <Link
          href="/"
          className="block w-full bg-blue-700 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  )
}
