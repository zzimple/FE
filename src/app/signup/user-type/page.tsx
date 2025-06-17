// pages/signup/user-type/page.tsx

"use client";

import { useRouter } from "next/navigation";

export default function SignupTypePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-xs pt-10">
        <h1 className="text-2xl font-bold text-center mb-10">
          어떤 <span className="text-blue-600">유형</span>으로 가입하시나요?
        </h1>
        <div className="flex flex-col gap-6 mt-6">
          <button
            onClick={() => router.push("/signup/owner/business-number")}
            className="w-full h-14 rounded-full bg-blue-600 text-white text-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            사장으로 가입하기
          </button>
          <button
            onClick={() => router.push("/signup/user")}
            className="w-full h-14 rounded-full border border-blue-600 bg-white text-blue-600 text-lg font-semibold hover:bg-blue-50 transition"
          >
            고객/직원으로 가입하기
          </button>
        </div>
      </div>
    </main>
  );
}
