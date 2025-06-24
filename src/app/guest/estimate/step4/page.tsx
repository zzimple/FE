"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Button from "@/components/common/Button";
import EstimateHeader from "@/components/common/EstimateHeader";
import SelectTab from "@/components/common/SelectTab";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import GuestHeader from "@/components/headers/GuestHeader";

import { furnitureItems } from "@/constants/items/furnitureItems";
import { applianceItems } from "@/constants/items/appliance";
import { otherItems } from "@/constants/items/otherItems";
import { MoveCategory } from "@/types/moveItem";
import { publicApi } from "@/lib/axios";

// Vision API 응답 타입 정의
interface VisionItem {
  itemTypeId: number;
  itemTypeName: string;
  category: "APPLIANCE" | "FURNITURE" | "OTHER";
}

type Item = { name: string; image: string };

type SelectedItems = {
  [key in MoveCategory]: Item[];
};

export default function Step4Page() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    가구: [],
    가전: [],
    기타: [],
  });
  const [leftoverBoxCount, setLeftoverBoxCount] = useState(0);
  const [showBoxModal, setShowBoxModal] = useState(false);

  // Vision API 관련 상태 추가
  const [visionItems, setVisionItems] = useState<VisionItem[]>([]);
  const [loadingVision, setLoadingVision] = useState(false);
  const [visionError, setVisionError] = useState<string | null>(null);

  const furnitureRef = useRef<HTMLDivElement>(null);
  const applianceRef = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<MoveCategory>("가구");

  const categoryRefs = {
    가구: furnitureRef,
    가전: applianceRef,
    기타: otherRef,
  };

  // Vision API 호출 함수
  const fetchVisionItems = async () => {
    setLoadingVision(true);
    setVisionError(null);

    try {
      console.log("Vision API 호출 시작...");
      const response = await publicApi.get("/api/vision");
      console.log("Vision API 응답:", response);
      console.log("Vision API 응답 데이터:", response.data);

      // API 응답 형식: { success, message, data }
      if (response.data.success && response.data.data) {
        setVisionItems(response.data.data);
      } else {
        console.error("Vision API 응답이 올바르지 않습니다:", response.data);
        setVisionError("AI 분석 결과를 불러오는데 실패했습니다.");
      }
    } catch (err: any) {
      console.error("Vision API 호출 실패:", err);
      console.error("에러 응답:", err.response?.data);
      console.error("에러 상태:", err.response?.status);
      setVisionError(`AI 분석 결과를 불러오는데 실패했습니다. (${err.response?.status || '알 수 없는 오류'})`);
    } finally {
      setLoadingVision(false);
    }
  };

  // Vision 아이템을 기존 아이템과 매핑하는 함수
  const mapVisionItemsToExistingItems = (visionItems: VisionItem[]) => {
    const mappedItems: SelectedItems = {
      가구: [],
      가전: [],
      기타: [],
    };

    visionItems.forEach((visionItem) => {
      const categoryMap = {
        FURNITURE: "가구" as MoveCategory,
        APPLIANCE: "가전" as MoveCategory,
        OTHER: "기타" as MoveCategory,
      };

      const category = categoryMap[visionItem.category];

      // 기존 아이템 목록에서 매칭되는 아이템 찾기
      let existingItems: any[] = [];
      switch (category) {
        case "가구":
          existingItems = furnitureItems;
          break;
        case "가전":
          existingItems = applianceItems;
          break;
        case "기타":
          existingItems = otherItems;
          break;
      }

      // itemTypeId로 매칭 시도
      const matchedItem = existingItems.find(
        (item) => item.id === String(visionItem.itemTypeId)
      );

      if (matchedItem) {
        console.log(`매칭 성공: ${visionItem.itemTypeName} (ID: ${visionItem.itemTypeId}) -> ${matchedItem.name}`);
        mappedItems[category].push({
          name: matchedItem.name,
          image: matchedItem.image,
        });
      } else {
        console.log(`매칭 실패: ${visionItem.itemTypeName} (ID: ${visionItem.itemTypeId}, 카테고리: ${category})`);
      }
    });

    return mappedItems;
  };

  // Vision 아이템 적용 함수
  const applyVisionItems = () => {
    if (visionItems.length === 0) {
      alert("AI 분석 결과가 없습니다.");
      return;
    }

    const mappedItems = mapVisionItemsToExistingItems(visionItems);

    // 기존 선택된 아이템과 병합 (중복 제거)
    setSelectedItems((prev) => {
      const merged: SelectedItems = {
        가구: [...prev.가구],
        가전: [...prev.가전],
        기타: [...prev.기타],
      };

      Object.entries(mappedItems).forEach(([category, items]) => {
        items.forEach((item) => {
          const existing = merged[category as MoveCategory].find(
            (existingItem) => existingItem.name === item.name
          );
          if (!existing) {
            merged[category as MoveCategory].push(item);
          }
        });
      });

      return merged;
    });

    alert("AI 분석 결과가 적용되었습니다.");
  };

  useEffect(() => {
    const savedItems = localStorage.getItem("selectedItems");
    const savedBox = localStorage.getItem("leftoverBoxCount");

    if (savedItems) {
      setSelectedItems(JSON.parse(savedItems));
    }

    if (savedBox) {
      setLeftoverBoxCount(Number(savedBox));
    }
  }, []);

  const handleSelect = (
    category: MoveCategory,
    itemName: string,
    image: string
  ) => {
    setSelectedItems((prev) => {
      const current = prev[category] ?? [];
      const exists = current.find((item) => item.name === itemName);

      const updated = exists
        ? current.filter((item) => item.name !== itemName)
        : [...current, { name: itemName, image }];

      return {
        ...prev,
        [category]: updated,
      };
    });
  };

  const handleNext = () => {
    // 모든 카테고리에서 선택된 짐의 총 개수를 계산합니다.
    const totalItemCount = Object.values(selectedItems).reduce(
      (acc, items) => acc + items.length,
      0
    );

    // 잔짐 박스 수량과 관계없이, 선택된 짐이 하나도 없으면 알림을 띄웁니다.
    if (totalItemCount === 0) {
      alert("옮기실 짐을 하나 이상 선택해주세요.");
      return; // 다음 단계로 진행하지 않습니다.
    }

    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    localStorage.setItem("leftoverBoxCount", String(leftoverBoxCount));
    router.push("/guest/estimate/step5");
  };

  const handleCategoryScroll = (label: MoveCategory) => {
    categoryRefs[label].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <GuestHeader />
      <EstimateHeader step={4} title="짐 목록" />
      <div className="w-full max-w-5xl px-4 md:px-12">
        <main className="mt-8 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-center mt-4 mb-2 text-gray-900">
            <span className="text-blue-600">옮길 짐</span>을 선택해 주세요.
          </h2>
          <div className="flex justify-center gap-2 md:gap-6 rounded-full py-2 sticky top-0 z-10 mb-6">
            {["가구", "가전", "기타"].map((label) => (
              <div key={label} className="md:w-40 md:h-16">
                <SelectTab
                  label={label}
                  selected={activeTab === label}
                  onClick={() => {
                    setActiveTab(label as MoveCategory);
                    handleCategoryScroll(label as MoveCategory);
                  }}
                  variant="blue"
                />
              </div>
            ))}
          </div>

          {/* AI 분석 결과 버튼 */}
          <div className="flex justify-center mb-6 w-full max-w-md">
            <Button
              onClick={fetchVisionItems}
              disabled={loadingVision}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
            >
              {loadingVision ? "AI 분석 결과 가져오는 중..." : "AI 분석 결과 가져오기"}
            </Button>
          </div>

          {visionError && (
            <div className="text-red-500 text-center mb-4">
              {visionError}
            </div>
          )}

          {/* AI 분석 결과 표시 섹션 */}
          {visionItems.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI 분석 결과 ({visionItems.length}개)
              </h3>

              <div className="space-y-4">
                {["가구", "가전", "기타"].map((category) => {
                  const categoryMap = {
                    "가구": "FURNITURE",
                    "가전": "APPLIANCE",
                    "기타": "OTHER"
                  };

                  const categoryItems = visionItems.filter(
                    item => item.category === categoryMap[category as keyof typeof categoryMap]
                  );

                  if (categoryItems.length === 0) return null;

                  return (
                    <div key={category} className="border border-gray-100 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">{category} ({categoryItems.length}개)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categoryItems.map((item) => {
                          // 기존 아이템 목록에서 매칭되는 아이템 찾기
                          let existingItems: any[] = [];
                          switch (category) {
                            case "가구":
                              existingItems = furnitureItems;
                              break;
                            case "가전":
                              existingItems = applianceItems;
                              break;
                            case "기타":
                              existingItems = otherItems;
                              break;
                          }

                          // itemTypeId로 매칭 시도
                          const matchedItem = existingItems.find(
                            (existingItem) => existingItem.id === String(item.itemTypeId)
                          );

                          const isSelected = selectedItems[category as MoveCategory].some(
                            (selectedItem) => selectedItem.name === (matchedItem?.name || item.itemTypeName)
                          );

                          return (
                            <div
                              key={item.itemTypeId}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                  if (matchedItem) {
                                    handleSelect(
                                      category as MoveCategory,
                                      matchedItem.name,
                                      matchedItem.image
                                    );
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <div className="flex items-center gap-2 flex-1">
                                {matchedItem && (
                                  <Image
                                    src={matchedItem.image}
                                    alt={item.itemTypeName}
                                    width={40}
                                    height={40}
                                    className="object-contain rounded"
                                  />
                                )}
                                <span className="text-sm font-medium text-gray-800">
                                  {item.itemTypeName}
                                  {matchedItem && matchedItem.name !== item.itemTypeName && (
                                    <span className="text-xs text-gray-500 ml-1">
                                      ({matchedItem.name})
                                    </span>
                                  )}
                                </span>
                              </div>
                              {!matchedItem && (
                                <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                                  매칭 없음 (ID: {item.itemTypeId})
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={applyVisionItems}
                  className="w-full sm:w-1/2 h-12 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold"
                >
                  선택된 항목 적용하기
                </Button>
                <Button
                  onClick={() => {
                    setVisionItems([]);
                    setVisionError(null);
                  }}
                  className="w-full sm:w-1/2 h-12 rounded-lg bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold"
                >
                  초기화
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {[
              { category: "가구", items: furnitureItems, ref: furnitureRef },
              { category: "가전", items: applianceItems, ref: applianceRef },
              { category: "기타", items: otherItems, ref: otherRef },
            ].map(({ category, items, ref }) => (
              <div key={category} ref={ref}>
                <div className="text-lg md:text-2xl font-bold mb-2 mt-6">
                  {category}
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-8">
                  {items.map((item) => {
                    const selected = selectedItems[
                      category as MoveCategory
                    ].some((s) => s.name === item.name);
                    return (
                      <button
                        key={item.name}
                        onClick={() =>
                          handleSelect(
                            category as MoveCategory,
                            item.name,
                            item.image
                          )
                        }
                        className="relative flex flex-col items-center space-y-2"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className={`object-contain rounded-xl border-2 transition-all duration-200 ${selected
                            ? "border-blue-500 shadow-lg"
                            : "border-gray-200"
                            }`}
                        />
                        {selected && (
                          <div className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-base rounded-full shadow-md border-2 border-white">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {/* 잔짐 박스 입력란 */}
          <div className="mt-8 bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row gap-4 w-full max-w-lg md:max-w-xl mx-auto">
            <Image
              src="/images/leftoverBox.jpeg"
              alt="잔짐 박스"
              width={144}
              height={112}
              className="object-contain rounded border border-gray-200 bg-white mx-auto md:mx-0"
            />
            <div className="flex flex-col gap-1 flex-1 justify-center">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-bold text-gray-900">잔짐 박스</div>
                <button
                  className="flex items-center gap-1 text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition"
                  onClick={() => setShowBoxModal(true)}
                >
                  짐 박스 입력 방법
                </button>
              </div>
              <div className="text-sm font-semibold text-gray-800">
                이사박스 5호 크기
              </div>
              <div className="text-xs text-gray-500">
                이사할 때 주로 사용하는 크기입니다.
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  className="border border-gray-300 rounded-xl px-3 py-1 text-lg font-bold bg-white hover:bg-gray-100"
                  onClick={() =>
                    setLeftoverBoxCount((prev) => Math.max(0, prev - 1))
                  }
                >
                  -
                </button>
                <span className="w-16 text-center font-bold text-gray-900 text-base">
                  {leftoverBoxCount}개
                </span>
                <button
                  className="border border-gray-300 rounded-xl px-3 py-1 text-lg font-bold bg-white hover:bg-gray-100"
                  onClick={() => setLeftoverBoxCount((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center mt-12">
            <Button
              onClick={handleNext}
              className="mb-8 mt-8 w-full max-w-md h-16 rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition"
            >
              다음
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
