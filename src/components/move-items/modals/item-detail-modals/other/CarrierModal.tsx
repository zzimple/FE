// 캐리어

"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { MoveItemDetail } from "@/types/moveItem";

interface CarrierModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const CarrierModal = ({ onClose, onSave, itemTypeId }: CarrierModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<string | null>(null);

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
          label="크기"
          options={["20인치 미만", "20인치", "24인치", "28인치", "28인치 초과"]}
          selected={size}
          onSelect={setSize}
        />

        <div className="pt-4">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={() =>
              onSave({
                itemTypeId,
                quantity,
                etc: {
                  size,
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

export default CarrierModal;
