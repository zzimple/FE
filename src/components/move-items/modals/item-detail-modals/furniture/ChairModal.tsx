// 의자
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface ChairModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const ChairModal = ({ onClose, onSave }: ChairModalProps) => {
  const [type, setType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <ModalWrapper>
      <ModalTop
        title="의자 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류 선택"
          options={["사무용", "식탁용", "접이식", "스툴"]}
          selected={type}
          onSelect={setType}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              quantity,
              type,
            })
          }
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default ChairModal;
