// 에어컨
"use client";

import { useState } from "react";
import ModalTop from "../../../common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { MoveItemDetail } from "@/types/moveItem";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";

interface AirconModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}
const AirconModal = ({ onClose, onSave, itemTypeId }: AirconModalProps) => {
    const [quantity, setQuantity] = useState(1);
    const [type, setType] = useState<string | null>(null);
    const [requestNote, setRequestNote] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="에어컨 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류"
          options={["벽걸이", "스탠딩", "기타"]}
          selected={type}
          onSelect={setType}
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
                  type,
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
}

export default AirconModal;