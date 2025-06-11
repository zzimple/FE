'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TimeOffRequest {
  startDate: string;
  endDate: string;
  type: string;
  reason?: string;
  status: '승인' | '대기중' | '반려';
}

export default function TimeOffRequestPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeOffType, setTimeOffType] = useState('연차');
  const [reason, setReason] = useState('');

  // 임시 데이터 - 실제로는 API에서 가져와야 함
  const timeOffHistory: TimeOffRequest[] = [
    {
      startDate: '2024-03-20',
      endDate: '2024-03-21',
      type: '연차',
      reason: '개인 사유',
      status: '승인'
    },
    {
      startDate: '2024-04-01',
      endDate: '2024-04-01',
      type: '반차',
      status: '대기중'
    },
    {
      startDate: '2024-03-15',
      endDate: '2024-03-15',
      type: '병가',
      reason: '병원 진료',
      status: '반려'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 기타 선택 시 사유 필수 입력 체크
    if (timeOffType === '기타' && !reason.trim()) {
      alert('기타 휴무의 경우 사유를 반드시 입력해주세요.');
      return;
    }

    // TODO: API 연동
    console.log({
      startDate,
      endDate,
      timeOffType,
      reason: timeOffType === '기타' ? reason : '',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-8">휴무 신청</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 휴무 기간 */}
          <div className="space-y-2">
            <label className="text-base font-semibold">
              📅 휴무 기간
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 h-14 px-4 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-[#2988FF]"
              />
              <span className="text-gray-400">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 h-14 px-4 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-[#2988FF]"
              />
            </div>
          </div>

          {/* 휴무 종류 */}
          <div className="space-y-2">
            <label className="text-base font-semibold">
              📋 휴무 종류
            </label>
            <select
              value={timeOffType}
              onChange={(e) => {
                setTimeOffType(e.target.value);
                if (e.target.value !== '기타') {
                  setReason(''); // 기타가 아닌 경우 사유 초기화
                }
              }}
              className="w-full h-14 px-4 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-[#2988FF] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:24px] bg-[right_16px_center] bg-no-repeat"
            >
              <option value="연차">연차</option>
              <option value="반차">반차</option>
              <option value="병가">병가</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 사유 */}
          {timeOffType === '기타' && (
            <div className="space-y-2">
              <label className="text-base font-semibold">
                📝 사유<span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="휴무 사유를 입력해주세요 (필수)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#2988FF] resize-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full h-14 rounded-full bg-[#2988FF] text-white font-medium text-sm"
          >
            신청하기
          </button>
        </form>

        {/* 휴무 신청 내역 */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-4">휴무 신청 내역</h2>
          <div className="space-y-4">
            {timeOffHistory.map((request, index) => (
              <div
                key={index}
                className="w-full p-4 border border-gray-200 rounded-2xl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold">
                        {request.startDate}
                        {request.startDate !== request.endDate && ` ~ ${request.endDate}`}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${request.status === '승인' ? 'bg-green-100 text-green-600' : 
                            request.status === '대기중' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'}`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{request.type}</p>
                    {request.reason && (
                      <p className="text-sm text-gray-500 mt-2">{request.reason}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
