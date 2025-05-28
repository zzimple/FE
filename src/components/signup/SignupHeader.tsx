'use client'

import { useRouter } from "next/navigation";

const steps = [
    { label: '유형 선택', path: '/signup/user-type' },
    { label: '회원 정보 입력', path: '/signup/user-info' },
    { label: '회원가입 완료', path: '/signup/signup-complete' }
];

interface SignupHeaderProps { // 현재 단계를 받아올 수 있는 props를 정의함
    title: string; // 헤더 위에 페이지 이름?을 표시할 거임
    currentStep: number; // props로 현재단계를 받아서 나중에 단계를 표시할 거임
}
export default function SignupHeader({ title, currentStep }: SignupHeaderProps) {
    const router = useRouter();
    return (
        <div>
            {/* <h1 className="text-center font-bold text-xl mb-4">회원가입</h1> */}
            {/* 페이지 이름 표시 */}
            <h1 className="text-xl font-bold mb-6 text-center">{title}</h1>

                    {/* 현재 페이지 표시*/}
            <div className="flex justify-between items-center space-x-3">
                {steps.map((step, index) => (
                    <div
                        key={step.label}
                        className="flex-1 flex flex-col items-center cursor-pointer whitespace-nowrap"
                        onClick={() => router.push(step.path)}
                    >
                        <span
                            className={`text-sm text-center ${index === currentStep ? 'text-blue-600 font-semibold' : 'text-gray-400'
                                }`}
                        >
                            {step.label}
                        </span>
                        <div
                            className={`w-full h-0.5 mt-1 ${index === currentStep ? 'bg-blue-600' : 'bg-gray-600'
                                }`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
