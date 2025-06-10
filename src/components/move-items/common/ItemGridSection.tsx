"use client";

import Image from "next/image";

interface Item {
  name: string;
  icon: string; // 이미지 경로
}

interface ItemGridSectionProps {
  items: Item[];
  selectedItems: string[];
  onToggle: (name: string) => void;
}

export default function ItemGridSection({
  items,
  selectedItems,
  onToggle,
}: ItemGridSectionProps) {
  return (
    <div className="grid grid-cols-4 gap-4 px-2">
      {items.map((item) => {
        const isSelected = selectedItems.includes(item.name);
        return (
          <button
            key={item.name}
            onClick={() => onToggle(item.name)}
            className={`relative border rounded-lg p-1 aspect-square flex items-center justify-center shadow-sm hover:ring-2 hover:ring-blue-300 transition duration-150 ${
              isSelected ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <Image
              src={item.icon}
              alt={item.name}
              width={80}
              height={80}
              className="object-contain"
            />

            {/* 체크 표시 */}
            {isSelected && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
