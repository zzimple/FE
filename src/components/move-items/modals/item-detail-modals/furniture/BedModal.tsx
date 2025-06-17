"use client";

import { useState } from "react";
import ModalTop from "../../../common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import { MoveItemDetail } from "@/types/moveItem";

interface BedModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const BedModal = ({ onClose, onSave, itemTypeId }: BedModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState("");
  const [frame, setFrame] = useState("");
  const [specialNote, setSpecialNote] = useState("");

  const types = ["접이식 침대", "싱글/슈퍼싱글", "더블", "퀸", "킹"];
  const frames = [
    "프레임 없음",
    "일반 프레임",
    "통프레임",
    "서랍/수납형",
    "2층/벙커침대",
  ];
  const specialNotes = ["일반", "라텍스", "돌/흙침대", "물침대", "전동침대"];

  return (
    <ModalWrapper>
      <ModalTop
        title="침대 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류"
          options={types}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="프레임"
          options={frames}
          selected={frame}
          onSelect={setFrame}
        />
        <OptionSelector
          label="특이사항"
          options={specialNotes}
          selected={specialNote}
          onSelect={setSpecialNote}
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
                  frame,
                  specialNote,
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

export default BedModal;
