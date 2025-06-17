// 옷장 (단품)
'use client'

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface WardrobeSingleModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const WardrobeSingleModal = ({ onClose, onSave, itemTypeId }: WardrobeSingleModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [type, setType] = useState<string | null>(null);
  const [width, setWidth] = useState<string | null>(null);
  const [requestNote, setRequestNote] = useState<string | null>(null);

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
          label="종류"
          options={["일반형", "슬라이드장", "붙박이"]}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="너비"
          options={["100cm 미만", "100-150cm", "150-200cm", "200cm 초과"]}
          selected={width}
          onSelect={setWidth}
        />
        <OptionSelector
          label="요청사항"
          options={[
            "분해 요청",
            "조립 요청",
            "분해/조립 모두 요청",
            "필요 없음",
          ]}
          selected={requestNote}
          onSelect={setRequestNote}
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
                  width,
                  requestNote,
                },
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
