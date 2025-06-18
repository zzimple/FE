"use client";

import SignupHeader from "@/components/signup/SignupHeader";
import Link from "next/link";
// import { useRouter } from 'next/router';

export default function SignupTypePage() {
  // const router = useRouter;
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-xs flex flex-col items-center pt-6">
        <SignupHeader title="회원가입" currentStep={0} />
      </div>
      <div className="w-full max-w-xs flex flex-col items-center mt-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          어떤 <span className="text-blue-600">유형</span>으로 가입하시나요?
        </h1>
        <div className="flex flex-col gap-6 w-full">
          <Link href="/signup/owner/business-number">
            <button className="w-full h-14 rounded-full bg-blue-600 text-white text-lg font-semibold shadow-md hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400">
              사장으로 가입하기
            </button>
          </Link>
          <Link href="/signup/customer">
            <button className="w-full h-14 rounded-full border-2 border-blue-600 bg-white text-blue-600 text-lg font-semibold hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-200">
              고객/직원으로 가입하기
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
