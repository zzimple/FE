"use client";

import { useState } from "react";
import SignupHeader from "@/components/signup/SignupHeader";
import { useRouter } from "next/navigation";
import { publicApi } from "@/lib/axios";

// 🔹 사업자 등록번호 유효성 검사 함수
function isValidBusinessNumber(bno: string): boolean {
  if (!/^\d{10}$/.test(bno)) return false;

  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  const nums = bno.split("").map(Number);

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += nums[i] * weights[i];
  }
  sum += Math.floor((nums[8] * 5) / 10);
  const checkDigit = (10 - (sum % 10)) % 10;

  return nums[9] === checkDigit;
}

export default function BusinessNumberPage() {
  const router = useRouter();
  const [b_no, setB_no] = useState("");
  const [verified, setVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const handleVerify = async () => {
    if (!isValidBusinessNumber(b_no)) {
      setVerifyError("유효하지 않은 사업자 등록번호입니다.");
      setVerified(false);
      return;
    }

    setIsVerifying(true);
    setVerifyError("");

    try {
      const response = await publicApi.post("/owner/business/verify", {
        b_no: [b_no],
      });

      if (response.status === 200) {
        setVerified(true);
        setVerifyError("");
      }
    } catch (error: any) {
      setVerified(false);
      setVerifyError(error.response?.data?.message || "인증 실패");
      alert(error.response?.data?.message || "인증 실패");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = () => {
    if (verified) {
      router.push(`/signup/owner?bno=${b_no}`);
    } else {
      alert("사업자 등록번호 인증을 먼저 완료해주세요.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 py-4 sm:py-6 md:py-8 bg-white">
      <div className="w-full max-w-[320px] sm:max-w-md md:max-w-lg mb-4 sm:mb-6 md:mb-8">
        <SignupHeader title="회원가입" currentStep={1} />
      </div>

      <div className="w-full max-w-[320px] sm:max-w-md md:max-w-lg">
        <div className="space-y-4 sm:space-y-5">
          {/* 사업자 등록번호 입력 */}
          <div className="mb-3 sm:mb-4">
            <div className="space-y-2">
              <p className="text-sm sm:text-base font-bold">사업자 등록번호</p>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="-제외하고 입력"
                  value={b_no}
                  maxLength={10}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/[^0-9]/g, "");
                    setB_no(onlyDigits);
                    setVerified(false);
                    setVerifyError("");
                  }}
                  className="w-full h-11 sm:h-12 px-4 rounded-full border border-[#B3B3B3] text-sm sm:text-base focus:outline-none focus:border-black transition-colors"
                />
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={isVerifying || verified || b_no.length !== 10}
                  className={`absolute top-1/2 right-3 -translate-y-1/2 h-8 sm:h-9 px-4 rounded-full text-sm sm:text-base font-medium transition-colors ${
                    isVerifying || verified || b_no.length !== 10
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-200 text-black hover:bg-blue-300"
                  }`}
                >
                  {isVerifying ? "인증 중..." : verified ? "인증 완료" : "인증"}
                </button>
              </div>
            </div>
          </div>

          {/* 인증 결과 메시지 */}
          {verified && !verifyError && (
            <p className="text-sm sm:text-base text-green-500 mt-2 px-1">
              사업자 등록번호가 인증되었습니다.
            </p>
          )}
          {verifyError && (
            <p className="text-sm sm:text-base text-red-500 mt-2 px-1">
              {verifyError}
            </p>
          )}

          {/* 다음 버튼 */}
          <button
            type="button"
            onClick={handleNext}
            className={`w-full h-11 sm:h-12 rounded-full text-sm sm:text-base font-medium transition-colors ${
              verified
                ? "bg-[#2948FF] text-white hover:bg-[#1E3AD7] active:bg-[#152BA8]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            다음
          </button>
        </div>
      </div>
    </main>
  );
} 