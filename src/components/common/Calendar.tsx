"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
}

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate }) => {
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [days, setDays] = useState<Date[]>([]);
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  // 예시용 공휴일 / 손없는날
  const holidays = ["2025-06-06", "2025-06-14"];
  const luckyDays = ["2025-06-18", "2025-06-30"];

  useEffect(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const tempDays: Date[] = [];

    const startOffset = firstDay.getDay();
    for (let i = startOffset; i > 0; i--) {
      const d = new Date(currentYear, currentMonth, 1 - i);
      tempDays.push(d);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      tempDays.push(new Date(currentYear, currentMonth, d));
    }

    const endOffset = 6 - lastDay.getDay();
    for (let i = 1; i <= endOffset; i++) {
      tempDays.push(new Date(currentYear, currentMonth + 1, i));
    }

    setDays(tempDays);
  }, [currentYear, currentMonth]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelect = (date: Date) => {
    onSelectDate?.(date);

    const ymd = date.toISOString().slice(0, 10); // yyyy-MM-dd
    if (holidays.includes(ymd)) {
      setSelectedInfo("📌 공휴일입니다. 추가 요금이 발생할 수 있어요!");
    } else if (luckyDays.includes(ymd)) {
      setSelectedInfo(
        "✨ 손 없는 날입니다. 인기가 많아 조기 마감될 수 있어요!"
      );
    } else {
      setSelectedInfo(null);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0); // 비교용으로 시간 제거

  return (
    <div className="p-4 bg-white shadow-md rounded-2xl">
      {/* 헤더: 월 네비게이션 */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">
          {currentYear}년 {currentMonth + 1}월
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center text-sm font-medium mb-1">
        {WEEK_DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dateObj, idx) => {
          const isCurrentMonth = dateObj.getMonth() === currentMonth;
          const isSelected =
            selectedDate?.toDateString() === dateObj.toDateString();
          const isPast = dateObj < today;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(dateObj)}
              disabled={!isCurrentMonth || isPast}
              className={`aspect-square text-center leading-loose rounded-xl
                ${!isCurrentMonth ? "text-gray-300" : ""}
                ${
                  isPast
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }
                ${isSelected ? "bg-blue-500 text-white font-bold" : ""}`}
            >
              {dateObj.getDate()}
            </button>
          );
        })}
      </div>

      {/* 선택된 날짜 설명 */}
      {selectedInfo && (
        <div className="mt-3 text-sm text-center text-blue-600 font-medium">
          {selectedInfo}
        </div>
      )}

      {/* 하단 설명 문구 */}
      <p className="mt-4 text-xs text-gray-500 leading-relaxed text-center">
        <span className="text-red-500 font-semibold">● 많음</span>,{" "}
        <span className="text-orange-400 font-semibold">● 보통</span>,{" "}
        <span className="text-blue-500 font-semibold">● 여유</span>는 신청
        현황을 나타냅니다.
        <br />
        * 회색 날짜는 선택할 수 없어요.
        <br />* 손없는 날, 공휴일, 주말은 추가 요금이 발생할 수 있어요!
      </p>
    </div>
  );
};

export default Calendar;
