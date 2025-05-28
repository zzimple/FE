'use client'

import { useRouter } from "next/navigation";

export default function SignupTypePage() {
    const router = useRouter();
    return (
        <div className="p-6">
            <p className="text-center text-xl font-bold mt-40 mb-6 "><span className="text-[#3496C3]">어떤 유형</span>으로 가입하시나요?</p>
            <div className="flex flex-col gap-8 items-center justify-center mt-15">
                <button
                    className="flex h-7 p-2.5 justify-center items-center gap-1.5 rounded-md bg-[#DBEBFF] font-semibold"><p className="font-semibold"
                    onClick={()=> router.push('/signup/business-number')}
                ><span className="text-[#3496C3]">사장</span>으로 가입하기</p></button>
                <button
                    className="flex h-7 p-2.5 justify-center items-center gap-1.5 rounded-md bg-[#DBEBFF] font-semibold"><p className="font-semibold"
                    onClick={()=> router.push('/signup/user-info?type=customer')}
                    ><span className="text-[#3496C3]">고객 / 직원</span>으로 가입하기</p></button>
                

            </div>
        </div>
    );
}