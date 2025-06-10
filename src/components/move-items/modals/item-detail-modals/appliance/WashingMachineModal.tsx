// 세탁기
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface WashingMachineModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const WashingMachineModal = ({ onClose }: WashingMachineModalProps) => {
  const [type, setType] = useState<string | null>(null);
  const [capacity, setCapacity] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <ModalWrapper>
      <ModalTop
        title="세탁기 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류 선택"
          options={["드럼", "통돌이", "일반형"]}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="용량 선택"
          options={["9kg", "12kg", "15kg 이상"]}
          selected={capacity}
          onSelect={setCapacity}
        />
      </div>
    </ModalWrapper>
  );
};

export default WashingMachineModal;
