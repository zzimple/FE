"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { MoveItemDetail } from "@/types/moveItem";

interface MassageChairModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const MassageChairModal = ({ onClose, onSave, itemTypeId }: MassageChairModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [width, setWidth] = useState<string | null>(null);
  const [height, setHeight] = useState<string | null>(null);
  const [requestNote, setRequestNote] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="안마의자 정보 입력"
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
          label="높이 선택"
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
};

export default MassageChairModal;
