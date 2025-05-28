'use client';

import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface TimeSelectProps {
  options: string[]; // 드롭 다운에 표시할 시간들
  value?: string; // 현재 선택 된 시간 저장
  onChange?: (value: string) => void; // 값이 바뀔 때 상위에 알려쥐는 콜백
}

export default function TimeSelect({ options, value, onChange }: TimeSelectProps) {
  const [open, setOpen] = useState(false); // 드롭 다운이 열렸는지 닫혔는지
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ alignSelf: 'stretch' }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          flex item-center justify-between
          w-full h-14 px-5
          gap-2
          border-neutral-secondary bg-white
          text-sm text-gray-800  
        "
      >
        <span>{value || '시간을 선택해주세요'}</span>
        {open
          ? <ChevronUp size={20} />
          : <ChevronDown size={20} />
        }
      </button>
      {open && (
        <ul
          className="
            absolute left-0 right-0
            mt-2
            max-h-60 overflow-auto
            bg-white border boder-neutral-secondary
            rounded-lg shadow-lg
            z-10
          "
        >
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onChange?.(opt);
                  setOpen(false);
                }}
                className="w-full text-left px-5 py-3 hover:bg-gray-100"
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}