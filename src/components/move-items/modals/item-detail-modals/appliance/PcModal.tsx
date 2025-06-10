// PC

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface PcModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const PcModal = ({ onClose }: PcModalProps) => {
  const [hasPrinter, setHasPrinter] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

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
          label="프린터 여부"
          options={["있음", "없음"]}
          selected={hasPrinter}
          onSelect={setHasPrinter}
        />
      </div>
    </ModalWrapper>
  );
};

export default PcModal;
