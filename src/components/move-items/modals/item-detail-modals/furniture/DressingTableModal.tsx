// 화장대
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface DressingTableModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const DressingTableModal = ({ onClose, onSave }: DressingTableModalProps) => {
  const [type, setType] = useState<string | null>(null);
  const [material, setMaterial] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <ModalWrapper>
      <ModalTop
        title="화장대 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류 선택"
          options={["거울 일체형", "분리형", "벽걸이"]}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="재질 선택"
          options={["원목", "MDF", "유리"]}
          selected={material}
          onSelect={setMaterial}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              quantity,
              type,
              material,
            })
          }
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default DressingTableModal;


