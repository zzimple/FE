// 운동기구

"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";

interface FitnessEquipmentModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const FitnessEquipmentModal = ({
  onClose,
  onSave,
}: FitnessEquipmentModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState("");

  const typeOptions = ["러닝머신", "사이클", "아령", "기타"];

  return (
    <ModalWrapper>
      <ModalTop
        title="운동용품 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류 선택"
          options={typeOptions}
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

export default FitnessEquipmentModal;
