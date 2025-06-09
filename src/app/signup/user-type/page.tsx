// pages/signup/user-type/page.tsx

'use client';

import { useRouter } from 'next/navigation';

export default function SignupTypePage() {
    const router = useRouter();

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
            {/* 제목 */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-12 text-center">
                <span className="text-[#3496C3]">어떤 유형</span>으로 가입하시나요?
            </h1>

            {/* 버튼 컨테이너 */}
            <div className="flex flex-col gap-6 w-full max-w-xs">
                {/* 사장 가입 버튼 */}
                <button
                    onClick={() => router.push('/signup/owner/business-number')}
                    className="
            w-full
            py-3
            bg-[#DBEBFF] hover:bg-[#B5D7FF]
            text-[#3496C3] hover:text-[#1E73B7]
            font-semibold
            rounded-lg
            flex items-center justify-center gap-2
            transition
          "
                >
                    <span className="text-base sm:text-lg">사장으로 가입하기</span>
                </button>

                {/* 고객 / 직원 가입 버튼 */}
                <button
                    onClick={() => router.push('/signup/user')}
                    className="
            w-full
            py-3
            bg-[#DBEBFF] hover:bg-[#B5D7FF]
            text-[#3496C3] hover:text-[#1E73B7]
            font-semibold
            rounded-lg
            flex items-center justify-center gap-2
            transition
          "
                >
                    <span className="text-base sm:text-lg">고객/직원으로 가입하기</span>

                </button>
            </div>
        </main>
    );
}
