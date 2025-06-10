// 옷장 (단품)
'use client'

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface WardrobeSingleModalProps {
  onClose: () => void;
  onSave: (data: any) => void; // ✅ 저장용 prop 추가
}

const WardrobeSingleModal = ({ onClose, onSave }: WardrobeSingleModalProps) => {
  const [type, setType] = useState<string | null>(null);
  const [width, setWidth] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <ModalWrapper>
      <ModalTop
        title="옷장-단품 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류 선택"
          options={["일반형", "슬라이딩", "붙박이"]}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="너비 선택"
          options={["60cm", "80cm", "100cm"]}
          selected={width}
          onSelect={setWidth}
        />
        <OptionSelector
          label="요청사항"
          options={["없음", "있음"]}
          selected={note}
          onSelect={setNote}
        />

        {/* ✅ 확인 버튼 추가 */}
        <div className="pt-4">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={() =>
              onSave({
                quantity,
                type,
                width,
                note,
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

export default WardrobeSingleModal;
