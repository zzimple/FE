// 시스템 행거 
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface SystemHangerModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const SystemHangerModal = ({ onClose, onSave }: SystemHangerModalProps) => {
  const [shape, setShape] = useState<string | null>(null);
  const [closetCount, setClosetCount] = useState<string | null>(null);
  const [width, setWidth] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

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
          label="형태 선택"
          options={["ㄱ자형", "일자형", "ㄷ자형"]}
          selected={shape}
          onSelect={setShape}
        />
        <OptionSelector
          label="옷장 개수"
          options={["1개", "2개", "3개 이상"]}
          selected={closetCount}
          onSelect={setClosetCount}
        />
        <OptionSelector
          label="총 너비 선택"
          options={["120cm", "160cm", "200cm"]}
          selected={width}
          onSelect={setWidth}
        />
        <OptionSelector
          label="요청사항"
          options={["없음", "있음"]}
          selected={note}
          onSelect={setNote}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              quantity,
              shape,
              closetCount,
              width,
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

export default SystemHangerModal;

