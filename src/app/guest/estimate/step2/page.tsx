"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "@/components/common/Calendar";
import TimePicker from "@/components/common/TimePicker";
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
  const [pickerOpen, setPickerOpen] = useState(false);

  // 시/분 배열 생성
  const hourOptions = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minuteOptions = ["00", "30"];

  function getAmPm(hour: number) {
    if (hour < 12) return "오전";
    return "오후";
  }
  function formatDisplay(time?: string) {
    if (!time) return "시간을 선택해주세요";
    const [h, m] = time.split(":");
    const hour = parseInt(h, 10);
    const ampm = getAmPm(hour);
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${ampm} ${displayHour.toString().padStart(2, "0")}:${m}`;
  }

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

    // const date = selectedDate.toISOString().slice(0, 10).replace(/-/g, "");

    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const date = `${y}${m}${d}`;

    try {
      const res = await authApi.post(
        `/estimates/draft/holiday/save?draftId=${uuid}`,
        {
          date,
          time: selectedTime,
        }
      );

      console.log("서버 응답", res.data);
      router.push("/guest/estimate/step3");
    } catch (err) {
      console.error("날짜 저장 에러:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      <EstimateProgressHeader step={2} title="예정일 입력" />
      <div className="w-full max-w-5xl px-4 md:px-12">
        <main className="mt-16 flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mt-4 mb-4 text-gray-900">
            <span className="text-blue-600">원하시는 날짜와 시간</span>을 선택해
            주세요.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 text-center mb-8">
            이사 예약을 원하는 날짜와 시간을 입력해 주세요.
          </p>
          <div className="flex flex-col md:flex-row gap-8 w-full justify-center md:items-start items-center mb-8">
            <div className="p-0 md:p-0 w-full md:w-auto flex-shrink-0">
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                holidayInfoList={holidayInfoList}
                setCurrentYM={setCurrentYM}
              />
            </div>
            <div className="w-full md:w-[220px] flex flex-col items-center relative mt-6 md:mt-0 md:ml-8">
              <label className="block mb-2 text-base font-semibold text-gray-700">
                예약 시간
              </label>
              <button
                type="button"
                className="w-full h-14 px-5 flex items-center justify-between border border-gray-300 rounded-xl text-base font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition shadow hover:border-blue-400 focus:border-blue-400"
                onClick={() => setPickerOpen(true)}
              >
                <span>{formatDisplay(selectedTime)}</span>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="#888"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="w-full relative">
                <TimePicker
                  value={selectedTime}
                  onChange={setSelectedTime}
                  open={pickerOpen}
                  onClose={() => setPickerOpen(false)}
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handleConfirm}
            disabled={!selectedDate || !selectedTime}
            className="mt-8 w-full max-w-md h-16 rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition"
          >
            확인
          </Button>
        </main>
      </div>
    </div>
  );
}
