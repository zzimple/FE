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

const statusToLabel: Record<Status, string> = {
  APPROVED: "승인 완료",
  PENDING: "승인 대기 중",
  REJECTED: "거절됨",
};

export default function EmployeeListPage() {
  const [approvedEmployees, setApprovedEmployees] = useState<Employee[]>([]);
  const [pendingEmployees, setPendingEmployees] = useState<Employee[]>([]);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        const res = await authApi.get("/staff/list");
        const all: Employee[] = res.data.data;

        setApprovedEmployees(all.filter((e) => e.status === "APPROVED"));
        setPendingEmployees(all.filter((e) => e.status === "PENDING"));
      } catch (err) {
        console.error("직원 리스트 불러오기 실패", err);
      }
    };

    fetchStaffList();
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

  return (
    <div className="max-w-md mx-auto pt-3">
      {/* 성공/에러 메시지 */}
      {(errorMessage || infoMessage) && (
        <div className={`mb-6 p-4 rounded-xl text-sm ${
          errorMessage 
            ? 'bg-red-50 text-red-500 border border-red-100' 
            : 'bg-[#F5F8FF] text-[#2948FF] border border-[#E5EBFF]'
        }`}>
          {errorMessage || infoMessage}
        </div>
      )}

      {/* 우리 직원 */}
      <section className="mb-8">
        <h2 className="text-base font-semibold mb-4">우리 직원</h2>
        <div className="grid grid-cols-2 gap-4">
          {approvedEmployees.length > 0 ? (
            approvedEmployees.map((emp) => (
              <div
                key={emp.staffId}
                className="flex flex-col p-4 items-start gap-2 rounded-2xl bg-[#F5F8FF]"
              >
                <p className="font-semibold text-sm">
                  {emp.name}
                  <span className="text-[#2948FF] ml-15">
                    {/* {statusToLabel[emp.status]} */}
                  </span>
                </p>
                <p className="text-sm text-gray-600">아이디: {emp.id}</p>
                <p className="text-sm text-gray-600">전화번호: {emp.phone}</p>
                <div className="flex items-center gap-1 mt-1">
                  <button className="text-xs text-[#2948FF] hover:underline">
                    스케줄 보기
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 col-span-2">
              아직 승인된 직원이 없습니다.
            </p>
          )}
        </div>
      </section>

      {/* 승인 대기 직원 */}
      <section>
        <h2 className="text-base font-semibold mb-4">
          직원 승인 대기 목록
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {pendingEmployees.length > 0 ? (
            pendingEmployees.map((emp) => (
              <div
                key={emp.staffId}
                className="flex flex-col p-4 items-start gap-2 rounded-2xl bg-[#F5F8FF]"
              >
                <p className="font-semibold text-sm">
                  {emp.name}{" "}
                  <span className="text-[#2948FF] ml-14">
                    {statusToLabel[emp.status]}
                  </span>
                </p>
                <p className="text-sm text-gray-600">아이디: {emp.id}</p>
                <p className="text-sm text-gray-600">전화번호: {emp.phone}</p>
                <div className="flex gap-2 mt-2 w-full">
                  <button
                    onClick={() => handleApprove(emp.staffId)}
                    className="flex-1 py-1.5 text-xs rounded-full bg-white text-[#2948FF] border border-[#2948FF]"
                  >
                    수락
                  </button>
                  <button
                    onClick={() => handleReject(emp.staffId)}
                    className="flex-1 py-1.5 text-xs rounded-full bg-white text-red-500 border border-red-500"
                  >
                    거절
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 col-span-2">
              대기 중인 직원이 없습니다.
            </p>
          )}
        </div>
      </section>
    </div>
  );
} 