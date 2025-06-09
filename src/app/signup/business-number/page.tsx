"use client";

import { useState } from "react";
import SignupHeader from "@/components/signup/SignupHeader";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function BusinessNumberPage() {
  const router = useRouter();
  const [businessNumber, setBusinessNumber] = useState("");
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    try {
      // 1) 비동기 POST 요청 보내기
      const response = await api.post("/owner/verify-business", {
        businessNumber,
      });
      if (response.status === 200) {
        // 만약 응답 코드가 200(성공)이면,
        setVerified(true); // 인증 완료 상태로 바꿈!
        alert("인증되었습니다.");
      }
    } catch (error: any) {
      // 에러 발생 시, 서비가 보낸 에러 메시지가 있다면 꺼내 보내주고, 없으면 '인증실패' 기본 문구를 띄움
      alert(error.response?.data?.message || "인증실패");
    }
  };
  const handleNext = () => {
    if (verified) {
      router.push("/signup/user-info?type=owner");
    } else {
      alert("사업자 등록번호 인증을 먼저 완료해주세요.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4">
      {/* <h1 className="text-lg font-bold mb-8">회원가입</h1> */}
      <SignupHeader title="회원가입" currentStep={1} />
      <div className="w-full max-w-xs space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium mt-10">사업자 등록 번호</p>
          <div className="relative w-fill">
            <input
              type="text"
              placeholder="-포함 입력"
              value={businessNumber}
              onChange={(e) => setBusinessNumber(e.target.value)}
              className="w-full h-14 px-5 py-[18px] items-center gap-[10px] self-stretch rounded-full border border-[#B3B3B3] text-sm"
            />
            <button
              onClick={handleVerify}
              className="absolute top-1/2 right-4 -translate-y-1/2 h-[32px] px-4 rounded-full bg-[#DBEBFF] text-sm"
            >
              인증
            </button>
          </div>
        </div>
        {verified && (
          <p className="text-center text-sm text-gray-600 mt-2">
            {businessNumber} 인증되었습니다.
          </p>
        )}
        <div className="mt-10 flex">
          <button
            // onClick={() => router.push('/signup/user-info?type=owner')} // 이거는 그냥 인증 여부랑 상관없이 무조건 다음페이지로 넘어가는 것임! ui만 고려했을 떄 만든 것 고로 제거
            onClick={handleNext}
            className="w-full h-14 px-5 py-[18px] items-center gap-[10px] self-stretch rounded-full border border-[#B3B3B3] bg-[#2948FF] text-white text-center"
          >
            다음 페이지
          </button>
        </div>
      </div>
    </main>
  );
}
