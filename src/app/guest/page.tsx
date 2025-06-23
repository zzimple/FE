"use client";

import Link from "next/link";
import GuestHeader from "@/components/headers/GuestHeader";

export default function GuestHome() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* 고객 전용 헤더 */}
      <GuestHeader />

      {/* 메인 배너 */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-30">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-600">
          고객님을 위한 ZZIMPLE
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          간편한 견적서 작성으로 <br />
          합리적인 이사 서비스를 받아보세요!
        </p>

        {/* 주요 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Link href="/guest/estimate/step1" className="flex">
            <button className="w-52 flex justify-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition">
              견적서 작성하기
            </button>
          </Link>
          <Link href="/guest/estimate/received/list" className="flex">
            <button className="w-52 flex justify-center bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              받은 견적서 보기
            </button>
          </Link>
          <Link href="/estimate/gpt" className="flex">
            <button className="w-52 flex justify-center bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              견적서 비교하기
            </button>
          </Link>
          <Link href="/estimate/vision" className="flex">
            <button className="w-52 flex justify-center bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              물품 찾기
            </button>
          </Link>
        </div>

        {/* 고객 전용 기능 안내 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-500">
              간편 견적서 작성
            </h2>
            <p className="text-gray-700 mb-3">
              몇 가지 질문만으로 정확한 견적을 받아보세요
            </p>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 이사할 집 정보 입력</li>
              <li>• 특별 취급 품목 선택</li>
              <li>• 원하는 날짜 지정</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-500">
              견적 비교 및 선택
            </h2>
            <p className="text-gray-700 mb-3">
              여러 사장님의 견적을 한눈에 비교하세요
            </p>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• 가격 비교</li>
              <li>• 원하는 가게 선택</li>
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
