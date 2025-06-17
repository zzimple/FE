// 시스템 행거 
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface SystemHangerModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const SystemHangerModal = ({
  onClose,
  onSave,
  itemTypeId,
}: SystemHangerModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [shape, setShape] = useState<string | null>(null);
  const [unitCount, setUnitCount] = useState<string | null>(null);
  const [width, setWidth] = useState<string | null>(null);
  const [requestNote, setRequestNote] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="시스템 행거 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="형태"
          options={["일자형", "코너형(ㄱ자)", "ㄷ자형", "기타"]}
          selected={shape}
          onSelect={setShape}
        />
        <OptionSelector
          label="옷장 개수"
          options={["2개", "3개", "4개", "4개초과", "기타"]}
          selected={unitCount}
          onSelect={setUnitCount}
        />
        <OptionSelector
          label="총 너비"
          options={["120cm", "160cm", "200cm"]}
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
                shape,
                unitCount,
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

export default SystemHangerModal;

