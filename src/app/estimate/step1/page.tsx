"use client";

import { useEffect, useState } from "react"; 
import axios from "axios";
import api from "@/lib/api"; 
import Button from "@/components/common/Button";
import EstimateProgressHeader from "@/components/common/EstimateHeader";
// import { useEstimate } from "@/context/EstimateContext";
import { useRouter } from "next/navigation";

export default function Step1Page() {
  const router = useRouter();
  // const { uuid } = useEstimate();
  const [selected, setSelected] = useState<string | null>(null); 
  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    const storedUuid = localStorage.getItem("uuid");
    if (storedUuid) {
      setUuid(storedUuid);
    } else {
      // uuid가 없다면 서버에 발급 요청
      const createDraft = async () => {
        try {
          const res = await axios.post("/estimate/draft/start", null, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const newUuid = res.data.uuid;
          localStorage.setItem("uuid", newUuid);
          setUuid(newUuid); // ✅ 상태에 저장
        } catch (err) {
          console.error("UUID 발급 실패:", err);
        }
      };

      createDraft(); // ✅ 발급 실행
    }
  }, []);
  
  const handleConfirm = async () => {
    if (!uuid || !selected) return;
  
    try {
      const res = await axios.post(
        `/estimates/draft/move-type?draftId=${uuid}`, // ✅ query param으로 draftId 전달
        { moveType: selected.toUpperCase() },          // ✅ body에 moveType 전달 (SMALL/FAMILY)
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      console.log("응답 데이터:", res.data); // ✅ 응답 확인용
      router.push("/estimate/step2");
    } catch (err) {
      console.error("이사 유형 저장 에러:", err);
    }
  };
  

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
