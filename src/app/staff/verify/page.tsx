"use client";

import React, { useState, useEffect } from "react";
import { authApi } from "@/lib/axios";
import { useRouter } from "next/navigation";
import StaffHeader from "@/components/headers/StaffHeader";


export default function StaffVerifyPage() {
  const [centerCode, setCenterCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const formatPhoneNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length <= 3) return digitsOnly;
    if (digitsOnly.length <= 7) return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7, 11)}`;
  };

  // 이미 staff 권한이 있는지 확인
  useEffect(() => {
    const checkStaffAccess = async () => {
      try {
        const res = await authApi.get("/staff/profile");
        if (res.data.success) {
          // 이미 staff 권한이 있으면 profile 페이지로 이동
          router.push("/staff/profile");
          return;
        }
      } catch (e) {
        // 에러가 발생하면 staff 권한이 없는 것으로 간주하고 인증 페이지를 보여줌
        console.log("Staff 권한 없음 - 인증 페이지 표시");
      } finally {
        setIsLoading(false);
      }
    };

    checkStaffAccess();
  }, [router]);

  const handleRequestCenterVerification = async () => {
    if (!centerCode.trim()) {
      alert("센터 코드(사장님 번호)를 입력해주세요.");
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationMessage(null);
      const res = await authApi.post("/staff/request", {
        ownerPhoneNumber: centerCode.trim(),
      });
      setVerificationMessage(res.data.message || "인증 요청이 성공적으로 전송되었습니다.");
    } catch (err: any) {
      console.error("센터 인증 요청 실패", err);
      const msg = err.response?.data?.message || "인증 요청 중 오류가 발생했습니다.";
      setVerificationMessage(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  // 로딩 중인 경우 로딩 표시
  if (isLoading) {
    return <div className="text-center mt-20 text-gray-500">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffHeader />
      <div className="max-w-md mx-auto px-4 py-8 pt-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              스태프 인증
            </h1>
            <p className="text-gray-600 text-sm">
              사장님께 인증을 받아 스태프 권한을 획득하세요
            </p>
          </div>

          {/* 인증 폼 */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사장님 전화번호
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="예: 010-1234-5678"
                  value={centerCode}
                  onChange={(e) => setCenterCode(formatPhoneNumber(e.target.value))}
                  className="w-full h-14 px-4 pr-28 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleRequestCenterVerification}
                  disabled={isVerifying}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isVerifying ? "인증 중..." : "인증요청"}
                </button>
              </div>
              {verificationMessage && (
                <p className={`mt-2 text-sm ${verificationMessage.includes('성공') ? 'text-green-600' : 'text-red-600'}`}>
                  {verificationMessage}
                </p>
              )}
            </div>

            {/* 안내사항 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">인증 안내</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• 사장님 전화번호를 정확히 입력해주세요</li>
                <li>• 인증 요청 시 사장님께 SMS가 발송됩니다</li>
                <li>• 사장님이 승인하면 스태프 권한이 부여됩니다</li>
                <li>• 인증 완료 후 스태프 페이지에 접근할 수 있습니다</li>
              </ul>
            </div>

            {/* 뒤로가기 버튼 */}
            <button
              onClick={() => router.back()}
              className="w-full h-12 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              뒤로가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 