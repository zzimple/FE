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

  // 최초 진입 시 localStorage에서 uuid 가져오기
  useEffect(() => {
    const fetchDraftId = async () => {
      try {
        const storedUuid = localStorage.getItem("uuid");
        if (storedUuid) {
          setUuid(storedUuid);
          console.log("기존 uuid 사용:", storedUuid);
        } else {
          const res = await authApi.post("/estimates/draft/start");
          const newUuid = res.data.data.draftId;
          setUuid(newUuid);
          localStorage.setItem("uuid", newUuid);
          console.log("새 uuid 발급:", newUuid);

          if (res.data.token) {
            localStorage.setItem("accessToken", res.data.token);
            console.log("토큰 저장 완료");
          }
        }
      } catch (err) {
        console.error("uuid 생성 실패:", err);
        alert("페이지를 불러오는 중 문제가 발생했어요. 다시 시도해주세요.");
        router.push("/");
      }
    };

    fetchDraftId();
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
      const res = await authApi.post(
        `/estimates/draft/move-type?draftId=${uuid}`,
        {
          moveType: selected.toUpperCase(),
        }
      );

      console.log("이사 유형 저장 성공:", res.data);
      router.push("/guest/estimate/step2");
    } catch (err) {
      console.error("이사 유형 저장 에러:", err);
      alert("이사 유형 저장에 실패했어요. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <EstimateProgressHeader step={1} title="이사 유형 선택" />
      <div className="w-full max-w-5xl px-4 md:px-12">
        <main className="mt-10 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
            어떤 <span className="text-blue-600">이사</span>를 진행하시나요?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 text-center mb-8">
            이사 유형을 선택해 주세요.
          </p>
          <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
            <button
              type="button"
              onClick={() => setSelected("small")}
              className={`flex-1 max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 transition-all duration-200
                ${selected === "small"
                  ? "border-blue-500 scale-105 shadow-xl"
                  : "border-transparent hover:border-blue-400"
                }
              `}
            >
              <span className="text-4xl mb-4">🚚</span>
              <span className="text-2xl font-bold mb-2">소형이사</span>
              <span className="text-gray-500 text-base">
                원룸, 투룸, 20평 미만
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSelected("family")}
              className={`flex-1 max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-2 transition-all duration-200
                ${selected === "family"
                  ? "border-blue-500 scale-105 shadow-xl"
                  : "border-transparent hover:border-blue-400"
                }
              `}
            >
              <span className="text-4xl mb-4">🏠</span>
              <span className="text-2xl font-bold mb-2">가정이사</span>
              <span className="text-gray-500 text-base">
                3룸 이상, 20평 이상
              </span>
            </button>
          </div>

          {/* 선택된 설명 */}
          {selected === "small" && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-base leading-relaxed shadow-sm mt-12 mb-8 w-full max-w-md md:max-w-md">
              <ul className="list-disc pl-4 space-y-1 text-blue-900">
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
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-base leading-relaxed shadow-sm mt-12 mb-8 w-full max-w-md md:max-w-md">
              <ul className="list-disc pl-4 space-y-1 text-blue-900">
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

          <Button
            onClick={handleConfirm}
            disabled={!selected}
            className="mt-8 w-full max-w-md h-16 rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition"
          >
            확인
          </Button>
        </main>
      </div>
    </div>
  );
}
