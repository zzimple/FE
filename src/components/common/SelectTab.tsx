import React from "react"

interface SelectTabProps {
    label: string;
    selected: boolean;
    onClick: () => void;
}
export default function SelectTab({ label, selected, onClick }: SelectTabProps) {
    return (
      <button
        onClick={onClick}
        className={`w-[113px] h-[44px] px-[10px] py-[10px] rounded-[6.6px] border text-sm font-medium
          ${
            selected
              ? "bg-[#DBEBFF] border-blue-400 text-black"
              : "bg-white border-[#B3B3B3] text-black"
          }`}
      >
        {label}
      </button>
    );
}