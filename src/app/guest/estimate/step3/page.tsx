"use client";

import Button from "@/components/common/Button";
import EstimateHeader from "@/components/common/EstimateHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Step3Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<"from" | "to" | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <EstimateHeader step={3} title="주소입력" />
      <div className="w-full max-w-5xl px-4 md:px-12">
        <main className="mt-8 flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mt-4 mb-8 md:mb-20 text-gray-900">
            <span className="text-blue-600">출발지와 도착지</span> 주소를 입력해
            주세요.
          </h2>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full max-w-md md:max-w-2xl mb-12 md:mb-24">
            <button
              onClick={() => {
                setSelected("from");
                router.push("/guest/estimate/step3/from-detail");
              }}
              className={`w-full md:w-1/2 h-16 md:h-20 rounded-xl md:rounded-2xl border text-base md:text-xl font-semibold transition
                ${
                  selected === "from"
                    ? "bg-[#2988FF] text-white border-[#2988FF]"
                    : "border-blue-300 text-gray-700 bg-white hover:bg-blue-50"
                }
              `}
            >
              출발지 주소 검색하기
            </button>
            <button
              onClick={() => {
                setSelected("to");
                router.push("/guest/estimate/step3/to-detail");
              }}
              className={`w-full md:w-1/2 h-16 md:h-20 rounded-xl md:rounded-2xl border text-base md:text-xl font-semibold transition
                ${
                  selected === "to"
                    ? "bg-[#2988FF] text-white border-[#2988FF]"
                    : "border-blue-300 text-gray-700 bg-white hover:bg-blue-50"
                }
              `}
            >
              도착지 주소 검색하기
            </button>
          </div>
          <Button
            onClick={() => {}}
            disabled
            className="mt-8 w-full max-w-md h-16 rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition"
          >
            다음
          </Button>
        </main>
      </div>
    </div>
  );
}
