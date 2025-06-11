"use client";

import React, { useEffect, useState } from "react";
import { authApi } from "@/lib/axios";

type Status = "APPROVED" | "PENDING" | "REJECTED";

type Employee = {
  staffId: number;
  userId: number;
  name: string;
  status: Status;
  id: string;
  phone: string;
};

type TimeOffRequest = {
  requestId: number;
  staffId: number;
  staffName: string;
  startDate: string;
  endDate: string;
  type: string;
  reason?: string;
  status: Status;
};

const statusToLabel: Record<Status, string> = {
  APPROVED: "승인 완료",
  PENDING: "승인 대기 중",
  REJECTED: "거절됨",
};

// 예시 데이터
const MOCK_TIMEOFF_REQUESTS: TimeOffRequest[] = [
  {
    requestId: 1,
    staffId: 1,
    staffName: "김직원",
    startDate: "2024-03-20",
    endDate: "2024-03-20",
    type: "연차",
    status: "PENDING"
  },
  {
    requestId: 2,
    staffId: 2,
    staffName: "이사원",
    startDate: "2024-03-25",
    endDate: "2024-03-26",
    type: "연차",
    reason: "개인 사유",
    status: "APPROVED"
  },
  {
    requestId: 3,
    staffId: 3,
    staffName: "박팀원",
    startDate: "2024-03-22",
    endDate: "2024-03-22",
    type: "반차",
    reason: "병원 진료",
    status: "PENDING"
  },
  {
    requestId: 4,
    staffId: 4,
    staffName: "최대리",
    startDate: "2024-03-21",
    endDate: "2024-03-21",
    type: "병가",
    reason: "감기 증상",
    status: "REJECTED"
  }
];

export default function EmployeeListPage() {
  const [activeTab, setActiveTab] = useState<'staff' | 'timeoff'>('staff');
  const [approvedEmployees, setApprovedEmployees] = useState<Employee[]>([]);
  const [pendingEmployees, setPendingEmployees] = useState<Employee[]>([]);
  const [timeoffRequests, setTimeoffRequests] = useState<TimeOffRequest[]>([]);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        const res = await authApi.get("/staff/list");
        const all: Employee[] = res.data.data;

        setApprovedEmployees(all.filter((e) => e.status === "APPROVED"));
        setPendingEmployees(all.filter((e) => e.status === "PENDING"));
      } catch (err) {
        console.error("직원 리스트 불러오기 실패", err);
        // 에러 시 빈 배열로 설정
        setApprovedEmployees([]);
        setPendingEmployees([]);
      }
    };

    const fetchTimeoffRequests = async () => {
      try {
        // 실제 API 호출 대신 목업 데이터 사용
        setTimeoffRequests(MOCK_TIMEOFF_REQUESTS);
      } catch (err) {
        console.error("휴무 신청 목록 불러오기 실패", err);
        setTimeoffRequests([]);
      }
    };

    fetchStaffList();
    fetchTimeoffRequests();
  }, []);

  const handleApprove = async (staffId: number) => {
    setInfoMessage(null);
    setErrorMessage(null);

    const target = pendingEmployees.find((e) => e.staffId === staffId);
    if (!target) return;

    try {
      const res = await authApi.patch("/staff/approve", {
        userId: target.userId,
        status: "APPROVED",
      });

      const returnedStatus: Status = res.data.data.status;
      const serverMessage = res.data.message;
      setInfoMessage(serverMessage || "직원 승인이 완료되었습니다.");

      setApprovedEmployees((prev) => [...prev, { ...target, status: returnedStatus }]);
      setPendingEmployees((prev) => prev.filter((e) => e.staffId !== staffId));
    } catch (err: any) {
      const serverError = err.response?.data?.message;
      setErrorMessage(serverError || "승인 요청 중 오류가 발생했습니다.");
    }
  };

  const handleReject = async (staffId: number) => {
    setInfoMessage(null);
    setErrorMessage(null);

    const target = pendingEmployees.find((e) => e.staffId === staffId);
    if (!target) return;

    try {
      const res = await authApi.patch("/staff/approve", {
        userId: target.userId,
        status: "REJECTED",
      });

      const serverMessage = res.data.message;
      setInfoMessage(serverMessage || "직원 거절이 완료되었습니다.");

      setPendingEmployees((prev) => prev.filter((e) => e.staffId !== staffId));
    } catch (err: any) {
      const serverError = err.response?.data?.message;
      setErrorMessage(serverError || "거절 요청 중 오류가 발생했습니다.");
    }
  };

  const handleTimeoffApprove = async (requestId: number) => {
    setInfoMessage(null);
    setErrorMessage(null);

    try {
      const res = await authApi.patch("/timeoff/approve", {
        requestId,
        status: "APPROVED",
      });

      const serverMessage = res.data.message;
      setInfoMessage(serverMessage || "휴무 신청이 승인되었습니다.");

      setTimeoffRequests((prev) =>
        prev.map((req) =>
          req.requestId === requestId ? { ...req, status: "APPROVED" } : req
        )
      );
    } catch (err: any) {
      const serverError = err.response?.data?.message;
      setErrorMessage(serverError || "휴무 승인 중 오류가 발생했습니다.");
    }
  };

  const handleTimeoffReject = async (requestId: number) => {
    setInfoMessage(null);
    setErrorMessage(null);

    try {
      const res = await authApi.patch("/timeoff/approve", {
        requestId,
        status: "REJECTED",
      });

      const serverMessage = res.data.message;
      setInfoMessage(serverMessage || "휴무 신청이 거절되었습니다.");

      setTimeoffRequests((prev) =>
        prev.map((req) =>
          req.requestId === requestId ? { ...req, status: "REJECTED" } : req
        )
      );
    } catch (err: any) {
      const serverError = err.response?.data?.message;
      setErrorMessage(serverError || "휴무 거절 중 오류가 발생했습니다.");
    }
  };

  // 휴무 신청을 상태별로 필터링하는 함수
  const filterTimeoffByStatus = (status: Status) => {
    return timeoffRequests.filter((request) => request.status === status);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 성공/에러 메시지 */}
        {(errorMessage || infoMessage) && (
          <div className={`mb-6 p-4 rounded-lg text-sm ${
            errorMessage 
              ? 'bg-red-50 text-red-500 border border-red-100' 
              : 'bg-blue-50 text-blue-600 border border-blue-100'
          }`}>
            {errorMessage || infoMessage}
          </div>
        )}

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1.5 mb-6 inline-flex">
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'staff'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            직원 관리
          </button>
          <button
            onClick={() => setActiveTab('timeoff')}
            className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'timeoff'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            휴무 신청
          </button>
        </div>

        {activeTab === 'staff' ? (
          <>
            {/* 우리 직원 */}
            <section className="mb-10">
              <h2 className="text-lg font-medium text-gray-900 mb-4">우리 직원</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedEmployees.length > 0 ? (
                  approvedEmployees.map((emp) => (
                    <div
                      key={emp.staffId}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-medium">
                          {emp.name[0]}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{emp.name}</h3>
                          <p className="text-sm text-gray-500">{emp.id}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{emp.phone}</p>
                      <button className="w-full py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                        스케줄 보기
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 col-span-full">
                    아직 승인된 직원이 없습니다.
                  </p>
                )}
              </div>
            </section>

            {/* 승인 대기 직원 */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">승인 대기 중</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingEmployees.length > 0 ? (
                  pendingEmployees.map((emp) => (
                    <div
                      key={emp.staffId}
                      className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
                            {emp.name[0]}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{emp.name}</h3>
                            <p className="text-sm text-gray-500">{emp.id}</p>
                          </div>
                        </div>
                        <span className="text-sm text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                          대기중
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{emp.phone}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleApprove(emp.staffId)}
                          className="py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => handleReject(emp.staffId)}
                          className="py-2 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                        >
                          거절
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 col-span-full">
                    대기 중인 직원이 없습니다.
                  </p>
                )}
              </div>
            </section>
          </>
        ) : (
          /* 휴무 신청 관리 */
          <div className="space-y-8">
            {/* 승인 대기 중 */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">승인 대기 중</h2>
                <span className="text-sm px-2.5 py-1 rounded bg-blue-50 text-blue-600">
                  {filterTimeoffByStatus('PENDING').length}건
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterTimeoffByStatus('PENDING').map((request) => (
                  <div
                    key={request.requestId}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-medium">
                          {request.staffName[0]}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{request.staffName}</h3>
                          <p className="text-sm text-gray-500">{request.type}</p>
                        </div>
                      </div>
                      <span className="text-sm px-2.5 py-1 rounded bg-blue-50 text-blue-600">
                        대기중
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {request.startDate}
                        {request.startDate !== request.endDate && ` ~ ${request.endDate}`}
                      </div>
                      {request.reason && (
                        <div className="flex items-start text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {request.reason}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleTimeoffApprove(request.requestId)}
                        className="py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleTimeoffReject(request.requestId)}
                        className="py-2 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                      >
                        거절
                      </button>
                    </div>
                  </div>
                ))}
                {filterTimeoffByStatus('PENDING').length === 0 && (
                  <p className="text-sm text-gray-500 col-span-full">
                    대기 중인 휴무 신청이 없습니다.
                  </p>
                )}
              </div>
            </section>

            {/* 승인 완료 */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">승인 완료</h2>
                <span className="text-sm px-2.5 py-1 rounded bg-green-50 text-green-600">
                  {filterTimeoffByStatus('APPROVED').length}건
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterTimeoffByStatus('APPROVED').map((request) => (
                  <div
                    key={request.requestId}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-medium">
                          {request.staffName[0]}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{request.staffName}</h3>
                          <p className="text-sm text-gray-500">{request.type}</p>
                        </div>
                      </div>
                      <span className="text-sm px-2.5 py-1 rounded bg-green-50 text-green-600">
                        승인 완료
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {request.startDate}
                        {request.startDate !== request.endDate && ` ~ ${request.endDate}`}
                      </div>
                      {request.reason && (
                        <div className="flex items-start text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {request.reason}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filterTimeoffByStatus('APPROVED').length === 0 && (
                  <p className="text-sm text-gray-500 col-span-full">
                    승인된 휴무 신청이 없습니다.
                  </p>
                )}
              </div>
            </section>

            {/* 거절됨 */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">거절됨</h2>
                <span className="text-sm px-2.5 py-1 rounded bg-red-50 text-red-600">
                  {filterTimeoffByStatus('REJECTED').length}건
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterTimeoffByStatus('REJECTED').map((request) => (
                  <div
                    key={request.requestId}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-medium">
                          {request.staffName[0]}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{request.staffName}</h3>
                          <p className="text-sm text-gray-500">{request.type}</p>
                        </div>
                      </div>
                      <span className="text-sm px-2.5 py-1 rounded bg-red-50 text-red-600">
                        거절됨
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {request.startDate}
                        {request.startDate !== request.endDate && ` ~ ${request.endDate}`}
                      </div>
                      {request.reason && (
                        <div className="flex items-start text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {request.reason}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filterTimeoffByStatus('REJECTED').length === 0 && (
                  <p className="text-sm text-gray-500 col-span-full">
                    거절된 휴무 신청이 없습니다.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
