# 프로젝트 개요
- 서비스명: 수학학원 문의/예약 폼
- 목표: 고객 문의를 받고 관리자가 처리하는 MVP
- 요구사항 원문: REQUIREMENTS.md 참고

## 기술 스택
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **ORM**: Supabase JS Client (`@supabase/supabase-js`)
- **Runtime**: Node.js / npm

## 프로젝트 구조
```
src/
├── app/
│   ├── page.tsx          # 랜딩 페이지 (/)
│   ├── reserve/
│   │   └── page.tsx      # 예약 신청 폼 (/reserve)
│   ├── complete/
│   │   └── page.tsx      # 신청 완료 (/complete)
│   └── admin/
│       ├── page.tsx      # 관리자 목록 (/admin)
│       └── [id]/
│           └── page.tsx  # 관리자 상세 (/admin/:id)
├── lib/
│   └── supabase.ts       # Supabase 클라이언트
└── types/
    └── reservation.ts    # Reservation 타입 정의
```

## 환경변수 (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 작업 규칙
- 새 기능은 REQUIREMENTS.md 기준으로 만든다.
- 한 번에 큰 변경 금지, 작은 단위로 나눠서 진행한다.
- 변경 전에 계획을 먼저 말한다.
- 파일 수정 전에 반드시 Read로 먼저 읽는다.
- 초보자 대상 프로젝트이므로 설명은 쉽고 단계별로 한다.

## 완료된 작업
1. REQUIREMENTS.md 작성
2. Next.js 16 프로젝트 초기화 (TypeScript + Tailwind + App Router)
3. Supabase 프로젝트 생성 및 `reservations` 테이블 생성
4. `.env.local` 환경변수 설정
5. `@supabase/supabase-js` 패키지 설치
6. `src/lib/supabase.ts` - Supabase 클라이언트 설정
7. `src/types/reservation.ts` - Reservation 타입 정의
8. `src/app/page.tsx` - 랜딩 페이지 (학원 소개 + 상담 예약 버튼)
9. `src/app/reserve/page.tsx` - 예약 신청 폼 (유형 선택, 학생 정보, 학습 정보, 일정 선택)
10. `src/app/complete/page.tsx` - 신청 완료 페이지
11. `src/app/admin/page.tsx` - 관리자 목록 (비밀번호 로그인, 필터, 통계)
12. `src/app/admin/[id]/page.tsx` - 관리자 상세 (상태 변경, 메모 작성)
13. Next.js 16 params Promise 대응 (`use(params)` 적용)
14. 예약 폼 UX 개선
    - 랜딩 버튼 클릭 시 `?type=` 쿼리파라미터로 신청 유형 자동 선택
    - 학년 선택 시 학교명 suffix 자동 적용 (초등학교 / 중학교 / 고등학교)
    - 보호자 연락처 `010-` 고정 + 숫자 입력 시 자동 포맷 (010-XXXX-XXXX)
    - "최근 모의고사 점수" → "최근 수학 성적" 으로 변경, `점` suffix 고정
    - `useSearchParams` 사용으로 Suspense 경계 적용
15. 관리자 UX 개선
    - `sessionStorage`로 로그인 상태 유지 (페이지 이동 후에도 재로그인 불필요)
    - 상세 페이지 "← 목록으로" → 흰색 버튼 스타일로 변경
    - 대시보드 "← 홈으로" → 흰색 버튼 스타일로 변경
16. 브랜드 커스터마이징
    - 학원명: "수학의 힘 학원" → "미라클 수학"
    - 연락처: 02-000-0000 → 02-2026-0224
    - 메인 카피: "수학, 제대로 잡아드립니다" → "미라클 수학으로 성적이 달라집니다"
    - "왜 수학의 힘 학원인가요?" → "왜 미라클 수학인가요?"
    - 메인 색상: 파란색 유지
    - 운영 시간: 월~금 14:00~22:00 / 토 10:00~18:00 유지
17. 랜딩 페이지 UI 정리
    - 상단 헤더("미라클 수학" 로고 + "상담 예약하기" 버튼) 제거 → 히어로 섹션부터 바로 시작
18. 상담 폼 UI 개선
    - 상단에 "홈으로" 버튼 추가
19. GitHub 배포
    - 저장소: https://github.com/JMoodMusic/Vibe-Form-Math-Academy-.git
    - 브랜치: main
    - 커밋: "feat: 미라클 수학 예약 폼 MVP 완성"
    - `.env.local`은 .gitignore로 제외 (API 키 보안)
20. Vercel 배포 완료
    - Production URL: https://vibe-form-math-academy.vercel.app
    - GitHub 저장소 연결 후 Deploy 완료
    - 환경변수 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 설정 완료
21. Supabase RLS 정책 추가
    - `reservations` 테이블에 SELECT 정책 추가 (`Allow public read`)
    - 관리자 페이지에서 데이터 조회 안 되던 문제 해결
22. 보안 개선
    - Guide.md에서 관리자 비밀번호 직접 노출 제거
    - 관리자 비밀번호 변경 (보안을 위해 문서에 기록하지 않음)
23. 관리자 비밀번호 서버사이드 이전
    - 하드코딩된 비밀번호(`admin/page.tsx`)를 서버 환경변수(`ADMIN_PASSWORD`)로 이전
    - `src/app/api/auth/route.ts` API Route 생성 (POST로 비밀번호 검증)
    - 클라이언트 JS 번들에 비밀번호가 노출되지 않도록 개선
    - Vercel 배포 시 `ADMIN_PASSWORD` 환경변수 수동 추가 필요

## 주요 문서
- `REQUIREMENTS.md` - 요구사항 명세서
- `CLAUDE.md` - 개발 히스토리 및 작업 규칙 (이 파일)
- `Guide.md` - 비개발자용 운영 가이드 (접속 방법, 배포, 용어 설명 등)

## 학원 정보
- 학원명: 미라클 수학
- 연락처: 02-2026-0224
- 운영 시간: 월~금 14:00~22:00 / 토 10:00~18:00
- 메인 색상: 파란색 (blue-700)

## 현재 상태
- MVP 전체 기능 구현 완료 + UX 개선 + 브랜드 커스터마이징 완료
- 로컬 개발 환경(`npm run dev`)에서 정상 동작 확인
- Supabase DB 연동 및 데이터 저장/조회 확인
- GitHub 업로드 완료 (main 브랜치)
- Vercel 배포 완료 (운영 중)
- Production 테스트 완료
  - 랜딩 페이지 정상 로딩
  - 신청 유형 자동 선택 정상 동작
  - 폼 제출 → /complete 페이지 이동 정상
  - Supabase 데이터 저장 확인
  - /admin 로그인 및 목록 조회 정상
- 관리자 보안 개선 완료 (비밀번호 변경, 문서 노출 제거, RLS 정책 추가)
