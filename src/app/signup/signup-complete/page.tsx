"use client";

import { useRouter } from "next/navigation";
import SignupHeader from "../../../components/signup/SignupHeader";

export default function SignupCompletePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center px-4">
      <SignupHeader title="회원가입 완료" currentStep={2} />

      {/* <h1 className="text-lg font-bold mb-8">회원가입 완료</h1> */}

      <div className="w-full max-w-xs space-y-6">
        <img
          src="/images/box.png"
          alt="포장박스 이미지"
          className="mx-auto w-[200px] h-auto mt-20 mb-10"
        />

        <div className="mt-20 text-center text-base font-medium mb-10">
          <p className="text-xl font-bold">환영합니다!</p>
          <p className="mt-2">이제 찜플과 함께 이사 견적을 확인해보세요.</p>
        </div>

        <button
          onClick={() => router.push("/login")}
          className="w-full h-14 px-5 rounded-full border border-[#B3B3B3] bg-[#2948FF] text-white text-center text-base font-semibold"
        >
          로그인하러 가기
        </button>
      </div>
    </main>
  );
}
