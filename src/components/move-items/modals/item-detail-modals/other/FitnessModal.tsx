// 운동기구

"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { MoveItemDetail } from "@/types/moveItem";

interface FitnessEquipmentModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const FitnessEquipmentModal = ({
  onClose,
  onSave,
  itemTypeId
}: FitnessEquipmentModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<string | null>(null);

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
          label="종류"
          options={[
            "런닝머신",
            "사이클머신",
            "거꾸리",
            "보드/스키",
            "골프백",
            "자전거",
            "기타",
          ]}
          selected={type}
          onSelect={setType}
        />
        <div className="pt-4">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={() =>
              onSave({
                itemTypeId,
                quantity,
                etc: {
                  type,
                },
              })
            }
          >
            확인
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default FitnessEquipmentModal;
