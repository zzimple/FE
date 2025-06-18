"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import EstimateHeader from "@/components/common/EstimateHeader";
import { authApi } from "@/lib/axios";

export default function Step8Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [estimateNo, setEstimateNo] = useState<number | null>(null);

  const handleFinalize = async () => {
    const draftId = localStorage.getItem("uuid");
    if (!draftId) {
      alert("uuid가 없습니다. 견적서를 다시 작성해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.post(
        `/estimates/draft/finalize?draftId=${draftId}`
      );
      const result = res.data.data;
      setEstimateNo(result);
      alert(`견적서가 저장되었습니다! estimateNo: ${result}`);
      console.log("최종 저장 성공:", result);

      // 👉 이후 이 번호로 상세 페이지로 이동할 수도 있음
      // router.push(`/estimate/final/${result}`);
    } catch (err) {
      console.error("견적서 저장 실패:", err);
      alert("저장에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white">
      <EstimateHeader step={8} title="견적서 최종 제출" />
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8">
        <p className="text-center mb-4 text-gray-800">
          모든 항목이 저장되었어요. 아래 버튼을 누르면 DB에 최종 제출됩니다.
        </p>
        <Button onClick={handleFinalize} disabled={isLoading}>
          {isLoading ? "제출 중..." : "견적서 최종 제출하기"}
        </Button>
        {estimateNo && (
          <p className="mt-4 text-sm text-green-600">
            제출 완료! 견적서 번호: {estimateNo}
          </p>
        )}
      </main>
    </div>
  );
}
