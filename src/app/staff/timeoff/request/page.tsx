'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StaffHeader from "@/components/headers/StaffHeader";
import Pagination from "@/components/common/Pagination";

import { authApi } from "@/lib/axios";

type Status = 'APPROVED' | 'PENDING' | 'REJECTED';
type TimeOffType = 'ANNUAL' | 'HALF' | 'SICK' | 'ETC';


const mapStatusToKorean = (status: Status) => {
    switch (status) {
        case 'APPROVED': return '승인';
        case 'PENDING': return '대기중';
        case 'REJECTED': return '거절';
        default: return status;
    }
};

const mapToApiType = (koreanType: string): TimeOffType => {
    switch (koreanType) {
        case '연차': return 'ANNUAL';
        case '반차': return 'HALF';
        case '병가': return 'SICK';
        case '기타': return 'ETC';
        default: return 'ETC'; // fallback
    }
};

const mapTypeToKorean = (type: TimeOffType) => {
    switch (type) {
        case 'ANNUAL': return '연차';
        case 'HALF': return '반차';
        case 'SICK': return '병가';
        case 'ETC': return '기타';
        default: return type;
    }
};

interface TimeOffRequest {
    startDate: string;
    endDate: string;
    type: TimeOffType;
    reason?: string;
    status: Status;
}

export default function TimeOffRequestPage() {
    const router = useRouter();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [timeOffType, setTimeOffType] = useState('연차');
    const [reason, setReason] = useState('');
    const [timeOffHistory, setTimeOffHistory] = useState<TimeOffRequest[]>([]);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // ✨ 오늘 날짜를 YYYY-MM-DD 형식으로 가져오는 함수 추가
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 시작일이 변경될 때 종료일 제한을 위한 핸들러
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        // 종료일이 시작일보다 빠른 경우 종료일을 시작일로 설정
        if (endDate && endDate < newStartDate) {
            setEndDate(newStartDate);
        }
    };

    // 휴무 내역을 가져오는 함수
    const fetchTimeOffHistory = useCallback(async (currentPage = page) => {
        try {
            const response = await authApi.get('/staff/time-off/me', {
                params: { page: currentPage, size: 5 }
            });
            setTimeOffHistory(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error('휴무 내역 조회 실패:', err);
        }
    }, [page]);

    // 페이지 변경될 때마다 불러오기
    useEffect(() => {
        fetchTimeOffHistory();
    }, [fetchTimeOffHistory]);

    // 휴무 신청 후 자동 갱신
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 날짜 선택 유효성 검사 
        if (!startDate || !endDate) {
            alert('휴무 기간을 선택해주세요.');
            return;
        }

        // 기타일 경우 사유 반드시 입력
        if (timeOffType === '기타' && !reason.trim()) {
            alert('기타 휴무의 경우 사유를 반드시 입력해주세요.');
            return;
        }

        try {
            const payload = {
                startDate,
                endDate,
                type: mapToApiType(timeOffType),
                reason: timeOffType === '기타' ? reason : '',
            };

            await authApi.post('/staff/time-off/request', payload);
            alert('휴무 신청이 완료되었습니다.');

            // 리스트 새로고침
            await fetchTimeOffHistory();
            setStartDate('');
            setEndDate('');
            setTimeOffType('연차');
            setReason('');
        } catch (err) {
            console.error(err);
            alert('휴무 신청에 실패했습니다.');
        }
    };

    // 페이지 변경 핸들러 (Pagination 컴포넌트용)
    const handlePageChange = (newPage: number) => {
        // Pagination은 1부터 시작하므로 0부터 시작하는 page로 변환
        setPage(newPage - 1);
    };

    return (
        <div className="min-h-screen bg-white">
            <StaffHeader />
            <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
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
                                    min={getTodayString()}
                                    onChange={handleStartDateChange}
                                    className="flex-1 h-14 px-4 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-[#2988FF]"
                                />
                                <span className="text-gray-400">~</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate || getTodayString()}
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
                                                        ${request.status === 'APPROVED'
                                                            ? 'bg-green-100 text-green-600'
                                                            : request.status === 'PENDING'
                                                                ? 'bg-yellow-100 text-yellow-600'
                                                                : 'bg-red-100 text-red-600'
                                                        }`}
                                                >
                                                    {mapStatusToKorean(request.status)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {mapTypeToKorean(request.type)}
                                            </p>
                                            {request.reason && (
                                                <p className="text-sm text-gray-500 mt-2">{request.reason}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination 컴포넌트 사용 */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={page + 1} // 0부터 시작하는 page를 1부터 시작하는 값으로 변환
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
