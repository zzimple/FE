"use client";

import { useRouter } from "next/navigation";
import SignupHeader from "@/components/signup/SignupHeader";
import Image from "next/image";

export default function SignupCompletePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 py-4 sm:py-6 md:py-8 bg-white">
      <div className="w-full max-w-[320px] sm:max-w-md md:max-w-lg mb-4 sm:mb-6 md:mb-8">
        <SignupHeader title="회원가입 완료" currentStep={2} />
      </div>

      <div className="w-full max-w-[320px] sm:max-w-md md:max-w-lg flex flex-col items-center">
        {/* 이미지 섹션 */}
        <div className="relative w-[200px] sm:w-[240px] h-[200px] sm:h-[240px] mb-8 sm:mb-12">
          <Image
            src="/images/box.png"
            alt="포장박스 이미지"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* 텍스트 섹션 */}
        <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-12">
          <h1 className="text-xl sm:text-2xl font-bold">환영합니다!</h1>
          <p className="text-sm sm:text-base text-gray-600">
            이제 찜플과 함께<br />
            이사 견적을 확인해보세요.
          </p>
        </div>

        {/* 버튼 섹션 */}
        <button
          onClick={() => router.push("/login")}
          className="w-full h-11 sm:h-12 rounded-full bg-[#2948FF] text-white text-sm sm:text-base font-medium transition-colors hover:bg-[#1E3AD7] active:bg-[#152BA8]"
        >
          로그인하러 가기
        </button>
      </div>
    </main>
  );
} 