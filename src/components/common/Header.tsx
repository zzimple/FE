"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);

  // 로그아웃 관련 함수
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('accessToken'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header className="w-full bg-white shadow fixed top-0 left-0 z-30 font-pretendard">
      <div className="flex items-center justify-between px-6 md:px-12 py-4 h-20">
        {/* 로고 */}
        <Link
          href="/"
          className="text-2xl md:text-3xl font-extrabold text-[#3454FF] tracking-tight select-none"
          style={{ fontFamily: "Pretendard, sans-serif" }}
        >
          ZZIMPLE
        </Link>
        {/* 데스크탑 메뉴 */}
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-base font-semibold text-gray-700 hover:text-[#3454FF] transition-colors"
            >
              로그아웃
            </button>
            ) : (
            <>
              <Link
              href="/login"
              className="text-base font-semibold text-gray-700 hover:text-[#3454FF] transition-colors"
            >
              로그인
            </Link>
            <Link
              href="/signup/user-type"
              className="text-base font-semibold text-gray-700 hover:text-[#3454FF] transition-colors"
            >
              회원가입
                </Link>
              </>
          )}
          
        </div>
        {/* 모바일 햄버거 */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10"
          onClick={() => setOpen(true)}
          aria-label="메뉴 열기"
        >
          {/* SVG 햄버거 아이콘 */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="6" width="28" height="2.5" rx="1.25" fill="#222" />
            <rect y="13" width="28" height="2.5" rx="1.25" fill="#222" />
            <rect y="20" width="28" height="2.5" rx="1.25" fill="#222" />
          </svg>
        </button>
      </div>
      {/* 모바일 오버레이 메뉴 */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center animate-slide-down"
          style={{
            backdropFilter: "blur(8px)",
            background: "rgba(0,0,0,0.15)",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full bg-white pt-8 pb-8 px-6 flex flex-col items-center relative shadow-lg"
            style={{ maxWidth: "100vw" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              className="absolute top-6 right-6 text-3xl"
              onClick={() => setOpen(false)}
              aria-label="메뉴 닫기"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="6"
                  y1="6"
                  x2="22"
                  y2="22"
                  stroke="#222"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="22"
                  y1="6"
                  x2="6"
                  y2="22"
                  stroke="#222"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <Link
              href="/"
              className="text-2xl font-extrabold text-[#3454FF] mb-8 select-none"
              style={{ fontFamily: "Pretendard, sans-serif" }}
            >
              ZZIMPLE              
            </Link>
            <Link
              href="/login"
              className="py-3 text-lg font-semibold text-gray-800 w-full text-center hover:text-[#3454FF] transition-colors"
              onClick={() => setOpen(false)}
            >
              로그인
            </Link>
            <Link
              href="/signup/user-type"
              className="py-3 text-lg font-semibold text-gray-800 w-full text-center hover:text-[#3454FF] transition-colors"
              onClick={() => setOpen(false)}
            >
              회원가입
            </Link>
          </div>
        </div>
      )}
      <style jsx>{`
        .animate-slide-down {
          animation: slide-down 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </header>
  );
}
