// 정수기
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface WaterPurifierModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const WaterPurifierModal = ({ onClose, onSave, itemTypeId }: WaterPurifierModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [purifierType, setPurifierType] = useState<string | null>(null);
  const [requestNote, setRequestNote] = useState<string | null>(null);

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
          label="종류"
          options={["테이블용", "스탠딩", "기타"]}
          selected={purifierType}
          onSelect={setPurifierType}
        />

        <OptionSelector
          label="요청사항"
          options={["분리 필요", "분리 필요 없음"]}
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
                  purifierType,
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

export default WaterPurifierModal;
