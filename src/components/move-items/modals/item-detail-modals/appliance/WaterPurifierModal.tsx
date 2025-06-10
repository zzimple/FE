// 정수기
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface WaterPurifierModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const WaterPurifierModal = ({ onClose }: WaterPurifierModalProps) => {
  const [type, setType] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <ModalWrapper>
      <ModalTop
        title="정수기 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류 선택"
          options={["냉온정수기", "직수형", "기타"]}
          selected={type}
          onSelect={setType}
        />

        <OptionSelector
          label="요청사항"
          options={["없음", "있음"]}
          selected={note}
          onSelect={setNote}
        />
      </div>
    </ModalWrapper>
  );
};

export default WaterPurifierModal;
