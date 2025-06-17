// 가스레인지
"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import { MoveItemDetail } from "@/types/moveItem";
import OptionSelector from "@/components/move-items/common/OptionSelector";

interface MicrowaveModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const MicrowaveModal = ({
  onClose,
  onSave,
  itemTypeId,
}: MicrowaveModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<string | null>(null);

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
          label="종류"
          options={["일반형", "오븐형"]}
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

export default MicrowaveModal;
