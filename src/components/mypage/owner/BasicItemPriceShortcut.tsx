"use client";

import { useRouter } from "next/navigation";

export default function BasicItemPriceShortcut() {
  const router = useRouter();

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">물품 기본금 설정</label>
      <div
        onClick={() => router.push("/mypage/owner/basicprice")}
        className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <span className="text-sm text-gray-600">기본금 설정하러 가기</span>
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}
