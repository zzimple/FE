'use client'

import React from "react";
import { useRouter, usePathname } from "next/navigation";

const pages = [
  { label: '내 스케줄 관리', path: '/staff/schedule' },
  { label: '나의 정보', path: '/mypage/staff/profile' }
];

export default function PageHeader() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-full">
      {/* 페이지 네비게이션 */}
      <div className="flex justify-between items-center space-x-3 relative">
        {pages.map((page, index) => (
          <div
            key={page.label}
            className="flex-1 flex flex-col items-center cursor-pointer whitespace-nowrap"
            onClick={() => router.push(page.path)}
          >
            <span
              className={`
                text-sm text-center 
                ${pathname === page.path 
                  ? 'text-[#2948FF] font-semibold' 
                  : 'text-gray-400'}
              `}
            >
              {page.label}
            </span>
            <div
              className={`
                w-full h-0.5 mt-1 
                ${pathname === page.path ? 'bg-[#2948FF]' : 'bg-gray-200'}
              `}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 