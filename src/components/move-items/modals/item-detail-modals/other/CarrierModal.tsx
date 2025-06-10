// 캐리어

"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";

interface CarrierModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const CarrierModal = ({ onClose, onSave }: CarrierModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");

  const sizeOptions = ["기내용", "중형", "대형"];

  return (
    <ModalWrapper>
      <ModalTop
        title="캐리어 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="크기 선택"
          options={sizeOptions}
          selected={size}
          onSelect={setSize}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              quantity,
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

export default CarrierModal;
