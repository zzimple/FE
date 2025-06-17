"use client";

import { useState } from "react";
import ModalTop from "../../../common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import { MoveItemDetail } from "@/types/moveItem";

interface SofaModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const SofaModal = ({ onClose, onSave, itemTypeId }: SofaModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [type, setType] = useState<string | null>(null);
  const [material, setMaterial] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="쇼파 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류"
          options={["일반", "리클라이너", "쇼파베드", "모듈쇼파", "기타"]}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="재질"
          options={["패브릭", "가죽"]}
          selected={material}
          onSelect={setMaterial}
        />
        <OptionSelector
          label="크기"
          options={["1인용", "2인용", "3인용", "4인용 이상"]}
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
                  material,
                  size,
                }
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

export default SofaModal;
