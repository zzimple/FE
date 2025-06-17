// 의류관리기
"use client"; 

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface ClothingCareModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const ClothingCareModal = ({ onClose, onSave, itemTypeId}: ClothingCareModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [width, setWidth] = useState<string | null>(null);
  const [height, setHeight] = useState<string | null>(null);
  const [specialNote, setSpecialNote] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="의류관리기 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <OptionSelector
          label="너비"
          options={["50cm 미만", "50-100cm", "100cm 초과"]}
          selected={width}
          onSelect={setWidth}
        />
        <OptionSelector
          label="높이 선택"
          options={["180cm 미만", "180cm 초과"]}
          selected={height}
          onSelect={setHeight}
        />
        <OptionSelector
          label="특이사항"
          options={["없음", "유리 있음", "듀얼(양문형)", "기타"]}
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
                  width,
                  height,
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

export default ClothingCareModal;
