// 거울

"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";

interface MirrorModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const MirrorModal = ({ onClose, onSave }: MirrorModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState("");
  const [size, setSize] = useState("");

  const typeOptions = ["전신", "탁상", "벽걸이형", "기타"];
  const sizeOptions = ["소형", "중형", "대형"];

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
          options={typeOptions}
          selected={type}
          onSelect={setType}
        />

        <OptionSelector
          label="크기 선택"
          options={sizeOptions}
          selected={size}
          onSelect={setSize}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              quantity,
              type,
              size,
            })
          }
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default MirrorModal;
