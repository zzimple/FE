// 거실장/Tv장
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

const SystemHangerModal = ({ onClose, onSave, itemTypeId }: SystemHangerModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [material, setMaterial] = useState<string | null>(null);
  const [width, setWidth] = useState<string | null>(null);
  const [hasGlass, setHasGlass] = useState<boolean | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="거실장/TV장 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
      <OptionSelector
        label="재질"
        options={["나무", "철제", "기타"]}
        selected={material}
        onSelect={setMaterial}
      />
      <OptionSelector
        label="너비"
        options={["100cm 미만", "100-150cm", "150-200cm", "200cm 초과"]}
        selected={width}
        onSelect={setWidth}
      />
      <OptionSelector
        label="유리"
        options={["있음", "없음"]}
        selected={hasGlass === true ? "있음" : hasGlass === false ? "없음" : null}
        onSelect={(value) => setHasGlass(value === "있음" ? true : value === "없음" ? false : null)}
      />

      <div className="pt-4">
        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              itemTypeId,
              quantity,
              etc: {
                material,
                width,
                hasGlass,
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

export default SystemHangerModal;
