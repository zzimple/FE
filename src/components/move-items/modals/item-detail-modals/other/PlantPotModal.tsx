"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { MoveItemDetail } from "@/types/moveItem";

interface PlantModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const PlantModal = ({ onClose, onSave, itemTypeId }: PlantModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [height, setHeight] = useState<string | null>(null);

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
          label="높이"
          options={["50cm 미만", "50-100cm", "100-150cm", "150-200cm", "200cm 초과"]}
          selected={height}
          onSelect={setHeight}
        />
        <div className="pt-4">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={() =>
              onSave({
                itemTypeId,
                quantity,
                etc: {
                  height,
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

export default PlantModal;
