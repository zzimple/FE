// 의류관리기
"use client"; 

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface ClothingCareModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const ClothingCareModal = ({ onClose }: ClothingCareModalProps) => {
  const [width, setWidth] = useState<string | null>(null);
  const [height, setHeight] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <ModalWrapper>
      <ModalTop
        title="의류관리기 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <OptionSelector
          label="너비 선택"
          options={["60cm", "80cm", "100cm"]}
          selected={width}
          onSelect={setWidth}
        />
        <OptionSelector
          label="높이 선택"
          options={["160cm", "180cm", "200cm"]}
          selected={height}
          onSelect={setHeight}
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

export default ClothingCareModal;
