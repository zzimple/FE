"use client";

import Button from "@/components/common/Button";
import EstimateHeader from "@/components/common/EstimateHeader";
import SelectTab from "@/components/common/SelectTab";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Step4Page() {
  const router = useRouter();
  const [category, setCategory] = useState<"가구" | "가전" | "기타">("가구");
  

  const handleNext = () => {
    router.push("/estimate/step6");
  };
  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white">
      <EstimateHeader step={5} title="짐 상세 정보 페이지" />

      <main className="flex-1 px-4 py-6 space-y-6">
        <h2 className="text-base font-semibold text-gray-900 text-center">
          <span className="text-blue-500">옮길 짐 상세정보</span>를
          입력해주세요.
        </h2>
        <div className="flex justify-center gap-2 rounded-full py-2">
          {["가구", "가전", "기타"].map((label) => (
            <SelectTab
              key={label}
              label={label}
              selected={category === label}
              onClick={() => setCategory(label as "가구" | "가전" | "기타")}
            />
          ))}
        </div>
      </main>

      <div className="px-4 py-6">
        <Button onClick={handleNext}>다음</Button>
      </div>
    </div>
  );
}
