// 침대 
"use client";

import { useState } from "react";
import ModalTop from "../../../common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";

interface BedModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const BedModal = ({ onClose, onSave }: BedModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState("");
  const [frame, setFrame] = useState("");
  const [note, setNote] = useState("");

  const types = ["접이식 침대", "싱글/슈퍼싱글", "더블", "퀸", "킹"];
  const frames = [
    "프레임 없음",
    "일반 프레임",
    "통프레임",
    "서랍/수납형",
    "2층/벙커침대",
  ];
  const notes = ["일반", "라텍스"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-4 m-2 relative">
        <ModalTop
          title="침대 입력"
          quantity={quantity}
          onQuantityChange={setQuantity}
          onClose={onClose}
        />

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
          options={notes}
          selected={note}
          onSelect={setNote}
        />

        <div className="mt-6">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={() => onSave({ quantity, type, frame, note })}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default BedModal;

