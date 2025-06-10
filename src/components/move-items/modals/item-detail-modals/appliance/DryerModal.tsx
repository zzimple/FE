// 건조기
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface DryerModalProps {
  onClose: () => void;
  onSave: (data: any) => void; 
}

const DryerModal = ({ onClose, onSave }: DryerModalProps) => {
  const [type, setType] = useState<string | null>(null);
  const [capacity, setCapacity] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const handleSave = () => {
    onSave({
      type,
      capacity,
      quantity,
    });
    onClose();
  };

  return (
    <ModalWrapper>
      <ModalTop
        title="건조기 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류 선택"
          options={["콘덴서식", "히트펌프식", "일반형"]}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="용량 선택"
          options={["9kg", "10kg", "12kg 이상"]}
          selected={capacity}
          onSelect={setCapacity}
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

export default DryerModal;
