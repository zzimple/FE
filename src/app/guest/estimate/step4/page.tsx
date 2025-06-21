"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
