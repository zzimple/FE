// 거울

"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { MoveItemDetail } from "@/types/moveItem";

interface MirrorModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const MirrorModal = ({ onClose, onSave, itemTypeId }: MirrorModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="거울 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류 선택"
          options={["벽걸이형", "스탠딩형", "기타"]}
          selected={type}
          onSelect={setType}
        />

        <OptionSelector
          label="크기 선택"
          options={["반전신", "전신"]}
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
                  type,
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

export default MirrorModal;
