// 커튼

"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";

interface CurtainModalProps {
  onClose: () => void;
  onSave: (data: any) => void; // 나중에 필요 시 타입 지정하기
}

const CurtainModal = ({ onClose, onSave }: CurtainModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState("");
  const [note, setNote] = useState("");

  const typeOptions = ["암막", "속커튼", "레이스", "블라인드", "기타"];
  const noteOptions = ["없음", "있음"];

  return (
    <ModalWrapper>
      <ModalTop
        title="커튼 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류 선택"
          options={typeOptions}
          selected={type}
          onSelect={setType}
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
              type,
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

export default CurtainModal;
