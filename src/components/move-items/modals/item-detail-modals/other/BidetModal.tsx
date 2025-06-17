// 비데
"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { MoveItemDetail } from "@/types/moveItem";

interface BidetModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const BidetModal = ({ onClose, onSave, itemTypeId }: BidetModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [requestNote, setRequestNote] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="비데 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="요청사항"
          options={["분리 필요", "분리 필요 없음"]}
          selected={requestNote}
          onSelect={setRequestNote}
        />

        <div className="pt-4">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={() =>
              onSave({
                itemTypeId,
                quantity,
                etc: {
                  requestNote,
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

export default BidetModal;
