// 커튼

"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { MoveItemDetail } from "@/types/moveItem";

interface CurtainModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const CurtainModal = ({ onClose, onSave, itemTypeId }: CurtainModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<string | null>(null);
  const [requestNote, setRequestNote] = useState<string | null>(null);

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
          label="종류"
          options={["커튼", "블라인드", "버티컬", "기타"]}
          selected={type}
          onSelect={setType}
        />

        <OptionSelector
          label="요청사항"
          options={[
            "분리 요청",
            "설치 요청",
            "분리/설치 모두 요청",
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
                  requestNote
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

export default CurtainModal;
