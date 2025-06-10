// 책장
"use client";

import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import OptionSelector from "@/components/move-items/common/OptionSelector";
import { useState } from "react";

interface BookshelfModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const BookshelfModal = ({ onClose, onSave }: BookshelfModalProps) => {
  const [width, setWidth] = useState<string | null>(null);
  const [height, setHeight] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <ModalWrapper>
      <ModalTop
        title="책장 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      <div className="p-4 space-y-4">
        <OptionSelector
          label="너비 선택"
          options={["60cm", "80cm", "100cm"]}
          selected={width}
          onSelect={setWidth}
        />
        <OptionSelector
          label="높이 선택"
          options={["120cm", "150cm", "180cm"]}
          selected={height}
          onSelect={setHeight}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mt-6"
          onClick={() =>
            onSave({
              quantity,
              width,
              height,
            })
          }
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default BookshelfModal;
