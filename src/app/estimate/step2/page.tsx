// src/app/estimate/step2/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "@/components/common/Calendar";
import TimeSelect from "@/components/common/TimeSelect";
import EstimateProgressHeader from "@/components/common/EstimateHeader";
import Button from "@/components/common/Button";
import api from "@/lib/axios";

const TIMES = ["08:00", "10:00", "12:00", "14:00", "16:00"];

export default function Step2Page() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;

    const uuid = localStorage.getItem('uuid');
    if (!uuid) {
      console.error('uuid가 없습니다.');
      return;
    }
    const date = selectedDate?.toISOString().slice(0, 10).replace(/-/g, "");

    try {
      const res = await api.post(
        `/estimates/draft/holiday/save?draftId=${uuid}`,
        { date, time: selectedTime, }
      )

    console.log('서버 응답', res.data);
    router.push('/estimate/step3');
  } catch (err) {
    console.error('날짜 저장 에러:', err);
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
        <Button onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className="w-full">
          확인
        </Button>
      </div>
    </div>
  );
}
