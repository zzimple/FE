'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Schedule {
  date: string;
  time: string;
  type: string;
}

interface TimeOff {
  date: string;
  status: string;
  type: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'timeoff'>('schedule');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();

  // 임시 데이터 - 실제로는 API에서 가져와야 함
  const scheduleData: Schedule[] = [
    { date: '2024-03-18', time: '09:00 - 18:00', type: '정규 근무' },
    { date: '2024-03-19', time: '13:00 - 22:00', type: '야간 근무' },
    { date: '2024-03-20', time: '09:00 - 18:00', type: '정규 근무' },
  ];

  const timeOffData: TimeOff[] = [
    { date: '2024-04-01', status: '승인', type: '연차' },
    { date: '2024-05-15', status: '대기중', type: '반차' },
  ];

  // 현재 월의 날짜들을 생성
  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: CalendarDay[] = [];
    
    // 이전 달의 날짜들을 채움
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // 현재 달의 날짜들
    for (let date = 1; date <= lastDay.getDate(); date++) {
      days.push({
        date: new Date(year, month, date),
        isCurrentMonth: true
      });
    }
    
    // 다음 달의 날짜들을 채움
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const hasSchedule = (date: Date) => {
    const dateStr = formatDate(date);
    return scheduleData.some(schedule => schedule.date === dateStr);
  };

  const hasTimeOff = (date: Date) => {
    const dateStr = formatDate(date);
    return timeOffData.some(timeOff => timeOff.date === dateStr);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">근무 일정</h1>
          {activeTab === 'timeoff' && (
            <button
              onClick={() => router.push('/mypage/staff/timeoff/request')}
              className="inline-flex items-center px-4 h-10 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              휴무 신청
            </button>
          )}
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-xl mb-6 w-fit">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'schedule'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            근무 일정
          </button>
          <button
            onClick={() => setActiveTab('timeoff')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === 'timeoff'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            휴무 관리
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* 달력 */}
          <div className="md:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-200/50">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedDate(new Date())}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    오늘
                  </button>
                  <button
                    onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 mb-2">
                {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth().map(({ date, isCurrentMonth }, index) => (
                  <div
                    key={index}
                    className={`aspect-square p-1 rounded-lg hover:bg-gray-50 cursor-pointer group ${
                      isCurrentMonth ? '' : 'opacity-50'
                    } ${isToday(date) ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center relative">
                      <span
                        className={`text-sm font-medium mb-1 ${
                          isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                        } ${isToday(date) ? 'text-blue-600' : ''}`}
                      >
                        {date.getDate()}
                      </span>
                      <div className="flex space-x-1">
                        {hasSchedule(date) && (
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-indigo-500" />
                        )}
                        {hasTimeOff(date) && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:bg-emerald-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 일정 목록 */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 divide-y divide-gray-100">
              {activeTab === 'schedule' ? (
                scheduleData.map((schedule, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{schedule.date}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{schedule.time}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          schedule.type === '정규 근무'
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'bg-purple-50 text-purple-600'
                        }`}
                      >
                        {schedule.type}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                timeOffData.map((timeOff, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{timeOff.date}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{timeOff.type}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          timeOff.status === '승인'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {timeOff.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
