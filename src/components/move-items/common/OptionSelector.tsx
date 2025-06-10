// 선택용 공통 버튼
"use client";

type OptionSelectProps = {
  label: string;
  options: string[]; 
  selected: string | null;
  onSelect: (value: string) => void;
};

export default function OptionSelector({
  label, // 제목
  options, // 옵션(버튼들)
  selected, // 선택된 값 (이 버튼만 파랗게)
  onSelect, // 선택된 값을 넘겨줌(상태 ㅂㅏ꿔줌)
}: OptionSelectProps) {
  return (
    <div className="mb-4">
      <p className="font-medium mb-1">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`border px-3 py-2 rounded ${
              selected === opt ? "bg-blue-500 text-white" : ""
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
