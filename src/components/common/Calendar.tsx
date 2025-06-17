"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HolidayInfo {
  date: string;
  holiday?: boolean;
  goodDay?: boolean;
  weekend?: boolean;
}

interface CalendarProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  holidayInfoList?: HolidayInfo[];
  setCurrentYM?: (ym: string) => void;
}

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onSelectDate,
  holidayInfoList = [],
  setCurrentYM,
}) => {
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [days, setDays] = useState<Date[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<string | null>(null);

  useEffect(() => {
    const paddedMonth = String(currentMonth + 1).padStart(2, "0");
    const ym = `${currentYear}${paddedMonth}`;
    setCurrentYM?.(ym);
  }, [currentYear, currentMonth, setCurrentYM]);

  useEffect(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const tempDays: Date[] = [];

    const startOffset = firstDay.getDay();
    for (let i = startOffset; i > 0; i--) {
      tempDays.push(new Date(currentYear, currentMonth, 1 - i));
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

  const handleSelect = (date: Date) => {
    onSelectDate?.(date);

    const ymd = date.toISOString().slice(0, 10);
    const info = holidayInfoList.find((d) => d.date === ymd);

    if (info?.goodDay) {
      setSelectedNotice(
        "선택하신 날짜는 손없는 날이에요! 추가금이 발생할 예정입니다."
      );
    } else if (info?.holiday) {
      setSelectedNotice(
        "선택하신 날짜는 공휴일이에요! 추가금이 발생할 예정입니다."
      );
    } else if (info?.weekend) {
      setSelectedNotice(
        "선택하신 날짜는 주말이에요! 추가금이 발생할 예정입니다."
      );
    } else {
      setSelectedNotice(null);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="p-4 bg-white shadow-md rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentYear((y) => y - 1);
              setCurrentMonth(11);
            } else {
              setCurrentMonth((m) => m - 1);
            }
          }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">
          {currentYear}년 {currentMonth + 1}월
        </h2>
        <button
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentYear((y) => y + 1);
              setCurrentMonth(0);
            } else {
              setCurrentMonth((m) => m + 1);
            }
          }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-sm font-medium mb-1">
        {WEEK_DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((dateObj, idx) => {
          const ymd = dateObj.toISOString().slice(0, 10);
          const isCurrentMonth = dateObj.getMonth() === currentMonth;
          const isSelected =
            selectedDate?.toDateString() === dateObj.toDateString();
          const isFuture = dateObj >= today;
          const info = holidayInfoList.find((d) => d.date === ymd);

          return (
            <div key={idx} className="text-center">
              <button
                onClick={() => handleSelect(dateObj)}
                disabled={!isCurrentMonth || !isFuture}
                className={`aspect-square w-full rounded-xl text-sm
                  ${!isCurrentMonth ? "text-gray-300" : ""}
                  ${
                    !isFuture
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }
                  ${isSelected ? "bg-blue-500 text-white font-bold" : ""}`}
              >
                {dateObj.getDate()}
              </button>
              {info?.goodDay && (
                <div className="text-blue-500 text-[10px]">손없는날</div>
              )}
              {info?.holiday && (
                <div className="text-red-500 text-[10px]">공휴일</div>
              )}
              {/* 주말 텍스트 제거됨 */}
            </div>
          );
        })}
      </div>

      {selectedNotice && (
        <div className="mt-4 text-sm text-blue-600 font-medium text-center">
          {selectedNotice}
        </div>
      )}
    </div>
  );
};

export default Calendar;
