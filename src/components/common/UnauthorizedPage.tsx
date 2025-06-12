// components/common/UnauthorizedPage.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-semibold mb-4 text-red-600">권한이 없습니다</h1>
      <p className="mb-6 text-gray-600 text-center">
        이 페이지에 접근할 권한이 없습니다. 올바른 계정으로 로그인해주세요.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
      >
        홈으로 이동
      </button>
    </div>
  );
}
