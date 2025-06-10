"use client";

import SignupHeader from "@/components/signup/SignupHeader";
import Link from "next/link";
// import { useRouter } from 'next/router';

export default function SignupTypePage() {
  // const router = useRouter;
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="pt-10 w-full max-w-xs">
        <SignupHeader title="회원가입" currentStep={0} />
        <div className="flex flex-col gap-6 mt-10">
          <Link href="/signup/owner">
            <button className="w-full h-14 rounded-full bg-blue-600 text-white text-lg font-semibold shadow hover:bg-blue-700 transition">
              사장님으로 가입
            </button>
          </Link>
          <Link href="/signup/customer">
            <button className="w-full h-14 rounded-full border border-blue-600 bg-white text-blue-600 text-lg font-semibold hover:bg-blue-50 transition">
              고객님으로 가입
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
