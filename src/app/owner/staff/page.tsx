"use client";

import React, { useEffect, useState } from "react";
import { authApi } from "@/lib/axios";
import { useRouter } from "next/navigation";
import OwnerHeader from "@/components/headers/OwnerHeader";
import TimeOffModal from '@/components/mypage/owner/staff/TimeOffModal';
import TimeOffSection from "@/components/mypage/owner/staff/TimeOffSection";
import PendingStaffSection from "@/components/mypage/owner/staff/PendingStaffSection";
import ApprovedStaffSection from "@/components/mypage/owner/staff/ApprovedStaffSection";
import UnauthorizedPage from "@/components/common/UnauthorizedPage";

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
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // owner 권한 확인
  useEffect(() => {
    const checkOwnerAccess = async () => {
      try {
        const res = await authApi.get("/owner/profile");
        if (res.data.success) {
          setHasAccess(true);
          setIsLoading(false);
        } else {
          setHasAccess(false);
          setIsLoading(false);
        }
      } catch (e: any) {
        console.error("Owner 권한 확인 실패", e);
        
        // 401 에러인 경우 로그인 페이지로 리다이렉트
        if (e.response?.status === 401) {
          window.location.href = "/login";
          return;
        }
        
        // 403 에러인 경우 권한 없음
        if (e.response?.status === 403) {
          setErrorMessage("사장님 계정으로 로그인해주세요.");
        }
        
        setHasAccess(false);
        setIsLoading(false);
      }
    };

    checkOwnerAccess();
  }, []);

  // 권한이 확인된 후에만 데이터 로드
  useEffect(() => {
    if (hasAccess === true) {
      fetchStaffList();
      fetchAllTimeoffRequests();
    }
  }, [hasAccess]);

  // 가게 직원 리스트 불러오기 
  const fetchStaffList = async () => {
    try {
      const res = await authApi.get<{ data: Employee[] }>("/staff/list");
      const all = res.data.data;

      setApprovedEmployees(all.filter((e) => e.status === "APPROVED"));
      setPendingEmployees(all.filter((e) => e.status === "PENDING"));
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      console.error("직원 리스트 불러오기 실패", err);
      setApprovedEmployees([]);
      setPendingEmployees([]);
      
      // 401 에러인 경우 로그인 페이지로 리다이렉트
      if (err.response?.status === 401) {
        window.location.href = "/login";
        return;
      }
      
      // 403 에러인 경우 권한 문제로 처리
      if (err.response?.status === 403) {
        setErrorMessage("직원 관리 권한이 없습니다. 사장님 계정으로 로그인해주세요.");
      }
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
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      console.error("휴무 신청 목록 불러오기 실패", err);
      setTimeoffRequests([]);
      
      // 401 에러인 경우 로그인 페이지로 리다이렉트
      if (err.response?.status === 401) {
        window.location.href = "/login";
        return;
      }
      
      // 403 에러인 경우 권한 문제로 처리
      if (err.response?.status === 403) {
        setErrorMessage("휴무 관리 권한이 없습니다. 사장님 계정으로 로그인해주세요.");
      }
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
      // 401 에러인 경우 로그인 페이지로 리다이렉트
      if (err.response?.status === 401) {
        window.location.href = "/login";
        return;
      }
      
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
      // 401 에러인 경우 로그인 페이지로 리다이렉트
      if (err.response?.status === 401) {
        window.location.href = "/login";
        return;
      }
      
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
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      
      // 401 에러인 경우 로그인 페이지로 리다이렉트
      if (err.response?.status === 401) {
        window.location.href = "/login";
        return;
      }
      
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
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      
      // 401 에러인 경우 로그인 페이지로 리다이렉트
      if (err.response?.status === 401) {
        window.location.href = "/login";
        return;
      }
      
      const serverError = err.response?.data?.message;
      setErrorMessage(serverError || "휴무 거절 중 오류가 발생했습니다.");
    }
  };

  // 휴무 신청을 상태별로 필터링하는 함수
  const filterTimeoffByStatus = (status: Status) => {
    return timeoffRequests.filter((request) => request.status === status);
  };

  // 로딩 중인 경우 로딩 표시
  if (isLoading) {
    return <div className="text-center mt-20 text-gray-500">로딩 중...</div>;
  }

  // 권한 없는 경우
  if (hasAccess === false) {
    return <UnauthorizedPage />;
  }

  return (
    <div className="min-h-screen bg-white">
      <OwnerHeader />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
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