// 비데

"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";

interface BidetModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const BidetModal = ({ onClose, onSave }: BidetModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  const noteOptions = ["없음", "있음"];

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
          options={noteOptions}
          selected={note}
          onSelect={setNote}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              quantity,
              note,
            })
          }
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default BidetModal;
