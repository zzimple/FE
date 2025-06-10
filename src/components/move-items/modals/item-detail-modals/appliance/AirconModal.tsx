// 에어컨

"use client";

import { useState } from "react";
import ModalTop from "../../../common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";

export default function AirConditionerModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState("");
  const [size, setSize] = useState("");

  const types = ["벽걸이", "스탠드", "천장형", "이동식", "기타"];
  const sizes = ["소형", "중형", "대형"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-4 m-2 relative">
        <ModalTop
          title="에어컨 입력"
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
          label="크기"
          options={sizes}
          selected={size}
          onSelect={setSize}
        />

        <div className="mt-6">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={() =>
              onSave({
                quantity,
                type,
                size,
              })
            }
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
