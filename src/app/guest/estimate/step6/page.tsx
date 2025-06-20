"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import EstimateHeader from "@/components/common/EstimateHeader";
import SelectTab from "@/components/common/SelectTab";
import { authApi } from "@/lib/axios";

interface ServiceOption {
  id: string;
  title: string;
  description: string;
  image: string;
  mandatories: string[];
}

const serviceOptions: ServiceOption[] = [
  {
    id: "일반",
    title: "일반이사",
    description: "포장된 짐을 목적지 공간까지 이동/운반합니다.",
    image: "/images/일반이사.jpeg",
    mandatories: [
      "이사 전까지 모든 포장을 완료해야 합니다.",
      "운반된 짐의 파손이나 분실 여부를 확인합니다.",
      "이후 이사를 직접 마무리합니다.",
    ],
  },
  {
    id: "반포장",
    title: "반포장이사",
    description:
      "고객님과 포장을 함께 진행하며, 도착지에서 가구 배치까지 돕습니다.",
    image: "/images/반포장이사.jpeg",
    mandatories: [
      "이사 전까지 귀중품 및 고가의 상품은 별도로 체크/보관해야 합니다.",
      "제공된 박스로 함께 포장을 진행합니다.",
      "운반된 짐의 파손이나 분실 여부를 확인합니다.",
      "박스의 잔 짐은 직접 정리합니다.",
      "이후 이사를 직접 마무리합니다.",
    ],
  },
  {
    id: "포장",
    title: "포장이사",
    description: "포장, 운반, 이동, 정리 등 모든 이사 과정을 진행합니다.",
    image: "/images/포장이사.jpeg",
    mandatories: [
      "이사 전까지 귀중품 및 고가의 상품은 별도로 체크/보관해야 합니다.",
      "운반된 짐의 파손이나 분실 여부를 확인합니다.",
      "도착지에서 가구와 짐이 배치될 곳을 안내합니다.",
      "완료된 이사를 기사님과 함께 검수합니다.",
    ],
  },
  {
    id: "가정이사",
    title: "가정이사",
    description:
      "규모가 큰 포장이사를 전문으로 하는 업체에서 보양작업, 포장, 운반, 이동, 정리 등 전체 과정을 수행하며, 요청에 따른 추가 서비스도 제공합니다.",
    image: "/images/가정이사.jpeg",
    mandatories: [
      "방문 견적 진행 후 최종 견적서를 확인합니다.",
      "이사 전까지 귀중품 및 고가의 상품은 별도로 체크/보관해야 합니다.",
      "운반된 짐의 파손이나 분실 여부를 확인합니다.",
      "도착지에서 가구와 짐이 배치될 곳을 안내합니다.",
      "완료된 이사를 함께 검수합니다.",
    ],
  },
];

const smallInfo = [
  { label: "주요 차량", value: "1톤" },
  { label: "업체 구성", value: "소형 이사 전문 업체" },
  { label: "평균 작업 인원", value: "1-2명" },
  { label: "추천 평수", value: "20평 미만" },
];

const homeInfo = [
  { label: "주요 차량", value: "2.5톤~5톤" },
  { label: "추가 서비스", value: "업체별 제공" },
  { label: "업체 구성", value: "가정 이사 전문 업체" },
  { label: "평균 작업 인원", value: "3명 이상" },
  { label: "추천 평수", value: "20평 이상" },
];

export default function Step6Page() {
  const router = useRouter();
  const [moveType, setMoveType] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("일반");
  const [agreed, setAgreed] = useState<boolean>(false);

  useEffect(() => {
    const type = localStorage.getItem("moveType");
    console.log("[step6] moveType:", type);
    setMoveType(type);
    if (type === "가정이사") {
      setSelected("가정이사");
    }
  }, []);

  if (!moveType) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-500">
        이사 유형 정보가 없습니다. 처음부터 다시 진행해 주세요.
      </div>
    );
  }

  if (moveType === "가정이사") {
    const homeOption = serviceOptions.find((opt) => opt.id === "가정이사")!;

    const handleNextForHome = async () => {
      const uuid = localStorage.getItem("uuid");
      if (!uuid) {
        alert("uuid가 없습니다.");
        return;
      }

      try {
        const res = await authApi.post(
          `/estimates/draft/move-option?draftId=${uuid}`,
          {
            optionType: "PACKAGING",
          }
        );
        console.log("가정이사 옵션 저장 성공:", res.data);
        router.push("/guest/estimate/step8");
      } catch (err) {
        console.error("가정이사 옵션 저장 실패:", err);
        alert("이사 옵션 저장 중 문제가 발생했어요.");
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50">
        <EstimateHeader step={6} title="서비스 종류" />
        <div className="w-full max-w-5xl px-4 md:px-12">
          <main className="mt-16 flex flex-col items-center">
            <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-lg p-8 flex flex-col gap-8 items-center mx-auto">
              <h2 className="text-center text-base font-semibold text-gray-900">
                <span className="text-blue-500">가정이사</span> 서비스 안내
              </h2>
              <div className="space-y-4 text-center w-full">
                <h3 className="text-lg font-bold text-gray-900">
                  {homeOption.title}
                </h3>
                <p className="text-sm text-gray-600 px-4">
                  {homeOption.description}
                </p>
                <div className="w-full h-48 overflow-hidden rounded-xl">
                  <img
                    src={homeOption.image}
                    alt={homeOption.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="px-4 space-y-2 text-gray-600 w-full">
                {homeInfo.map((info) => (
                  <div
                    key={info.label}
                    className="flex justify-between whitespace-nowrap"
                  >
                    <span>{info.label}</span>
                    <span className="font-medium text-gray-900">
                      {info.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 w-full">
                <h4 className="font-semibold text-red-600 mb-2">
                  중요! 고객님 필수 진행 사항
                </h4>
                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                  {homeOption.mandatories.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          </main>
          <div className="flex justify-center w-full mt-12">
            <Button
              className="w-full max-w-md h-16 rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition"
              onClick={handleNextForHome}
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 소형이사 UI
  const current = serviceOptions.find((opt) => opt.id === selected)!;

  // ✅ 이사 옵션 저장 API 호출 함수 추가
  const handleNext = async () => {
    const uuid = localStorage.getItem("uuid");

    if (!uuid) {
      alert("uuid가 없습니다.");
      return;
    }

    if (!agreed) {
      alert("필수 사항에 동의해주세요.");
      return;
    }

    // ✅ 선택된 탭을 서버에 맞는 ENUM으로 변환
    const optionMap: Record<string, string> = {
      일반: "BASIC",
      반포장: "SEMI_PACKAGING",
      포장: "PACKAGING",
    };
    const optionType = optionMap[selected];

    try {
      const res = await authApi.post(
        `/estimates/draft/move-option?draftId=${uuid}`,
        {
          optionType,
        }
      );
      console.log("이사 옵션 저장 성공:", res.data);
      router.push("/guest/estimate/step8");
    } catch (err) {
      console.error("이사 옵션 저장 실패:", err);
      alert("이사 옵션 저장 중 문제가 발생했어요.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <EstimateHeader step={6} title="서비스 종류" />
      <div className="w-full max-w-5xl px-4 md:px-12">
        <main className="mt-16 flex flex-col items-center">
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-lg p-8 flex flex-col gap-8 items-center mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mt-4 mb-8 text-gray-900">
              <span className="text-blue-500">원하시는 서비스</span>를
              선택해주세요.
            </h2>
            <div className="flex justify-center gap-2 w-full">
              {serviceOptions
                .filter((opt) => opt.id !== "가정이사")
                .map((opt) => (
                  <SelectTab
                    key={opt.id}
                    label={opt.id}
                    selected={selected === opt.id}
                    onClick={() => {
                      setSelected(opt.id);
                      setAgreed(false);
                    }}
                  />
                ))}
            </div>
            <div className="space-y-4 text-center w-full">
              <h3 className="text-lg font-bold text-gray-900">
                {current.title}
              </h3>
              <p className="text-sm text-gray-600 px-4">
                {current.description}
              </p>
              <div className="w-full h-48 overflow-hidden rounded-xl">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="px-4 space-y-2 text-gray-600 w-full">
              {smallInfo.map((info) => (
                <div
                  key={info.label}
                  className="flex justify-between whitespace-nowrap"
                >
                  <span>{info.label}</span>
                  <span className="font-medium text-gray-900">
                    {info.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 w-full">
              <h4 className="font-semibold text-red-600 mb-2">
                중요! 고객님 필수 진행 사항
              </h4>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                {current.mandatories.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="flex items-center w-full px-4">
              <input
                id="agree"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                checked={agreed}
                onChange={() => setAgreed((prev) => !prev)}
              />
              <label htmlFor="agree" className="ml-2 text-sm text-gray-700">
                필수 진행 사항을 모두 확인하였으며, 동의합니다.
              </label>
            </div>
          </div>
        </main>
        <div className="flex justify-center w-full mt-12">
          <Button
            className="w-full max-w-md h-16 rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition"
            onClick={handleNext}
            disabled={!agreed}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
