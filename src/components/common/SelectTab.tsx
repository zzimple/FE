import React from "react";

interface SelectTabProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  variant?: "blue" | "default";
}
export default function SelectTab({
  label,
  selected,
  onClick,
  variant = "default",
}: SelectTabProps) {
  const getVariantStyles = () => {
    if (variant === "blue") {
      return selected
        ? "bg-blue-500 text-white border-blue-500"
        : "bg-transparent border-blue-300 text-black";
    }
    // default variant
    return selected
      ? "bg-gray-500 text-white border-gray-500"
      : "bg-transparent border-gray-300 text-black";
  };
  
  return (
    <button
      onClick={onClick}
      className={`w-[113px] h-[44px] px-[10px] py-[10px] rounded-[6.6px] border text-sm font-medium md:text-xl md:w-40 md:h-16 md:rounded-xl
          ${selected
          ? "bg-blue-500 text-white border-blue-500"
          : "bg-transparent border-blue-300 text-black"
        }`}
    >
      {label}
    </button>
  );
}
