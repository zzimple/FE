// components/signup/SignupHeader.tsx

'use client'

import { useRouter } from "next/navigation";

const steps = [
  { label: '유형 선택',      path: '/signup/user-type' },
  { label: '회원 정보 입력', path: '/signup/user-info' },
  { label: '회원가입 완료',  path: '/signup/signup-complete' }
];

interface SignupHeaderProps {
  title: string;        // 헤더 위에 표시할 페이지 이름
  currentStep: number;  // 현재 단계 인덱스
}

export default function SignupHeader({ title, currentStep }: SignupHeaderProps) {
  const router = useRouter();

  return (
    <div>
      {/* 페이지 이름 표시 */}
      <h1 className="text-xl font-bold mb-6 text-center">{title}</h1>

      {/* 현재 페이지 표시 */}
      <div className="flex justify-between items-center space-x-3 relative">
        {steps.map((step, index) => {
          
          // 회원가입 완료 단계(currentStep이 2)에서는 이전 단계로 이동 불가
          const canClick = currentStep !== 2 && index < currentStep;

          return (
            <div
              key={step.label}
              className={`
                flex-1 flex flex-col items-center 
                ${canClick ? 'cursor-pointer' : 'cursor-default'}
                whitespace-nowrap
              `}
              onClick={canClick ? () => router.push(step.path) : undefined}
            >
              <span
                className={`
                  text-sm text-center 
                  ${index === currentStep 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-gray-400'}
                `}
              >
                {step.label}
              </span>
              <div
                className={`
                  w-full h-0.5 mt-1 
                  ${index === currentStep ? 'bg-blue-600' : 'bg-gray-600'}
                `}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
