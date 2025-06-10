// 식탁
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface DiningTableModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const DiningTableModal = ({ onClose, onSave }: DiningTableModalProps) => {
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
          label="종류 선택"
          options={["원형", "사각형", "확장형"]}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="재질 선택"
          options={["원목", "유리", "대리석"]}
          selected={material}
          onSelect={setMaterial}
        />
        <OptionSelector
          label="사이즈 선택"
          options={["소형", "중형", "대형"]}
          selected={size}
          onSelect={setSize}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              quantity,
              type,
              material,
              size,
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
