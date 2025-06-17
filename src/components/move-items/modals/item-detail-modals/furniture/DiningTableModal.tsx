// 식탁
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface DiningTableModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const DiningTableModal = ({ onClose, onSave ,itemTypeId}: DiningTableModalProps) => {
  const [type, setType] = useState<string | null>(null);
  const [material, setMaterial] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <ModalWrapper>
      <ModalTop
        title="테이블/식탁 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류"
          options={["원형", "사각", "접이식", "아일랜드 식탁"]}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="재질"
          options={["나무", "철제", "유리", "대리석", "기타"]}
          selected={material}
          onSelect={setMaterial}
        />
        <OptionSelector
          label="사이즈"
          options={["1-2인용", "3-4인용", "5-6인용", "7인 이상"]}
          selected={size}
          onSelect={setSize}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              itemTypeId,
              quantity,
              etc: {
                type,
                material,
                size,
              }
            })
          }
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default DiningTableModal;
