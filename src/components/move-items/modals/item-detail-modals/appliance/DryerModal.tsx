// 건조기
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface DryerModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const DryerModal = ({ onClose, onSave, itemTypeId }: DryerModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [type, setType] = useState<string | null>(null);
  const [capacity, setCapacity] = useState<string | null>(null);

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
          label="종류"
          options={["전기", "가스", "기타"]}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="용량"
          options={["10kg 미만", "10-15kg", "15kg 초과"]}
          selected={capacity}
          onSelect={setCapacity}
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
                  capacity,
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

export default DryerModal;
