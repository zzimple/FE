// 'use client';

// import TabHeader, { Tab } from "@/components/common/TabHeader";
// import { useRouter } from "next/router";
// import { useState } from "react";

// export default function OwnerProfilePage() {
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const router = useRouter();

//   return (
//     <main className="px-4">
//       <TabHeader
//           tabs={[
//             { label: '견적서', href: '/mypage/owner/estimates' },
//           { label: '나의 가게 관리', href: '/mypage/owner/shop' },
//           { label: '매출 관리', href: '/mypage/owner/sales' },
//           { label: '나의 정보', href: '/mypage/owner/profile' },
//         ]}
//     />
//     </main>
//   )

// }
"use client";

import React from "react";

export default function MyPageInfoForm() {
  return (
    <div className="min-h-screen bg-white px-4 py-6 max-w-md mx-auto relative">
      <h1 className="text-center text-xl font-bold mb-6">마이페이지</h1>

      {/* 이름 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          이름<span className="text-pink-500">*</span>
        </label>
        <input
          type="text"
          value="조연제"
          disabled
          className="w-full h-14 px-4 rounded-full border border-gray-300 bg-gray-50 text-sm"
        />
      </div>

      {/* 아이디 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">아이디</label>
        <input
          type="text"
          value="hellokitty83"
          disabled
          className="w-full h-14 px-4 rounded-full border border-gray-300 bg-gray-50 text-sm"
        />
      </div>

      {/* 비밀번호 */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium mb-1">
          비밀번호<span className="text-pink-500">*</span>
        </label>
        <input
          type="password"
          value="********"
          disabled
          className="w-full h-14 px-4 pr-28 rounded-full border border-gray-300 bg-white text-sm"
        />
        <button
          type="button"
          className="absolute right-4 top-10 inline-flex h-[28px] px-[10px] justify-center items-center gap-1 rounded-full bg-blue-100 text-blue-600 text-xs"
        >
          변경하기
        </button>
      </div>

      {/* 이메일 주소 */}
      <div className="mb-4 relative">
        <label className="block text-sm font-medium mb-1">
          이메일 주소 (선택)
        </label>
        <input
          type="email"
          value="kitty83@naver.com"
          disabled
          className="w-full h-14 px-4 pr-28 rounded-full border border-gray-300 bg-gray-50 text-sm text-gray-400"
        />
        <button
          type="button"
          className="absolute right-4 top-10 inline-flex h-[28px] px-[10px] justify-center items-center gap-1 rounded-full bg-blue-100 text-blue-600 text-xs"
        >
          변경하기
        </button>
      </div>
    </div>
  );
}
