// 진열장
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface DrawerModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const DrawerModal = ({ onClose, onSave,itemTypeId }: DrawerModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [width, setWidth] = useState<string | null>(null);
  const [height, setHeight] = useState<string | null>(null);
  const [hasGlass, setHasGlass] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="진열장 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <OptionSelector
          label="너비"
          options={["50cm 미만", "50-100cm", "100-150cm", "150cm 초과"]}
          selected={width}
          onSelect={setWidth}
        />
        <OptionSelector
          label="높이"
          options={["50cm 미만", "50-100cm", "100-150cm", "150cm 초과"]}
          selected={height}
          onSelect={setHeight}
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
                hasGlass,
                width,
                height,
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

export default DrawerModal;
