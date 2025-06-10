// 쇼파
"use client";

import { useState } from "react";
import ModalTop from "../../../common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import { MoveItemDetail } from '@/types/moveItem';

interface SofaModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
}

const SofaModal = ({ onClose, onSave }: SofaModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [type, setType] = useState<string | null>(null);
  const [material, setMaterial] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);

  const types = ["일반", "리클라이너", "쇼파베드", "모듈쇼파", "기타"];
  const materials = ["패브릭", "가죽"];
  const sizes = ["1인용", "2인용", "3인용", "4인용 이상"];

  return (
    <ModalWrapper>
      <ModalTop
        title="쇼파 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <OptionSelector
        label="종류 선택"
        options={types}
        selected={type}
        onSelect={setType}
      />

      <OptionSelector
        label="재질 선택"
        options={materials}
        selected={material}
        onSelect={setMaterial}
      />

      <OptionSelector
        label="크기 선택"
        options={sizes}
        selected={size}
        onSelect={setSize}
      />

      <div className="mt-6">
        <button
          className="w-full bg-blue-500 text-white py-2 rounded"
          onClick={() =>
            onSave({
              quantity,
              etc: {
                type,
                material,
                size,
              },
            })
          }
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default SofaModal;
