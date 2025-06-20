import React, { useState, useEffect, useRef } from "react";

interface TimePickerProps {
  value?: string; // '08:00' 형식
  onChange: (value: string) => void;
  open: boolean;
  onClose: () => void;
}

const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);
const minutes = ["00", "30"];

function getAmPm(hour: number) {
  if (hour < 12) return "오전";
  return "오후";
}

function formatDisplay(hour: string, minute: string) {
  const h = parseInt(hour, 10);
  const ampm = getAmPm(h);
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${ampm} ${displayHour.toString().padStart(2, "0")}:${minute}`;
}

export default function TimePicker({
  value,
  onChange,
  open,
  onClose,
}: TimePickerProps) {
  const [selectedHour, setSelectedHour] = useState("08");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setSelectedHour(h);
      setSelectedMinute(m);
    }
  }, [value, open]);

  // 데스크탑: 바깥 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        window.innerWidth >= 768 &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  const handleConfirm = () => {
    onChange(`${selectedHour}:${selectedMinute}`);
    onClose();
  };

  return (
    <>
      {/* 모바일: fixed 모달 + 배경 */}
      <div
        className={`md:hidden fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-30 transition-all duration-200 ${
          open ? "visible" : "invisible pointer-events-none"
        }`}
        style={{ minHeight: open ? "100vh" : 0 }}
        onClick={onClose}
      >
        <div
          className="w-full max-w-md bg-white rounded-t-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">예약 시간</span>
            <button
              onClick={onClose}
              className="text-gray-400 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <div className="flex justify-center gap-6 py-4">
            {/* 시 휠 */}
            <div className="overflow-y-auto h-40 w-20 no-scrollbar text-center">
              {hours.map((h) => (
                <div
                  key={h}
                  className={`py-2 text-lg cursor-pointer rounded-md transition-colors ${
                    selectedHour === h
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-gray-400"
                  }`}
                  onClick={() => setSelectedHour(h)}
                >
                  {h}
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center text-xl font-bold text-gray-500">
              :
            </div>
            {/* 분 휠 */}
            <div className="overflow-y-auto h-40 w-20 no-scrollbar text-center">
              {minutes.map((m) => (
                <div
                  key={m}
                  className={`py-2 text-lg cursor-pointer rounded-md transition-colors ${
                    selectedMinute === m
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-gray-400"
                  }`}
                  onClick={() => setSelectedMinute(m)}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center text-base font-medium mb-4">
            {formatDisplay(selectedHour, selectedMinute)}
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              취소
            </button>
            <button
              className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              onClick={handleConfirm}
            >
              확인
            </button>
          </div>
        </div>
      </div>
      {/* 데스크탑: 인풋 아래 드롭다운/팝오버 */}
      {open && (
        <div
          ref={popoverRef}
          className="hidden md:block absolute left-0 w-[340px] z-30"
        >
          <div className="bg-white rounded-lg shadow-xl p-2 border border-gray-300 w-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold">예약 시간</span>
            </div>
            <div className="flex justify-center gap-4 py-2">
              {/* 시 휠 */}
              <div className="overflow-y-auto h-32 w-16 no-scrollbar text-center">
                {hours.map((h) => (
                  <div
                    key={h}
                    className={`py-2 text-lg cursor-pointer rounded-md transition-colors ${
                      selectedHour === h
                        ? "bg-blue-50 text-blue-600 font-bold"
                        : "text-gray-400"
                    }`}
                    onClick={() => setSelectedHour(h)}
                  >
                    {h}
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center text-2xl font-bold text-gray-500">
                :
              </div>
              {/* 분 휠 */}
              <div className="overflow-y-auto h-32 w-16 no-scrollbar text-center">
                {minutes.map((m) => (
                  <div
                    key={m}
                    className={`py-2 text-lg cursor-pointer rounded-md transition-colors ${
                      selectedMinute === m
                        ? "bg-blue-50 text-blue-600 font-bold"
                        : "text-gray-400"
                    }`}
                    onClick={() => setSelectedMinute(m)}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center text-lg font-medium mb-3">
              {formatDisplay(selectedHour, selectedMinute)}
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 py-3 rounded-md bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors text-base"
                onClick={onClose}
              >
                취소
              </button>
              <button
                className="flex-1 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-base"
                onClick={handleConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
