// 냉장고 

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface RefrigeratorModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const RefrigeratorModal = ({ onClose }: RefrigeratorModalProps) => {
  const [type, setType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <ModalWrapper>
      <ModalTop
        title="냉장고 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <OptionSelector
          label="유형 선택"
          options={["양문형", "일반형", "김치냉장고", "기타"]}
          selected={type}
          onSelect={setType}
        />
      </div>
    </ModalWrapper>
  );
};

export default RefrigeratorModal;
