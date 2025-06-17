// 의자
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface ChairModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const ChairModal = ({ onClose, onSave, itemTypeId }: ChairModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [type, setType] = useState<string | null>(null);

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
          label="종류"
          options={["일반", "사무용 의자", "스툴", "기타"]}
          selected={type}
          onSelect={setType}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              itemTypeId,
              quantity,
              etc: {
                type,
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

export default ChairModal;
