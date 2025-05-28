import React from "react";

interface ButtonProps { //Button이 받을 props 타입 정하는 역할
    children: React.ReactNode;
    onClick?: () => void; // onClick시 실행될 함수
    type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-[352px] h-[56px] px-[20px] py-[16px] pl-[24px] justify-center items-center gap-[8px] shrink-0 rounded-[28px] text-white
        ${
          disabled ? "bg-gray-300 cursor-not-allowed" : "bg-[#2988FF]"
        } ${className}`}
    >
      {children}
    </button>
  );
}


export default Button;