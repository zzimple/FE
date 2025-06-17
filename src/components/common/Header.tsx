"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow fixed top-0 left-0 z-30">
      <div className="flex items-center justify-between px-4 py-3 h-14">
        {/* 로고 */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          ZZIMPLE 이사
        </Link>
        {/* 햄버거 버튼 */}
        <button
          className="text-2xl text-gray-700 focus:outline-none"
          onClick={() => setOpen(!open)}
          aria-label="메뉴 열기"
        >
          {/* 햄버거 아이콘 */}
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
      {/* 오버레이 메뉴 */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
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
              href="/login"
              className="py-3 text-lg font-medium text-gray-800 border-b"
              onClick={() => setOpen(false)}
            >
              로그인
            </Link>
            <Link
              href="/signup/user-type"
              className="py-3 text-lg font-medium text-gray-800 border-b"
              onClick={() => setOpen(false)}
            >
              회원가입
            </Link>
            <Link
              href="/community"
              className="py-3 text-lg font-medium text-gray-800"
              onClick={() => setOpen(false)}
            >
              커뮤니티
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
