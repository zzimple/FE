"use client";

type ItemCardProps = {
  icon: string; // 이미지 경로
  onEdit: () => void;
  onDelete: () => void;
};

export default function ItemCard({ icon, onEdit, onDelete }: ItemCardProps) {
  return (
    <div className="flex items-center justify-between border rounded px-4 py-3 mb-2 shadow-sm">
      {/* 삭제 버튼 */}
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-500 text-xl"
      >
        x
      </button>

      {/** 아이콘 표시 */}
      <div className="flex-1 flex justify-center">
        <img src={icon} alt="icon" className="w-16 h-16 object-contain" />
      </div>

      {/* 편집 버튼 */}
      <button onClick={onEdit} className="text-blue-500 text-xl font-bold">
        +
      </button>
    </div>
  );
}
