"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import Button from "@/components/common/Button";
import EstimateHeader from "@/components/common/EstimateHeader";
import SelectTab from "@/components/common/SelectTab";

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
  const [category, setCategory] = useState<MoveCategory>("가구");
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    가구: [],
    가전: [],
    기타: [],
  });

  const itemList =
    category === "가구"
      ? furnitureItems
      : category === "가전"
      ? applianceItems
      : otherItems;

  const handleSelect = (itemName: string, image: string) => {
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
    Cookies.set("selectedItems", JSON.stringify(selectedItems), { path: "/" });
    router.push("/estimate/step5");
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white">
      <EstimateHeader step={4} title="짐 목록" />

      <main className="flex-1 px-4 py-6 space-y-6">
        <h2 className="text-base font-semibold text-gray-900 text-center">
          <span className="text-blue-500">옮길 짐</span>을 선택해주세요.
        </h2>

        {/* 카테고리 탭 */}
        <div className="flex justify-center gap-2 rounded-full py-2">
          {["가구", "가전", "기타"].map((label) => (
            <SelectTab
              key={label}
              label={label}
              selected={category === label}
              onClick={() => setCategory(label as MoveCategory)}
            />
          ))}
        </div>

        {/* 아이템 목록 */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {itemList.map((item) => {
            const selected = selectedItems[category].some(
              (s) => s.name === item.name
            );

            return (
              <button
                key={item.name}
                onClick={() => handleSelect(item.name, item.image)}
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
      </main>

      <div className="px-4 py-6">
        <Button onClick={handleNext}>짐 상세 정보 입력하기</Button>
      </div>
    </div>
  );
}
