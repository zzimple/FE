'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StaffHeader from "@/components/headers/StaffHeader";
import { authApi } from '@/lib/axios';
import UnauthorizedPage from "@/components/common/UnauthorizedPage";

interface Schedule {
  date: string;
  time: string;
  type: string;
}

interface CalendarItem {
  date: string;
  type: 'WORK' | 'TIME_OFF';
  timeOff?: {
    type: 'ANNUAL' | 'HALF' | 'SICK' | 'ETC';
    reason: string;
  };
  work?: {
    estimateNo: number;
    storeId: number;
    staffName: string;
    fromAddress: string;
    toAddress: string;
  };
}

interface Assignment {
  estimateNo: number;
  workDate: string;
  staffName: string;
}

interface TimeOff {
  startDate: string;
  endDate: string;
  status: string;
  type: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

// API 응답 타입 정의
type CalendarResponse = CalendarItem[];

interface AssignmentResponse {
  success: boolean;
  code: string;
  message: string;
  data: Assignment[];
}

interface TimeOffResponse {
  success: boolean;
  code: string;
  message: string;
  data: TimeOffData[];
}

interface TimeOffData {
  staffTimeOffId: number;
  staffName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  startDate: string;
  endDate: string;
  type: 'ANNUAL' | 'HALF' | 'SICK' | 'ETC';
  reason: string;
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clickedDate, setClickedDate] = useState<Date | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const router = useRouter();

  // 스태프 권한 확인
  useEffect(() => {
    const checkStaffAccess = async () => {
      try {
        const res = await authApi.get("/staff/profile");
        if (res.data.success) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (e: any) {
        console.error("Staff 권한 확인 실패", e);

        // 401 에러인 경우 로그인 페이지로 리다이렉트
        if (e.response?.status === 401) {
          window.location.href = "/login";
          return;
        }

        // 403 에러인 경우 권한 없음
        if (e.response?.status === 403) {
          setError("스태프 권한이 필요합니다. 사장님께 인증을 받아주세요.");
        }

        setHasAccess(false);
      }
    };

    checkStaffAccess();
  }, []);

  // 권한이 확인된 후에만 데이터 로드
  useEffect(() => {
    if (hasAccess === true) {
      fetchCalendarData();
    }
  }, [hasAccess]);

  // selectedDate가 변경될 때마다 데이터 다시 로드
  useEffect(() => {
    if (hasAccess === true) {
      fetchCalendarData();
    }
  }, [selectedDate]);

  // 캘린더 데이터 상태 변경 시 로그 출력
  useEffect(() => {
    console.log('캘린더 데이터 상태 변경:', calendarData);
  }, [calendarData]);

  // 캘린더 데이터 가져오기 함수
  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 쿠키에서 토큰 확인
      const cookies = document.cookie.split(';');
      const accessToken = cookies.find(cookie => cookie.trim().startsWith('accessToken='));

      if (!accessToken) {
        setError('로그인이 필요합니다.');
        return;
      }

      // 현재 선택된 월을 YYYY-MM 형식으로 변환
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const yearMonth = `${year}-${month}`;

      console.log('캘린더 API 호출:', `/staff/time-off/calendar?yearMonth=${yearMonth}`);

      // yearMonth 파라미터로 API 호출
      const response = await authApi.get<CalendarResponse>('/staff/time-off/calendar', {
        params: { yearMonth }
      });

      // API 응답이 직접 배열 형태로 오므로 response.data를 바로 사용
      setCalendarData(response.data);
      console.log('캘린더 데이터 로드 완료:', response.data);

    } catch (error: any) {
      console.error('캘린더 데이터를 가져오는 중 오류가 발생했습니다:', error);

      if (error.response?.status === 403) {
        setError('접근 권한이 없습니다. 스태프 권한이 필요합니다.');
      } else if (error.response?.status === 401) {
        setError('인증이 만료되었습니다. 다시 로그인해주세요.');
      } else if (error.response?.status === 404) {
        setError('API 엔드포인트를 찾을 수 없습니다.');
      } else if (error.response?.status >= 500) {
        setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        setError('네트워크 연결을 확인해주세요.');
      } else {
        setError(`오류가 발생했습니다: ${error.response?.status || '알 수 없는 오류'}`);
      }
    } finally {
      setLoading(false);
    }
  };

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
    const currentDate = formatDate(date); // yyyy-MM-dd 형식

    return calendarData.some(item => {
      return item.date === currentDate && item.type === 'WORK';
    });
  };

  const hasTimeOff = (date: Date) => {
    const currentDate = formatDate(date); // yyyy-MM-dd 형식

    return calendarData.some(item => {
      return item.date === currentDate && item.type === 'TIME_OFF';
    });
  };

  const getTimeOffType = (date: Date) => {
    const currentDate = formatDate(date);

    const timeOff = calendarData.find(item => {
      return item.date === currentDate && item.type === 'TIME_OFF';
    });

    return timeOff?.timeOff?.type || null;
  };

  // 휴무 타입을 한글로 변환하는 함수
  const getTimeOffTypeKorean = (type: 'ANNUAL' | 'HALF' | 'SICK' | 'ETC') => {
    switch (type) {
      case 'ANNUAL': return '연차';
      case 'HALF': return '반차';
      case 'SICK': return '병가';
      case 'ETC': return '기타';
      default: return '기타';
    }
  };

  // 선택된 날짜의 근무 일정 필터링
  const getSelectedDateAssignments = () => {
    if (!clickedDate) return calendarData.filter(item => item.type === 'WORK');

    const clickedDateStr = formatDate(clickedDate);
    return calendarData.filter(item => item.date === clickedDateStr && item.type === 'WORK');
  };

  // 선택된 날짜의 휴무 일정 필터링
  const getSelectedDateTimeOffs = () => {
    if (!clickedDate) return calendarData.filter(item => item.type === 'TIME_OFF');

    const clickedDateStr = formatDate(clickedDate);
    return calendarData.filter(item => item.date === clickedDateStr && item.type === 'TIME_OFF');
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date: Date) => {
    if (clickedDate &&
      clickedDate.getDate() === date.getDate() &&
      clickedDate.getMonth() === date.getMonth() &&
      clickedDate.getFullYear() === date.getFullYear()) {
      // 같은 날짜를 다시 클릭하면 선택 해제
      setClickedDate(null);
    } else {
      setClickedDate(date);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <StaffHeader />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
        {/* 권한 로딩 중인 경우 로딩 표시 */}
        {hasAccess === null && (
          <div className="text-center mt-20 text-gray-500">로딩 중...</div>
        )}

        {/* 권한 없는 경우 */}
        {hasAccess === false && (
          <UnauthorizedPage />
        )}

        {/* 권한 있는 경우 메인 콘텐츠 */}
        {hasAccess === true && (
          <>
            {/* 상단 헤더 */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">일정 관리</h1>
              <button
                onClick={() => router.push('/staff/timeoff/request')}
                className="inline-flex items-center px-4 h-10 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                휴무 신청
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
                        onClick={() => {
                          const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
                          setSelectedDate(newDate);
                          setClickedDate(null);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDate(new Date());
                          setClickedDate(null);
                        }}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        오늘
                      </button>
                      <button
                        onClick={() => {
                          const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
                          setSelectedDate(newDate);
                          setClickedDate(null);
                        }}
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
                        onClick={() => handleDateClick(date)}
                        className={`aspect-square p-1 rounded-lg hover:bg-gray-50 cursor-pointer group ${isCurrentMonth ? '' : 'opacity-50'
                          } ${isToday(date) ? 'bg-blue-50/50' : ''
                          } ${clickedDate &&
                            clickedDate.getDate() === date.getDate() &&
                            clickedDate.getMonth() === date.getMonth() &&
                            clickedDate.getFullYear() === date.getFullYear()
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : ''
                          }`}
                      >
                        <div className="w-full h-full flex flex-col items-center justify-center relative">
                          <span
                            className={`text-sm font-medium mb-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                              } ${isToday(date) ? 'text-blue-600' : ''
                              } ${clickedDate &&
                                clickedDate.getDate() === date.getDate() &&
                                clickedDate.getMonth() === date.getMonth() &&
                                clickedDate.getFullYear() === date.getFullYear()
                                ? 'text-blue-700 font-semibold'
                                : ''
                              }`}
                          >
                            {date.getDate()}
                          </span>
                          <div className="flex space-x-1">
                            {hasSchedule(date) && (
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-indigo-500" />
                            )}
                            {hasTimeOff(date) && (
                              <div
                                className={`w-1.5 h-1.5 rounded-full group-hover:opacity-80 ${getTimeOffType(date) === 'ANNUAL' ? 'bg-blue-400' :
                                  getTimeOffType(date) === 'HALF' ? 'bg-purple-400' :
                                    getTimeOffType(date) === 'SICK' ? 'bg-red-400' :
                                      'bg-gray-400'
                                  }`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 범례 */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                      <span className="text-gray-600">근무</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-gray-600">연차</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-gray-600">반차</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <span className="text-gray-600">병가</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-gray-600">기타</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 일정 목록 */}
              <div className="md:col-span-5 space-y-4">
                {/* 선택된 날짜 표시 */}
                {clickedDate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">
                        {clickedDate.getFullYear()}년 {clickedDate.getMonth() + 1}월 {clickedDate.getDate()}일
                      </span>
                      <button
                        onClick={() => setClickedDate(null)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        전체 보기
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 divide-y divide-gray-100">
                  {loading ? (
                    <div className="p-8 text-center">
                      <div className="inline-flex items-center px-4 py-2 text-sm text-gray-500">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        일정을 불러오는 중...
                      </div>
                    </div>
                  ) : error ? (
                    <div className="p-8 text-center">
                      <div className="text-red-600 mb-4">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-sm">{error}</p>
                      </div>
                      <button
                        onClick={() => {
                          fetchCalendarData();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        다시 시도
                      </button>
                    </div>
                  ) : getSelectedDateAssignments().length === 0 && getSelectedDateTimeOffs().length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">
                        {clickedDate
                          ? `${clickedDate.getMonth() + 1}월 ${clickedDate.getDate()}일에 등록된 일정이 없습니다.`
                          : '등록된 일정이 없습니다.'
                        }
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* 근무 일정 */}
                      {getSelectedDateAssignments().map((item, index) => (
                        <div
                          key={`assignment-${index}`}
                          className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="mb-1">
                                <span className="font-semibold text-gray-800">출발지</span>
                                <span className="text-sm text-blue-700 ml-2">{item.work?.fromAddress}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-800">도착지</span>
                                <span className="text-sm text-blue-700 ml-2">{item.work?.toAddress}</span>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium">
                              근무
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="text-xs text-gray-500">{item.date}</div>
                            <button
                              onClick={() => router.push(`/staff/schedule/workdetail?estimateNo=${item.work?.estimateNo}&storeId=${item.work?.storeId}`)}
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                            >
                              상세보기
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* 휴무 일정 */}
                      {getSelectedDateTimeOffs().map((item, index) => (
                        <div key={`timeoff-${index}`} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                {item.date}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`px-2 py-1 rounded-md text-xs font-medium ${item.timeOff?.type === 'ANNUAL' ? 'bg-blue-50 text-blue-600' :
                                    item.timeOff?.type === 'HALF' ? 'bg-purple-50 text-purple-600' :
                                      item.timeOff?.type === 'SICK' ? 'bg-red-50 text-red-600' :
                                        'bg-gray-50 text-gray-600'
                                    }`}
                                >
                                  {item.timeOff?.type ? getTimeOffTypeKorean(item.timeOff.type) : '기타'}
                                </span>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium">
                              휴무
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
