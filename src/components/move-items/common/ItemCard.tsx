"use client";

type ItemCardProps = {
  icon: string; // 이미지 경로
  onEdit: () => void;
  onDelete: () => void;
};

export default function ItemCard({ icon, onEdit, onDelete }: ItemCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm w-full max-w-[400px] w-full h-[90px] mx-auto mb-3">
      {/* 삭제 버튼 */}
      <button
        onClick={onDelete}
        className="text-gray-400 hover:text-red-500 text-xl font-bold px-2"
      >
        ×
      </button>
      {/* 아이콘과 이름 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <img src={icon} alt="icon" className="w-20 h-20 object-contain mb-1" />
        <div className="text-sm font-semibold text-gray-800 text-center mt-1">
          {/* 이름 */}
          {/** 이름은 부모에서 렌더링하거나, 필요시 props로 추가 */}
        </div>
      </div>
      {/* 편집 버튼 */}
      <button onClick={onEdit} className="text-blue-500 text-xl font-bold px-2">
        +
      </button>
    </div>
  );
}
