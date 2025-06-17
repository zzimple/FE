// 책상
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface DeskModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const DeskModal = ({ onClose, onSave, itemTypeId }: DeskModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [type, setType] = useState<string | null>(null);
  const [width, setWidth] = useState<string | null>(null);
  const [hasGlass, setHasGlass] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="책상 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="종류"
          options={["일반","ㄱ자형", "독서실 책상", "책상+서랍", "기타"]}
          selected={type}
          onSelect={setType}
        />
        <OptionSelector
          label="너비"
          options={["100cm 미만", "100-150cm", "150cm-200", "200cm 초과"]}
          selected={width}
          onSelect={setWidth}
        />
        <OptionSelector
          label="유리"
          options={["있음", "없음"]}
          selected={hasGlass}
          onSelect={setHasGlass}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              itemTypeId,
              quantity,
              etc: {
                type,
                width,
                hasGlass,
              }
            })
          }
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default DeskModal;
