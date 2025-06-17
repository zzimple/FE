// Tv
'use client'

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface TvModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const TvModal = ({ onClose, onSave, itemTypeId}: TvModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [type, setType] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="TV 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="유형"
          options={["일반", "벽걸이형"]}
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

export default TvModal;
