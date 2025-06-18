"use client";

import Link from "next/link";
import Header from "@/components/common/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* 헤더 */}
      <Header />
      {/* <header className="w-full py-4 px-6 flex items-center justify-between bg-white shadow">
        <div className="text-2xl font-bold text-blue-600">ZZIMPLE 이사</div>
        <nav className="space-x-4">
          <Link href="/login" className="text-gray-700 hover:text-blue-600">
            로그인
          </Link>
          <Link href="/signup" className="text-gray-700 hover:text-blue-600">
            회원가입
          </Link>
        </nav>
      </header> */}

      {/* 메인 배너 */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          이사, 쉽고 합리적으로!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          견적 비교부터 직원 배정까지, 이삿짐센터 사장님과 고객 모두를 위한
          플랫폼
        </p>
        <Link href="/estimate/step0">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition mb-12">
            견적서 작성하러 가기
          </button>
        </Link>

        {/* 사용자 유형 선택 */}
        <div className="w-full max-w-4xl mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            어떤 서비스를 이용하시나요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/guest" className="group">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300 border-2 border-transparent group-hover:border-blue-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl text-blue-600">👤</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-blue-600">고객</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    이사 서비스를 받으실 분
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    고객 페이지로
                  </button>
                </div>
              </div>
            </Link>

            <Link href="/owner" className="group">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300 border-2 border-transparent group-hover:border-green-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <span className="text-2xl text-green-600">🏢</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-green-600">
                    사장님
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    이삿짐센터 운영자
                  </p>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                    사장님 페이지로
                  </button>
                </div>
              </div>
            </Link>

            <Link href="/staff" className="group">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300 border-2 border-transparent group-hover:border-orange-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                    <span className="text-2xl text-orange-600">👷</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-orange-600">
                    직원
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">이사 업무 담당자</p>
                  <button className="bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition">
                    직원 페이지로
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 주요 기능 안내 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2 text-blue-500">고객</h2>
            <ul className="text-gray-700 text-left list-disc list-inside space-y-1">
              <li>간편 견적서 작성</li>
              <li>여러 사장님 견적 비교</li>
              <li>합리적 이사 선택</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2 text-blue-500">사장님</h2>
            <ul className="text-gray-700 text-left list-disc list-inside space-y-1">
              <li>견적서 관리 및 비용 책정</li>
              <li>직원 스케줄 관리</li>
              <li>이사 품목별 가격 설정</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-2 text-blue-500">직원</h2>
            <ul className="text-gray-700 text-left list-disc list-inside space-y-1">
              <li>내 스케줄 확인</li>
              <li>담당 이사 견적서 확인</li>
            </ul>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="w-full py-4 text-center text-gray-400 text-sm bg-white border-t mt-8">
        &copy; {new Date().getFullYear()} ZZIMPLE 이사. All rights reserved.
      </footer>
    </div>
  );
}
