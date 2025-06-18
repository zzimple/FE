"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/axios";
import Button from "@/components/common/Button";
import EstimateProgressHeader from "@/components/common/EstimateHeader";
import { useRouter } from "next/navigation";

export default function Step1Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);

  // ✅ 최초 진입 시 localStorage에서 uuid 가져오기
  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid");
    console.log(storedUuid);
    if (storedUuid) {
      setUuid(storedUuid);
    } else {
      // ❗ uuid가 없으면 이전 페이지에서 견적서 초안을 생성하지 않은 상태이므로 안내 후 홈으로 보냄
      console.warn("uuid가 없습니다. 견적서를 처음부터 작성해주세요.");
      alert("견적서를 먼저 생성해주세요.");
      router.push("/estimate/start"); // 👉 필요한 경로로 바꿔도 됨
    }
  }, [router]);

  // ✅ 이사 유형 선택 후 서버로 전송
  const handleConfirm = async () => {
    console.log("현재 uuid:", uuid);
    console.log("현재 selected:", selected);

    if (!uuid || !selected) {
      alert("uuid나 이사 유형이 없습니다.");
      return;
    }

    try {
      localStorage.setItem(
        "moveType",
        selected === "small" ? "소형이사" : "가정이사"
      );
      const res = await authApi.post(`/estimates/draft/move-type?draftId=${uuid}`, {
        moveType: selected.toUpperCase(),
      });

      console.log("이사 유형 저장 성공:", res.data);
      router.push("/guest/estimate/step2");
    } catch (err) {
      console.error("이사 유형 저장 에러:", err);
      alert("이사 유형 저장에 실패했어요. 다시 시도해주세요.");
    }
  };


  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto">
      <EstimateProgressHeader step={1} title="이사 유형 선택" />

      <main className="flex-1 px-4 py-6">
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 text-center">
          <span className="text-blue-500">어떤 이사</span>를 진행하시나요?
        </h2>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setSelected("small")}
            className={`flex-1 py-3 rounded-full border text-center text-sm font-medium ${
              selected === "small"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-800 border-gray-300"
            }`}
          >
            소형이사
          </button>
          <button
            type="button"
            onClick={() => setSelected("family")}
            className={`flex-1 py-3 rounded-full border text-center text-sm font-medium ${
              selected === "family"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-800 border-gray-300"
            }`}
          >
            가정이사
          </button>
        </div>

        {selected === "small" && (
          <div className="bg-gray-100 rounded-xl p-4 text-xs leading-relaxed mb-6">
            <ul className="list-disc pl-4 space-y-1">
              <li>원룸, 투룸, 20평대 미만 고객님께 추천드려요.</li>
              <li>고객님과 상황에 맞는 서비스 선택이 가능합니다.</li>
              <li>
                주요 차량: 1~2.5톤 트럭
                <br />
                이사 유형: 일반 / 반포장 / 포장
              </li>
            </ul>
          </div>
        )}
        {selected === "family" && (
          <div className="bg-gray-100 rounded-xl p-4 text-xs leading-relaxed mb-6">
            <ul className="list-disc pl-4 space-y-1">
              <li>3룸 이상, 20평대 이상 고객님께 추천드려요.</li>
              <li>가정집 전문 포장이사 업체를 통해 진행해요.</li>
              <li>
                주요 차량: 2.5~5톤 트럭
                <br />
                이사 유형: 전문 포장이사
              </li>
            </ul>
          </div>
        )}
      </main>

      <div className="px-4 py-6">
        <Button onClick={handleConfirm} disabled={!selected} className="w-full">
          확인
        </Button>
      </div>
    </div>
  );
}
