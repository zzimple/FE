"use client";

import React, { useState } from "react";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";

// 더미 견적서 데이터
const dummyEstimates = [
  {
    id: 1,
    company: "이사왕",
    price: 1200000,
    truck: 2,
    extra: 50000,
    message: "포장 꼼꼼히 해드립니다!",
  },
  {
    id: 2,
    company: "이사천국",
    price: 1100000,
    truck: 1,
    extra: 100000,
    message: "추가금 투명하게 안내!",
  },
  {
    id: 3,
    company: "이사마스터",
    price: 1300000,
    truck: 2,
    extra: 0,
    message: "경험 많은 기사님 배정!",
  },
];

export default function ReceivedEstimatesPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const router = useRouter();

  const handleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((sid) => sid !== id));
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
    }
  };

  const selectedEstimates = dummyEstimates.filter((e) =>
    selected.includes(e.id)
  );

  // GPT 비교 멘트 예시
  const gptComment =
    selectedEstimates.length === 2
      ? `\n\n\uD83D\uDCC8 두 업체 모두 트럭 개수는 비슷하지만, \"${
          selectedEstimates[0].company
        }\"는 추가금이 적고, \"${
          selectedEstimates[1].company
        }\"는 기본 견적이 더 저렴합니다.\n\n고객님의 예산과 추가 서비스 필요 여부에 따라 선택하시면 좋겠습니다!\n\n추천: \"${
          selectedEstimates[0].price + selectedEstimates[0].extra <
          selectedEstimates[1].price + selectedEstimates[1].extra
            ? selectedEstimates[0].company
            : selectedEstimates[1].company
        }\"`
      : "";

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
        받은 견적서 관리
      </h1>
      <div className="space-y-4 mb-8">
        {dummyEstimates.map((estimate) => (
          <div
            key={estimate.id}
            className={`border rounded-lg p-4 flex flex-col gap-2 shadow-sm ${
              selected.includes(estimate.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
            onClick={() => handleSelect(estimate.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">{estimate.company}</span>
              <input
                type="checkbox"
                checked={selected.includes(estimate.id)}
                readOnly
                className="w-5 h-5 accent-blue-500"
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>
                견적가: <b>{estimate.price.toLocaleString()}원</b>
              </span>
              <span>트럭: {estimate.truck}대</span>
              <span>추가금: {estimate.extra.toLocaleString()}원</span>
            </div>
            <div className="text-gray-600 text-sm">{estimate.message}</div>
          </div>
        ))}
      </div>
      <Button
        className="w-full h-12 text-lg font-bold"
        disabled={selected.length !== 2}
        onClick={() => {
          if (selected.length === 2) {
            router.push(`/estimate/gpt?ids=${selected.join(",")}`);
          }
        }}
      >
        선택한 2개 견적 비교하기
      </Button>
    </div>
  );
}
