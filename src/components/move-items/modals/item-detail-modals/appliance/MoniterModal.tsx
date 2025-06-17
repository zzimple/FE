// 모니터

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface MonitorModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const MonitorModal = ({ onClose, onSave, itemTypeId }: MonitorModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [shape, setShape] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="모니터 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="형태"
          options={["일반 모니터", "커브드 모니터"]}
          selected={shape}
          onSelect={setShape}
        />
        <OptionSelector
          label="크기"
          options={["30인치 미만", "30-39인치","40-49인치","50-50인치", "70인치 초과"]}
          selected={size}
          onSelect={setSize}
        />

        <div className="pt-4">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={() =>
              onSave({
                itemTypeId,
                quantity,
                etc: {
                  shape,
                  size,
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

export default MonitorModal;
