"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// 수정: 인증 관련 함수를 import 합니다.
import { authApi, getAccessTokenFromCookie } from "@/lib/axios";

export default function OwnerHeader() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false); // 추가
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // 클라이언트에서만 true
    const token = getAccessTokenFromCookie();
    setIsLoggedIn(!!token);
  }, []);

  if (!isClient) return null; // SSR에서는 아무것도 렌더링하지 않음

  const handleLogout = async () => {
    try {
      await authApi.post("/users/logout");
    } catch (error) {
      console.error("❌ 로그아웃 API 호출 실패", error);
    } finally {
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      setIsLoggedIn(false);
      setOpen(false);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <header className="w-full bg-white shadow fixed top-0 left-0 z-30 font-pretendard">
      <div className="flex items-center justify-between px-6 md:px-12 py-4 h-20">
        {/* 로고 */}
        <Link
          href="/"
          className="text-2xl md:text-3xl font-extrabold text-green-600 tracking-tight select-none"
          style={{ fontFamily: "Pretendard, sans-serif" }}
        >
          ZZIMPLE
        </Link>
        {/* 데스크탑 메뉴 */}
        <nav className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <Link
                href="/owner"
                className="text-base font-semibold text-gray-700 hover:text-green-600 transition-colors"
              >
                사장님 홈
              </Link>
              <Link
                href="/owner/estimates"
                className="text-base font-semibold text-gray-700 hover:text-green-600 transition-colors"
              >
                견적서 관리
              </Link>
              <Link
                href="/estimate/owner/publiclist"
                className="text-base font-semibold text-gray-700 hover:text-green-600 transition-colors"
              >
                고객 견적서
              </Link>
              <Link
                href="/owner/staff"
                className="text-base font-semibold text-gray-700 hover:text-green-600 transition-colors"
              >
                직원 관리
              </Link>
              <Link
                href="/owner/shop"
                className="text-base font-semibold text-gray-700 hover:text-green-600 transition-colors"
              >
                매출 관리
              </Link>
              <Link
                href="/owner/profile"
                className="text-base font-semibold text-gray-700 hover:text-green-600 transition-colors"
              >
                마이페이지
              </Link>
              <button
                onClick={handleLogout}
                className="text-base font-semibold text-gray-700 hover:text-green-600 transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            // 수정: 로그아웃 시 "로그인"과 "회원가입"을 모두 보여줍니다.
            <>
              <Link
                href="/login"
                className="text-base font-semibold text-gray-700 hover:text-green-600 transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/signup/user-type"
                className="text-base font-semibold text-gray-700 hover:text-green-600 transition-colors"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
        {/* 햄버거 버튼 */}
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
          className="fixed inset-0 z-40 flex flex-col items-center animate-slide-down md:hidden"
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
              className="text-2xl font-extrabold text-green-600 mb-8 select-none"
              style={{ fontFamily: "Pretendard, sans-serif" }}
              onClick={() => setOpen(false)}
            >
              ZZIMPLE
            </Link>
            {/* 수정: 모바일 메뉴도 로그인 상태에 따라 다르게 보여줍니다. */}
            {isLoggedIn ? (
              <>
                <Link
                  href="/owner"
                  className="py-3 text-lg font-semibold text-gray-800 w-full text-center hover:text-green-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  사장님 홈
                </Link>
                <Link
                  href="/owner/estimates"
                  className="py-3 text-lg font-semibold text-gray-800 w-full text-center hover:text-green-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  견적서 관리
                </Link>
                <Link
                  href="/estimate/owner/publiclist"
                  className="py-3 text-lg font-semibold text-gray-800 w-full text-center hover:text-green-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  고객 견적서
                </Link>
                <Link
                  href="/owner/staff"
                  className="py-3 text-lg font-semibold text-gray-800 w-full text-center hover:text-green-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  직원 관리
                </Link>
                <Link
                  href="/owner/shop"
                  className="py-3 text-lg font-semibold text-gray-800 w-full text-center hover:text-green-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  매출 관리
                </Link>
                <Link
                  href="/owner/profile"
                  className="py-3 text-lg font-semibold text-gray-800 w-full text-center hover:text-green-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-3 text-lg font-semibold text-gray-800 w-full text-center hover:text-green-600 transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="py-3 text-lg font-semibold text-gray-800 w-full text-center hover:text-green-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  href="/signup/user-type"
                  className="py-3 text-lg font-semibold text-gray-800 w-full text-center hover:text-green-600 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}
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
