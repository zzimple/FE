"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  step: number;
  title: string;
  totalStep?: number;
}

export default function EstimateHeader({ step, title, totalStep = 7 }: Props) {
  const router = useRouter();
  const progressPercent = (step / totalStep) * 100;

  const handleBack = () => {
    // if (step > 1) {
    //   router.push(`/estimate/step${step - 1}`); // step3에서 2로
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/estimate/step1'); // 히스토리 없을 경우, 일단 step1로 가게 설정함 ~ 나중에 바꿀겨
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* 버튼 + 타이틀 */}
      <div className="flex items-center">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* flex-1 으로 너비를 채우고, text-center 로 가운데 정렬 */}
        <h1 className="flex-1 text-center text-xl font-bold">{title}</h1>

        {/* 오른쪽 여백을 채워줘서 균형을 맞춤 */}
        <div className="w-10" />
      </div>

      {/* 진행 바 */}
      <div className="w-full h-[4px] bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
