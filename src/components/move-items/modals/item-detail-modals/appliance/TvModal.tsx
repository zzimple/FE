// Tv

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface TvModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const TvModal = ({ onClose }: TvModalProps) => {
  const [type, setType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <ModalWrapper>
      <ModalTop
        title="TV 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />

      <div className="p-4 space-y-4">
        <OptionSelector
          label="유형 선택"
          options={["벽걸이형", "스탠드형", "기타"]}
          selected={type}
          onSelect={setType}
        />
      </div>
    </ModalWrapper>
  );
};

export default TvModal;
