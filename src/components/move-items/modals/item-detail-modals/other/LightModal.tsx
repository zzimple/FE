// 조명기구

"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";

interface LightFixtureModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const LightFixtureModal = ({ onClose, onSave }: LightFixtureModalProps) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <ModalWrapper>
      <ModalTop
        title="조명기구 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4">
        <button
          className="w-full bg-blue-500 text-white py-2 rounded"
          onClick={() => onSave({ quantity })}
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default LightFixtureModal;
