"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function OwnerStorePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white px-4 py-6 max-w-md mx-auto">
      <h1 className="text-center text-xl font-bold mb-6">마이페이지</h1>

      {/* 상호명 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          상호 명<span className="text-pink-500">*</span>
        </label>
        <input
          type="text"
          value="체리키티 이삿짐 센터"
          disabled
          className="w-full h-14 px-4 rounded-full border border-gray-300 bg-gray-50 text-sm"
        />
      </div>

      {/* 주소 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">주소</label>
        <input
          type="text"
          value="서울특별시 강동구 ~"
          disabled
          className="w-full h-14 px-4 rounded-full border border-gray-300 bg-gray-50 text-sm"
        />
      </div>

      {/* 직원 관리 */}
      <div className="mb-6">
        <p className="text-sm font-semibold mb-2">직원 관리</p>
        <button
          className="text-xs h-8 px-3 bg-blue-100 text-blue-600 rounded-md font-medium"
          onClick={() => router.push("/mypage/owner/staff")}
        >
          직원 목록 보기
        </button>
      </div>

      {/* 일정표 */}
      <div className="mb-6">
        <p className="text-sm font-semibold mb-2">일정표</p>
        <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
          <p className="text-sm font-medium">
            2025년 5월 9일 <span className="text-blue-600">(총 2건)</span>
          </p>

          <div className="flex items-center justify-between text-sm">
            <p>12:00 상암동 → 길음동</p>
            <button className="text-blue-600 bg-blue-100 px-3 h-7 rounded-full text-xs font-medium">
              자세히 보기
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <p>17:00 마포구 → 성북구</p>
            <button className="text-blue-600 bg-blue-100 px-3 h-7 rounded-full text-xs font-medium">
              자세히 보기
            </button>
          </div>
        </div>
      </div>

      <button className="text-xs h-8 px-3 bg-blue-100 text-blue-600 rounded-md font-medium">
        일정표 바로가기
      </button>
    </div>
  );
}