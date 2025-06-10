"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";

interface PlantModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const PlantModal = ({ onClose, onSave }: PlantModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [height, setHeight] = useState("");

  const heightOptions = ["30cm 이하", "60cm", "100cm 이상"];

  return (
    <ModalWrapper>
      <ModalTop
        title="화분 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="높이 선택"
          options={heightOptions}
          selected={height}
          onSelect={setHeight}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              quantity,
              height,
            })
          }
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default PlantModal;
