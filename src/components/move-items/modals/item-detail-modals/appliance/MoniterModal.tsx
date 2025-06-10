// 모니터

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface MonitorModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const MonitorModal = ({ onClose }: MonitorModalProps) => {
  const [shape, setShape] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

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
          label="형태 선택"
          options={["일반", "곡면", "울트라와이드"]}
          selected={shape}
          onSelect={setShape}
        />
        <OptionSelector
          label="크기 선택"
          options={["24인치", "27인치", "32인치 이상"]}
          selected={size}
          onSelect={setSize}
        />
      </div>
    </ModalWrapper>
  );
};

export default MonitorModal;
