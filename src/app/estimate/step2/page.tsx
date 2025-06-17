"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "@/components/common/Calendar";
import TimeSelect from "@/components/common/TimeSelect";
import EstimateProgressHeader from "@/components/common/EstimateHeader";
import Button from "@/components/common/Button";
import { authApi } from "@/lib/axios";

const TIMES = ["08:00", "10:00", "12:00", "14:00", "16:00"];

interface HolidayInfo {
  date: string; // yyyy-MM-dd
  holiday?: boolean;
  goodDay?: boolean;
  weekend?: boolean;
}

export default function Step2Page() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [holidayInfoList, setHolidayInfoList] = useState<HolidayInfo[]>([]);
  const [currentYM, setCurrentYM] = useState<string>("");

  useEffect(() => {
    const today = new Date();
    const ym =
      today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, "0");
    setCurrentYM(ym);
  }, []);

  useEffect(() => {
    const fetchHolidayInfo = async () => {
      if (!currentYM) return;

      try {
        const res = await authApi.get(
          `/estimates/draft/holidays/preview?yearMonth=${currentYM}`
        );
        const data = res.data.data;

        const formatted = data.map((d: any) => {
          const year = Number(d.date.slice(0, 4));
          const month = Number(d.date.slice(4, 6)) - 1;
          const day = Number(d.date.slice(6, 8));
          const dateObj = new Date(year, month, day);
          const iso = dateObj.toISOString().slice(0, 10);

          return {
            date: iso,
            holiday: d.holiday === "Y" && d.dateName !== "손 없는 날",
            goodDay: d.dateName === "손 없는 날",
            weekend: d.dateName === "주말",
          };
        });

        setHolidayInfoList(formatted);
      } catch (err) {
        console.error("공휴일 정보 로딩 실패", err);
      }
    };

    fetchHolidayInfo();
  }, [currentYM]);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;

    const uuid = localStorage.getItem("uuid");
    if (!uuid) {
      console.error("uuid가 없습니다.");
      return;
    }

    const date = selectedDate.toISOString().slice(0, 10).replace(/-/g, "");

    try {
      const res = await authApi.post(
        `/estimates/draft/holiday/save?draftId=${uuid}`,
        {
          date,
          time: selectedTime,
        }
      );

      console.log("서버 응답", res.data);
      router.push("/estimate/step3");
    } catch (err) {
      console.error("날짜 저장 에러:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white">
      <EstimateProgressHeader step={2} title="예정일 입력" />

      <main className="flex-1 px-4 py-6 space-y-6">
        <h2 className="text-base font-semibold text-gray-900 text-center">
          <span className="text-blue-500">원하시는 날짜와 시간</span>을 선택해
          주세요.
        </h2>

        <div className="rounded-xl border p-4">
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            holidayInfoList={holidayInfoList}
            setCurrentYM={setCurrentYM}
          />
        </div>

        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            예약 시간
          </label>
          <TimeSelect
            options={TIMES}
            value={selectedTime}
            onChange={setSelectedTime}
          />
        </div>
      </main>

      <div className="px-4 py-6">
        <Button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className="w-full"
        >
          확인
        </Button>
      </div>
    </div>
  );
}
