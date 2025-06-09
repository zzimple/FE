'use client'

import React from "react";
import { useRouter, usePathname } from "next/navigation";

const staffTabs = [
  { label: '내 스케줄 관리', href: '/staff/schedule' },
  { label: '나의 정보', href: '/mypage/staff/profile' }
];

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white">
      {/* 페이지 네비게이션 */}
      <div className="w-full px-4 py-3">
        <h1 className="text-2xl font-bold text-center py-8">마이페이지</h1>

        <div className="flex justify-between items-center space-x-3 relative">
          {staffTabs.map((tab) => (
            <div
              key={tab.label}
              className="flex-1 flex flex-col items-center cursor-pointer whitespace-nowrap"
              onClick={() => router.push(tab.href)}
            >
              <span
                className={`
                  text-sm text-center 
                  ${pathname === tab.href
                    ? 'text-[#2948FF] font-semibold'
                    : 'text-gray-400'}
                `}
              >
                {tab.label}
              </span>
              <div
                className={`
                  w-full h-0.5 mt-1 
                  ${pathname === tab.href ? 'bg-[#2948FF]' : 'bg-gray-200'}
                `}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="px-4">{children}</div>
    </div>
  );
} 