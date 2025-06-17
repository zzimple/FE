// 옷장 (연결장)
"use client";

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

const WardrobeSingleModal = ({ onClose, onSave, itemTypeId}: WardrobeSingleModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [type, setType] = useState<string | null>(null);
  const [doorCount, setDoorCount] = useState<string | null>(null);;
  const [width, setWidth] = useState<string | null>(null);
  const [requestNote, setRequestNote] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="옷장-연결장 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류"
          options={["일반형", "슬라이드장", "붙박이", "기타"]}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="총 문 개수"
          options={["2개", "3-4개", "5-6개", "7-8개", "8개 초과", "기타"]}
          selected={doorCount}
          onSelect={setDoorCount}
        />
        <OptionSelector
          label="총 너비"
          options={["150-220cm", "220-280cm", "280-370cm", "370cm 초과"]}
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

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              itemTypeId,
              quantity,
              etc: {
                type,
                doorCount,
                width,
                requestNote,
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

export default WardrobeSingleModal;

