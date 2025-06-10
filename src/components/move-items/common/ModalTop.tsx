// 타이틀 + 수량 컴포넌트입니당
import React from "react";

export default function ModalTop({
  title,
  quantity,
  onQuantityChange,
  onClose,
}: {
  title: string;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* 제목 + 닫기 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button onClick={onClose} className="text-xl">
          ✕
        </button>
      </div>
      
      {/* 수량 입력 */}
      <div className="mb-4">
        <p className="font-medium mb-1">수량</p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="border px-3 py-1 rounded"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="border px-3 py-1 rounded"
          >
            +
          </button>
        </div>
      </div>
    </>
  );
}
