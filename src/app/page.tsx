import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-b from-blue-700 to-blue-500 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-200 text-sm font-medium mb-3">초·중·고 수학 전문</p>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            미라클 수학으로 성적이 달라집니다
          </h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed">
            개념부터 심화까지, 아이의 수준에 맞는 맞춤 수업으로<br />
            내신과 수능 모두 잡을 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reserve?type=상담 신청"
              className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition shadow-lg"
            >
              무료 상담 신청하기
            </Link>
            <Link
              href="/reserve?type=무료 레벨테스트"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-white hover:text-blue-700 transition"
            >
              무료 레벨테스트 신청
            </Link>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-12">
            왜 미라클 수학인가요?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="font-bold text-gray-800 mb-2">정확한 레벨 진단</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                무료 레벨테스트로 아이의 현재 수준을 정확하게 파악합니다.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="font-bold text-gray-800 mb-2">맞춤형 커리큘럼</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                내신, 수능, 특목고 대비 목표에 따라 최적화된 수업을 제공합니다.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h4 className="font-bold text-gray-800 mb-2">전문 강사진</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                수학 전공 강사들이 개념부터 문제풀이까지 꼼꼼히 지도합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 수업 안내 */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-12">수업 안내</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border-2 border-blue-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">초등</span>
                <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">중등</span>
              </div>
              <h4 className="font-bold text-gray-800 text-lg mb-2">기초·내신반</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                교과 개념을 탄탄히 다지고 학교 시험 내신 성적을 올립니다.
              </p>
            </div>
            <div className="border-2 border-blue-100 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">고등</span>
                <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">수능</span>
              </div>
              <h4 className="font-bold text-gray-800 text-lg mb-2">수능·심화반</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                수능 1등급을 목표로 심화 개념과 킬러 문항을 집중 공략합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="bg-blue-700 text-white py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-3">지금 바로 무료 상담을 신청하세요</h3>
          <p className="text-blue-200 mb-8">담당 선생님이 직접 연락드려 아이에게 맞는 수업을 안내해드립니다.</p>
          <Link
            href="/reserve"
            className="bg-white text-blue-700 font-bold px-10 py-4 rounded-xl text-lg hover:bg-blue-50 transition shadow-lg inline-block"
          >
            상담 예약하기 →
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-gray-400 py-8 px-6 text-center text-sm">
        <p>미라클 수학 | 문의: 02-2026-0224</p>
        <p className="mt-1">월~금 14:00~22:00 | 토 10:00~18:00</p>
      </footer>
    </main>
  )
}
