'use client';

import Button from "@/components/common/Button";
import EstimateHeader from "@/components/common/EstimateHeader";
import { useRouter } from "next/navigation";

export default function Step3Page() {
    const router = useRouter();

    return (
      <div className="min-h-screen flex flex-col w-full max-auto bg-white">
        <EstimateHeader step={3} title="주소입력" />

        <main className="flex-1 px-4 py-6 space-y-6">
          <h2 className="text-base font-semibold text-gray-900 text-center">
            <span className="text-blue-500">출발지와 도착지</span> 주소를
            입력해주세요.
          </h2>
          {/* 출발지 주소 검색 버튼 */}
          <button
            onClick={() => router.push("/estimate/step3/from-detail")}
            className="w-full px-4 py-3 rounded-xl border text-gray-500"
          >
            출발지 주소 검색하기
          </button>
          {/* 도착지 주소 검색 버튼 */}
          <button
            onClick={() => router.push("/estimate/step3/to-detail")}
            className="w-full px-4 py-3 rounded-xl border text-gray-500"
          >
            도착지 주소 검색하기
          </button>
        </main>
        <div className="px-4 py-6">
          <Button onClick={() => {}} disabled>
            다음
          </Button>
        </div>
      </div>
    );

}