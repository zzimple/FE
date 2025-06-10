// 책상
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface DeskModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const DeskModal = ({ onClose, onSave }: DeskModalProps) => {
  const [type, setType] = useState<string | null>(null);
  const [width, setWidth] = useState<string | null>(null);
  const [glass, setGlass] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <ModalWrapper>
      <ModalTop
        title="책상 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류 선택"
          options={["사무용", "학생용", "화장용"]}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="너비 선택"
          options={["100cm", "120cm", "140cm"]}
          selected={width}
          onSelect={setWidth}
        />
        <OptionSelector
          label="유리 여부"
          options={["있음", "없음"]}
          selected={glass}
          onSelect={setGlass}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              quantity,
              type,
              width,
              glass,
            })
          }
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default DeskModal;
