'use client'

import SignupHeader from "@/components/signup/SignupHeader";
import Link from "next/link";
// import { useRouter } from 'next/router';

export default function SignupTypePage() {
    // const router = useRouter;
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4">  {/* */}
            <SignupHeader title="회원가입" currentStep={0} />

            <div className="flex flex-col gap-4 w-full max-w-xs">
                <Link href="/signup/owner">
                    <button className="w-full py-2">사장님</button>
                </Link>

                <Link href="/signup/customer">
                <button className="w-full py-2">고객님</button>
                </Link>
            </div>
        </main>
    )
}