"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  step: number;
  title: string;
  totalStep?: number;
}

export default function EstimateHeader({ step, title, totalStep = 7 }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const progressPercent = (step / totalStep) * 100;

  const handleBack = () => {
    if (pathname.includes("/from-detail") || pathname.includes("/to-detail")) {
      router.push("/guest/estimate/step3");
    } else if (step > 1) {
      router.push(`/guest/estimate/step${step - 1}`);
    } else {
      router.push("/guest/estimate/step1");
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">{title}</h1>
        <div className="w-10" />
      </div>

      <div className="w-full h-[4px] bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
