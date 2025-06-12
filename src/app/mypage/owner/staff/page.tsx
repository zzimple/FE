"use client";

import React, { useEffect, useState } from "react";
import { authApi } from "@/lib/axios";
import TimeOffModal from '@/components/mypage/owner/staff/TimeOffModal';
import TimeOffSection from "@/components/mypage/owner/staff/TimeOffSection";
import PendingStaffSection from "@/components/mypage/owner/staff/PendingStaffSection";
import ApprovedStaffSection from "@/components/mypage/owner/staff/ApprovedStaffSection";

type Status = "APPROVED" | "PENDING" | "REJECTED";

type TimeOffType = "ANNUAL" | "HALF" | "SICK" | "ETC";

type Employee = {
  staffId: number;
  name: string;
  status: Status;
  id: string;
  phone: string;
};

type TimeOffRequest = {
  staffTimeOffId: number;
  staffName: string;
  startDate: string;
  endDate: string;
  type: TimeOffType;
  reason?: string;
  status: Status;
};

export default function EmployeeListPage() {
  // 활성 탭
  const [activeTab, setActiveTab] = useState<'staff' | 'timeoff'>('staff');
  // 직원 리스트
  const [approvedEmployees, setApprovedEmployees] = useState<Employee[]>([]);
  const [pendingEmployees, setPendingEmployees] = useState<Employee[]>([]);

  // 휴무 요청 전체
  const [timeoffRequests, setTimeoffRequests] = useState<TimeOffRequest[]>([]);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 모달 상태
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);

  useEffect(() => {
    fetchStaffList();
    fetchAllTimeoffRequests();
  }, []);

  // 가게 직원 리스트 불러오기 
  const fetchStaffList = async () => {
    try {
      const res = await authApi.get<{ data: Employee[] }>("/staff/list");
      const all = res.data.data;

      setApprovedEmployees(all.filter((e) => e.status === "APPROVED"));
      setPendingEmployees(all.filter((e) => e.status === "PENDING"));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("직원 리스트 불러오기 실패", err);
      setApprovedEmployees([]);
      setPendingEmployees([]);
    }
  };

  const fetchAllTimeoffRequests = async () => {
    try {
      const [pending, approved, rejected] = await Promise.all([
        authApi.get<{ data: TimeOffRequest[] }>("/staff/time-off/list/pending"),
        authApi.get<{ data: TimeOffRequest[] }>("/staff/time-off/list/approved"),
        authApi.get<{ data: TimeOffRequest[] }>("/staff/time-off/list/rejected"),
      ]);
      const combined = [
        ...pending.data.data,
        ...approved.data.data,
        ...rejected.data.data,
      ];
      setTimeoffRequests(combined);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("휴무 신청 목록 불러오기 실패", err);
      setTimeoffRequests([]);
    }
  };

  // 직원 승인 완료
  const handleApprove = async (staffId: number) => {
    setInfoMessage(null);
    setErrorMessage(null);

    const target = pendingEmployees.find((e) => e.staffId === staffId);
    if (!target) return;

    try {
      const res = await authApi.patch("/staff/approve", {
        staffId: target.staffId,
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

  // 직원 승인 거절
  const handleReject = async (staffId: number) => {
    setInfoMessage(null);
    setErrorMessage(null);

    const target = pendingEmployees.find((e) => e.staffId === staffId);
    if (!target) return;

    try {
      const res = await authApi.patch("/staff/approve", {
        staffId: target.staffId,
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

  // 휴무 신청 승인
  const handleTimeoffApprove = async (staffTimeOffId: number) => {
    setInfoMessage(null);
    setErrorMessage(null);

    try {
      const res = await authApi.patch(`/staff/time-off/decide/${staffTimeOffId}?status=APPROVED`);
      const serverMessage = res.data.message;
      setInfoMessage(serverMessage || "휴무 신청이 승인되었습니다.");

      setTimeoffRequests((prev) =>
        prev.map((req) =>
          req.staffTimeOffId === staffTimeOffId ? { ...req, status: "APPROVED" } : req
        )
      );
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const serverError = err.response?.data?.message;
      setErrorMessage(serverError || "휴무 승인 중 오류가 발생했습니다.");
    }
  };

  // 휴무 신청 거절
  const handleTimeoffReject = async (staffTimeOffId: number) => {
    setInfoMessage(null);
    setErrorMessage(null);
    try {
      const res = await authApi.patch(`/staff/time-off/decide/${staffTimeOffId}?status=REJECTED`);
      const serverMessage = res.data.message;
      setInfoMessage(serverMessage || "휴무 신청이 거절되었습니다.");

      setTimeoffRequests((prev) =>
        prev.map((req) =>
          req.staffTimeOffId === staffTimeOffId ? { ...req, status: "REJECTED" } : req
        )
      );
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
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
          <div className={`mb-6 p-4 rounded-lg text-sm ${errorMessage
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
            className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'staff'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            직원 관리
          </button>
          <button
            onClick={() => setActiveTab('timeoff')}
            className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'timeoff'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            휴무 신청
          </button>
        </div>

        {activeTab === 'staff' && (
          <>
            <ApprovedStaffSection employees={approvedEmployees} />
            <PendingStaffSection
              employees={pendingEmployees}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </>
        )}

        {activeTab === 'timeoff' && (
          <>
            <TimeOffSection
              status="PENDING"
              title="승인 대기 중"
              items={filterTimeoffByStatus('PENDING')}
              onApprove={handleTimeoffApprove}
              onReject={handleTimeoffReject}
              isOpen={showPendingModal}
              onOpen={() => setShowPendingModal(true)}
              onClose={() => setShowPendingModal(false)}
            />
            <TimeOffSection
              status="APPROVED"
              title="승인 완료"
              items={filterTimeoffByStatus('APPROVED')}
              onApprove={handleTimeoffApprove}
              onReject={handleTimeoffReject}
              isOpen={showApprovedModal}
              onOpen={() => setShowApprovedModal(true)}
              onClose={() => setShowApprovedModal(false)}
            />
            <TimeOffSection
              status="REJECTED"
              title="거절됨"
              items={filterTimeoffByStatus('REJECTED')}
              onApprove={handleTimeoffApprove}
              onReject={handleTimeoffReject}
              isOpen={showRejectedModal}
              onOpen={() => setShowRejectedModal(true)}
              onClose={() => setShowRejectedModal(false)}
            />

            {/* 모달들 */}
            <TimeOffModal
              isOpen={showPendingModal}
              onClose={() => setShowPendingModal(false)}
              requests={filterTimeoffByStatus('PENDING')}
              title="대기 중인 휴무 신청"
              onApprove={handleTimeoffApprove}
              onReject={handleTimeoffReject}
            />
            <TimeOffModal
              isOpen={showApprovedModal}
              onClose={() => setShowApprovedModal(false)}
              requests={filterTimeoffByStatus('APPROVED')}
              title="승인된 휴무 신청"
              onApprove={handleTimeoffApprove}
              onReject={handleTimeoffReject}
            />
            <TimeOffModal
              isOpen={showRejectedModal}
              onClose={() => setShowRejectedModal(false)}
              requests={filterTimeoffByStatus('REJECTED')}
              title="거절된 휴무 신청"
              onApprove={handleTimeoffApprove}
              onReject={handleTimeoffReject}
            />
          </>
        )}
      </div>
    </div>
  );
}