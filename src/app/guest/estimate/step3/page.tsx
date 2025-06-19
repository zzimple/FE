"use client";

import Button from "@/components/common/Button";
import EstimateHeader from "@/components/common/EstimateHeader";
import { useRouter } from "next/navigation";

export default function Step3Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white">
      <EstimateHeader step={3} title="주소입력" />
      <main className="flex-1 px-4 py-6 flex flex-col justify-center items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mt-4 mb-4 text-gray-900">
          <span className="text-blue-600">출발지와 도착지</span> 주소를 입력해
          주세요.
        </h2>
        <div className="flex flex-col gap-4 w-full max-w-md mb-8">
          <button
            onClick={() => router.push("/guest/estimate/step3/from-detail")}
            className="w-full h-14 rounded-xl border border-blue-300 text-base font-semibold text-gray-700 bg-white hover:bg-blue-50 transition"
          >
            출발지 주소 검색하기
          </button>
          <button
            onClick={() => router.push("/guest/estimate/step3/to-detail")}
            className="w-full h-14 rounded-xl border border-blue-300 text-base font-semibold text-gray-700 bg-white hover:bg-blue-50 transition"
          >
            도착지 주소 검색하기
          </button>
        </div>
        <Button
          onClick={() => {}}
          disabled
          className="w-full h-14 rounded-xl text-lg font-bold mt-2"
        >
          다음
        </Button>
      </main>
    </div>
  );
}
