// components/common/UnauthorizedPage.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gray-50">
      <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <span
          aria-label="접근 불가 아이콘"
          className="mb-4 text-red-500"
          role="img"
        >
          {/* 경고/잠금 아이콘 (SVG) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M5.07 19h13.86A2 2 0 0021 17.07l-7.07-12.14a2 2 0 00-3.46 0L3 17.07A2 2 0 005.07 19z"
            />
          </svg>
        </span>
        <h1 className="text-2xl font-bold mb-2 text-red-600">
          접근 권한이 없습니다
        </h1>
        <p className="mb-6 text-gray-700 text-center text-base">
          이 페이지는 현재 계정으로 접근하실 수 없습니다.
          <br />
          권한이 있는 계정으로 로그인하거나, 이전 페이지로 돌아가 주세요.
        </p>
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          {/* 홈 아이콘 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0h4m-4 0a2 2 0 01-2-2v-4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2z"
            />
          </svg>
          홈으로 이동
        </button>
      </div>
    </div>
  );
}
