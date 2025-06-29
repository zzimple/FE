"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import OwnerHeader from "@/components/headers/OwnerHeader";

export default function OwnerHome() {
  return (
    <ProtectedRoute allowed={["OWNER"]}>

      <div className="min-h-screen flex flex-col justify-between bg-gray-50">
        {/* 사장 전용 헤더 */}
        <OwnerHeader />

        {/* 메인 배너 */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-600">
            사장님을 위한 ZZIMPLE
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            효율적인 사업 관리를 통해<br />
            더 많은 고객을 만나보세요!
          </p>

          {/* 주요 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link href="/owner/estimates">
              <button className="bg-green-600 text-white border-2 border-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition w-42">
                내 견적서 관리
              </button>
            </Link>
            <Link href="/estimate/owner/publiclist">
              <button className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition w-42">
                고객 견적서
              </button>
            </Link>
            <Link href="/owner/staff">
              <button className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition w-42">
                직원 관리
              </button>
            </Link>
            <Link href="/owner/shop">
              <button className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition w-42">
                매출 관리
              </button>
            </Link>
          </div>

          {/* 사장 전용 기능 안내 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-green-500">
                견적서 관리
              </h2>
              <p className="text-gray-700 mb-3">
                들어오는 견적서를 효율적으로 관리하세요
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• 새로운 견적서 확인</li>
                <li>• 견적 가격 책정</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-green-500">직원 관리</h2>
              <p className="text-gray-700 mb-3 whitespace-nowrap">
                직원들의 휴무와 스케줄을 체계적으로 관리하세요
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• 직원 스케줄 관리</li>
                <li>• 직원 휴무 관리</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-green-500">사업 통계</h2>
              <p className="text-gray-700 mb-3">사업 현황을 한눈에 파악하세요</p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• 월별 매출 현황</li>
                <li>• 고객 만족도</li>
              </ul>
            </div>
          </div>
        </main>

        {/* 푸터 */}
        <footer className="w-full py-4 text-center text-gray-400 text-sm bg-white border-t mt-8">
          &copy; {new Date().getFullYear()} ZZIMPLE 이사. All rights reserved.
        </footer>
      </div>
    </ProtectedRoute>
  );
}
