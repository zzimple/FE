// 북

"use client";

import { useState } from "react";
import ModalWrapper from "@/components/move-items/common/ModalWrapper";
import ModalTop from "@/components/move-items/common/ModalTop";
import { MoveItemDetail } from "@/types/moveItem";

interface BookModalProps {
  onClose: () => void;
  onSave: (data: MoveItemDetail) => void;
  itemTypeId: number;
}

const BookModal = ({ onClose, onSave, itemTypeId }: BookModalProps) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <ModalWrapper>
      <ModalTop
        title="책 정보 입력"
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={onClose}
      />
      
      <div className="pt-4">
        <button
          className="w-full bg-blue-500 text-white py-2 rounded"
          onClick={() =>
            onSave({
              itemTypeId,
              quantity,
              etc: {},
            })
          }
        >
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default BookModal;
