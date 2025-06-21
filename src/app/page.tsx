"use client";

import Link from "next/link";
import Header from "@/components/common/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* 헤더 */}
      <Header />
      <div className="mt-24" /> 

      {/* 메인 배너 */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          이사, 쉽고 합리적으로!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          견적 비교부터 직원 배정까지, 이삿짐센터 사장님과 고객 모두를 위한
          플랫폼
        </p>
        {/* <Link href="/guest/estimate/step1">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition mb-12">
            견적서 작성하러 가기
          </button>
        </Link> */}

        {/* 사용자 유형 선택 */}
        <div className="w-full max-w-4xl mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            어떤 서비스를 이용하시나요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 고객 */}
            <div className="flex flex-col items-center">
              <Link href="/guest" className="group w-full">
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300 border-2 border-transparent group-hover:border-blue-200 flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl text-blue-600">👤</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-blue-600">고객</h3>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition mb-2">
                    고객 페이지로
                  </button>
                  <p className="text-gray-600 text-sm text-center">
                    이사 서비스를 받으실 분
                  </p>
                </div>
              </Link>
              <div className="w-full mt-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-2 text-blue-500">고객</h2>
                  <ul className="text-gray-700 text-left list-disc list-inside space-y-1">
                    <li>간편 견적서 작성</li>
                    <li>여러 사장님 견적 비교</li>
                    <li>합리적 이사 선택</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* 사장 */}
            <div className="flex flex-col items-center">
              <Link href="/owner" className="group w-full">
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300 border-2 border-transparent group-hover:border-green-200 flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <span className="text-2xl text-green-600">🏢</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-green-600">
                    사장님
                  </h3>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition mb-2">
                    사장님 페이지로
                  </button>
                  <p className="text-gray-600 text-sm text-center">
                    이삿짐센터 운영자
                  </p>
                </div>
              </Link>
              <div className="w-full mt-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-2 text-green-500">
                    사장님
                  </h2>
                  <ul className="text-gray-700 text-left list-disc list-inside space-y-1">
                    <li>견적서 관리 및 비용 책정</li>
                    <li>직원 스케줄 관리</li>
                    <li>이사 품목별 가격 설정</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* 직원 */}
            <div className="flex flex-col items-center">
              <Link href="/staff" className="group w-full">
                <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300 border-2 border-transparent group-hover:border-orange-200 flex flex-col items-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                    <span className="text-2xl text-orange-600">👷</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-orange-600">
                    직원
                  </h3>
                  <button className="bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition mb-2">
                    직원 페이지로
                  </button>
                  <p className="text-gray-600 text-sm text-center">
                    이사 업무 담당자
                  </p>
                </div>
              </Link>
              <div className="w-full mt-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-2 text-orange-500">
                    직원
                  </h2>
                  <ul className="text-gray-700 text-left list-disc list-inside space-y-1">
                    <li>내 스케줄 확인</li>
                    <li>담당 이사 견적서 확인</li>
                    <li>간편한 휴무 신청</li>
                  </ul>
                </div>
              </div>
            </div>
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
