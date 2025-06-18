"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/common/Button";
import EstimateHeader from "@/components/common/EstimateHeader";
import SelectTab from "@/components/common/SelectTab";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";

import { furnitureItems } from "@/constants/items/furnitureItems";
import { applianceItems } from "@/constants/items/appliance";
import { otherItems } from "@/constants/items/otherItems";
import { MoveCategory } from "@/types/moveItem";

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

  const furnitureRef = useRef<HTMLDivElement>(null);
  const applianceRef = useRef<HTMLDivElement>(null);
  const otherRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<MoveCategory>("가구");

  const categoryRefs = {
    가구: furnitureRef,
    가전: applianceRef,
    기타: otherRef,
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
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white">
      <EstimateHeader step={4} title="짐 목록" />

      <main className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <h2 className="text-base font-semibold text-gray-900 text-center">
          <span className="text-blue-500">옮길 짐</span>을 선택해주세요.
        </h2>

        <div className="flex justify-center gap-2 rounded-full py-2 sticky top-0 bg-white z-10">
          {["가구", "가전", "기타"].map((label) => (
            <SelectTab
              key={label}
              label={label}
              selected={activeTab === label}
              onClick={() => {
                setActiveTab(label as MoveCategory);
                handleCategoryScroll(label as MoveCategory);
              }}
            />
          ))}
        </div>

        <div className="space-y-8">
          {[
            { category: "가구", items: furnitureItems, ref: furnitureRef },
            { category: "가전", items: applianceItems, ref: applianceRef },
            { category: "기타", items: otherItems, ref: otherRef },
          ].map(({ category, items, ref }) => (
            <div key={category} ref={ref}>
              <div className="text-lg font-bold mb-2 mt-6">{category}</div>
              <div className="grid grid-cols-3 gap-4">
                {items.map((item) => {
                  const selected = selectedItems[category as MoveCategory].some(
                    (s) => s.name === item.name
                  );
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
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-20 h-20 object-contain rounded-lg border ${
                          selected ? "border-blue-500" : "border-gray-200"
                        }`}
                      />
                      {selected && (
                        <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
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
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-3 w-full max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-bold text-gray-900">잔짐 박스</div>
            <button
              className="flex items-center gap-1 text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition"
              onClick={() => setShowBoxModal(true)}
            >
              짐 박스 입력 방법
            </button>
          </div>
          <div className="flex items-center gap-4">
            <img
              src="/images/leftoverBox.jpeg"
              alt="잔짐 박스"
              className="w-36 h-28 object-contain rounded border border-gray-200 bg-white"
            />
            <div className="flex flex-col gap-1 flex-1">
              <div className="text-sm font-semibold text-gray-800">
                이사박스 5호 크기
              </div>
              <div className="text-xs text-gray-500">
                이사할 때 주로 사용하는 크기입니다.
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  className="border border-gray-300 rounded px-3 py-1 text-lg font-bold bg-white hover:bg-gray-100"
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
                  className="border border-gray-300 rounded px-3 py-1 text-lg font-bold bg-white hover:bg-gray-100"
                  onClick={() => setLeftoverBoxCount((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 leading-relaxed">
            • 봉투, 리빙박스, 기타 박스 등이 이미 수납되어 있는 잔짐들도 박스
            수량에 포함시켜주세요.
            <br />• 실제 이사를 진행하면 예상보다 짐이 많습니다. 박스 수량을
            넉넉하게 입력해주세요.
          </div>
        </div>

        {/* 모달 */}
        {showBoxModal && (
          <ModalWrapper>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center mb-4">
                <div className="text-base font-bold mb-1">
                  잔짐 박스 이렇게 입력해주세요!
                </div>
                <div className="text-xs text-gray-600 mb-2 text-center">
                  가전/가구에 수납된 모든 물건은 별도의 포장이 필요합니다.
                  <br />
                  식기류, 주방용품, 욕실용품, 의류 등 잔짐을 박스에 포장했을 때,
                  <br />
                  예상수량을 입력해주세요.
                </div>
              </div>
              <img
                src="/images/leftoverBox-modal.jpeg"
                alt="박스 내부"
                className="w-full max-w-xs object-contain mb-4"
              />
              <div className="text-base font-bold mb-1">
                입력 시 참고해주세요!
              </div>
              <div className="text-xs text-gray-600 mb-2 text-center">
                - 부류, 리빙박스, 기타 박스 등 이미 수납되어 있는 잔짐들도
                포함해주세요.
                <br />
                실제 이사를 진행하면 예상보다 짐이 많습니다.
                <br />
                박스 수량을 넉넉하게 입력해주세요.
              </div>
              <button
                className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold"
                onClick={() => setShowBoxModal(false)}
              >
                확인
              </button>
            </div>
          </ModalWrapper>
        )}
      </main>

      <div className="px-4 py-6">
        <Button onClick={handleNext}>짐 상세 정보 입력하기</Button>
      </div>
    </div>
  );
}
