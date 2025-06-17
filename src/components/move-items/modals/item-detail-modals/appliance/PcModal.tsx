// PC

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";
import { MoveItemDetail } from "@/types/moveItem";

interface PcModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const PcModal = ({ onClose, onSave, itemTypeId }: PcModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [hasPrinter, setHasPrinter] = useState<string | null>(null);

  return (
    <ModalWrapper>
      <ModalTop
        title="PC/데스크탑 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <OptionSelector
          label="프린터"
          options={["있음", "없음"]}
          selected={hasPrinter}
          onSelect={setHasPrinter}
        />

        <div className="pt-4">
          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
            onClick={() =>
              onSave({
                itemTypeId,
                quantity,
                etc: {
                  hasPrinter,
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

export default PcModal;
