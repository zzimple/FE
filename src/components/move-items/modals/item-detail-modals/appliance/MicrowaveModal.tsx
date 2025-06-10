// 전자레인지
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface MicrowaveModalProps {
  onClose: () => void;
  onSave: (data: any) => void; 
}

const MicrowaveModal = ({ onClose, onSave }: MicrowaveModalProps) => {
  const [type, setType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const handleSave = () => {
    onSave({
      type,
      quantity,
    });
    onClose();
  };

  return (
    <ModalWrapper>
      <ModalTop
        title="전자레인지 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류 선택"
          options={["일반형", "오븐겸용", "기타"]}
          selected={type}
          onSelect={setType}
        />

        <button
          className="w-full mt-6 bg-blue-500 text-white py-2 rounded"
          onClick={handleSave}
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default MicrowaveModal;
