import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  /** 선택된 날짜를 부모에게 전달 */
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
}
const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  ); // 0-11
  const [days, setDays] = useState<Date[]>([]);

  // 해당 달의 날짜 배열 생성
  useEffect(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const tempDays: Date[] = [];

    // 달력의 첫 주 시작일(1일의 요일 전날들 포함)
    const startOffset = firstDay.getDay();
    for (let i = startOffset; i > 0; i--) {
      const d = new Date(currentYear, currentMonth, 1 - i);
      tempDays.push(d);
    }

    // 해당 달 모든 날짜
    for (let d = 1; d <= lastDay.getDate(); d++) {
      tempDays.push(new Date(currentYear, currentMonth, d));
    }

    // 마지막 주를 7일로 채우기
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
  };

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
      <div className="grid grid-cols-7 text-center text-sm font-medium">
        {WEEK_DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dateObj, idx) => {
          const isCurrentMonth = dateObj.getMonth() === currentMonth;
          const isSelected = selectedDate
            ? dateObj.toDateString() === selectedDate.toDateString()
            : false;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(dateObj)}
              disabled={!isCurrentMonth}
              className={`aspect-square text-center leading-loose rounded-xl
                ${isCurrentMonth ? "hover:bg-gray-100" : "text-gray-300"}
                ${isSelected ? "bg-blue-500 text-white" : ""}`}
            >
              {dateObj.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
