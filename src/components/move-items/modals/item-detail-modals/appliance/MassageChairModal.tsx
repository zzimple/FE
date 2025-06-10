"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";

interface MassageChairModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const MassageChairModal = ({ onClose, onSave }: MassageChairModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [note, setNote] = useState("");

  const widthOptions = ["70cm", "80cm", "90cm 이상"];
  const heightOptions = ["100cm", "120cm", "140cm 이상"];
  const noteOptions = ["없음", "있음"];

  return (
    <ModalWrapper>
      <ModalTop
        title="안마의자 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="너비 선택"
          options={widthOptions}
          selected={width}
          onSelect={setWidth}
        />

        <OptionSelector
          label="높이 선택"
          options={heightOptions}
          selected={height}
          onSelect={setHeight}
        />

        <OptionSelector
          label="요청사항"
          options={noteOptions}
          selected={note}
          onSelect={setNote}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              quantity,
              width,
              height,
              note,
            })
          }
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default MassageChairModal;
