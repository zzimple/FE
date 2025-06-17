// 화장대
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface DressingTableModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const DressingTableModal = ({ onClose, onSave, itemTypeId }: DressingTableModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [type, setType] = useState<string | null>(null);
  const [material, setMaterial] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="화장대 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류"
          options={["미니 화장대", "1-2단 서랍형", "3단 이상 서랍형"]}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="재질"
          options={["플라스틱", "나무", "철제", "기타"]}
          selected={material}
          onSelect={setMaterial}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              itemTypeId,
              quantity,
              etc: {
                type,
                material, 
              }
            })
          }
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default DressingTableModal;


