"use client";

import { useState } from "react";
import Link from "next/link";

export default function CustomerHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow fixed top-0 left-0 z-30">
      <div className="flex items-center justify-between px-4 py-3 h-14">
        {/* 로고 */}
        <Link href="/customer" className="text-xl font-bold text-blue-600">
          ZZIMPLE
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/guest/estimate/step1"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            견적서 작성
          </Link>
          <Link
            href="/guest/estimate"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            내 견적서
          </Link>
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            이사 내역
          </Link>
          <Link
            href="/guest/profile"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            내 정보
          </Link>
        </nav>

        {/* 햄버거 버튼 */}
        <button
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="메뉴 열기"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* 모바일 오버레이 메뉴 */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        >
          <nav
            className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-white shadow-lg flex flex-col pt-16 px-6 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-2xl text-gray-700"
              onClick={() => setOpen(false)}
              aria-label="메뉴 닫기"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <Link
              href="/estimate/step1"
              className="py-3 text-lg font-medium text-gray-800 border-b"
              onClick={() => setOpen(false)}
            >
              견적서 작성
            </Link>
            <Link
              href="/customer/my-estimates"
              className="py-3 text-lg font-medium text-gray-800 border-b"
              onClick={() => setOpen(false)}
            >
              내 견적서
            </Link>
            <Link
              href="/customer/history"
              className="py-3 text-lg font-medium text-gray-800 border-b"
              onClick={() => setOpen(false)}
            >
              이사 내역
            </Link>
            <Link
              href="/customer/profile"
              className="py-3 text-lg font-medium text-gray-800"
              onClick={() => setOpen(false)}
            >
              내 정보
            </Link>
          </nav>
        </div>
      )}
      <style jsx>{`
        .animate-slide-in {
          animation: slide-in 0.2s ease;
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
}
