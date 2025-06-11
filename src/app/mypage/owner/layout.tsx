"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";

const ownerTabs = [
  { label: '견적서', href: '/owner/estimates' },
  { label: '직원 관리', href: '/mypage/owner/staff' },
  { label: '매출 관리', href: '/owner/sales' },
  { label: '나의 정보', hrefs: ['/mypage/owner/profile', '/mypage/owner/basicprice'] }
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const isActiveTab = (tab: typeof ownerTabs[0]) => {
    if ('hrefs' in tab) {
      return tab.hrefs.includes(pathname);
    }
    return pathname === tab.href;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 페이지 네비게이션 */}
      <div className="w-full px-4 py-3">
        <h1 className="text-2xl font-bold text-center py-8">마이페이지</h1>

        <div className="flex justify-between items-center space-x-3 relative">
          {ownerTabs.map((tab) => (
            <div
              key={tab.label}
              className="flex-1 flex flex-col items-center cursor-pointer whitespace-nowrap"
              onClick={() => router.push('href' in tab ? tab.href : tab.hrefs[0])}
            >
              <span
                className={`
                  text-sm text-center 
                  ${isActiveTab(tab)
                    ? 'text-[#2948FF] font-semibold'
                    : 'text-gray-400'}
                `}
              >
                {tab.label}
              </span>
              <div
                className={`
                  w-full h-0.5 mt-1 
                  ${isActiveTab(tab) ? 'bg-[#2948FF]' : 'bg-gray-200'}
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