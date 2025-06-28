"use client";

import Link from "next/link";
import StaffHeader from "@/components/headers/StaffHeader";

export default function StaffHome() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* 직원 전용 헤더 */}
      <StaffHeader />

      {/* 메인 배너 */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-orange-600">
          직원님을 위한 ZZIMPLE
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          효율적인 업무 관리를 통해 더 나은 서비스를 제공하세요!
        </p>

        {/* 주요 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link href="/staff/schedule">
            <button className="w-44 bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-orange-700 transition">
              내 스케줄 확인
            </button>
          </Link>
          <Link href="/staff/timeoff/request">
            <button className="w-44 bg-white text-orange-600 border-2 border-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition">
              휴무 신청
            </button>
          </Link>
        </div>

        {/* 직원 전용 기능 안내 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-orange-500">
              스케줄 관리
            </h2>
            <p className="text-gray-700 mb-3">
              내 업무 스케줄을 한눈에 확인하세요
            </p>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 월간 스케줄</li>
              <li>• 오늘의 업무 확인</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-orange-500">
              업무 관리
            </h2>
            <p className="text-gray-700 mb-3">
              담당 이사 업무를 체계적으로 관리하세요
            </p>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 견적서 상세 확인</li>
              <li>• 고객 정보 확인</li>
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
