// 선택한 짐 목록 삭제하기

"use client";

type ItemDeleteModalProps = {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ItemDeleteModal({
  itemName,
  onConfirm,
  onCancel,
}: ItemDeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-80 shadow-md">
        <h2 className="text-lg font-semibold mb-2">
          {itemName} 항목을 삭제하시겠어요?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          해당 항목에 입력한 정보는 모두 삭제되고 복구할 수 없어요.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 text-gray-600"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-blue-500 text-white font-semibold"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
