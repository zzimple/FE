// 선반
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface ShelfModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const ShelfModal = ({ onClose, onSave, itemTypeId }: ShelfModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [material, setMaterial] = useState<string | null>(null);
  const [width, setWidth] = useState<string | null>(null);
  const [height, setHeight] = useState<string | null>(null);
  const [requestNote, setRequestNote] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="선반 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="재질"
          options={["플라스틱", "나무", "철제", "기타"]}
          selected={material}
          onSelect={setMaterial}
        />
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
          label="요청사항"
          options={[
            "분해 요청",
            "조립 요청",
            "분해/조립 모두 요청",
            "필요 없음",
          ]}
          selected={requestNote}
          onSelect={setRequestNote}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              itemTypeId,
              quantity,
              etc: {
                material,
                width,
                height,
                requestNote,
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

export default ShelfModal;
