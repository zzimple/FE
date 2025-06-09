"use client";

import React from "react";

const employees = [
  { name: "조연제", status: "승인 대기 중", id: "test01", phone: "010-0000-0000" },
  { name: "조연제", status: "승인 대기 중", id: "test01", phone: "010-0000-0000" },
  { name: "조연제", status: "승인 대기 중", id: "test01", phone: "010-0000-0000" },
];

const pendingEmployees = [
  { name: "조연제", status: "승인 대기 중", id: "test01", phone: "010-0000-0000" },
];

export default function EmployeeListPage() {
  return (
    <div className="min-h-screen bg-white px-4 py-6 max-w-md mx-auto">
      <h1 className="text-center text-xl font-bold mb-6">직원 목록</h1>

      {/* 우리 직원 */}
      <section className="mb-8">
        <h2 className="text-base font-semibold mb-4">우리 직원</h2>
        <div className="flex flex-wrap gap-4">
          {employees.map((emp, idx) => (
            <div
              key={idx}
              className="flex w-[176px] flex-col p-4 items-start gap-2 rounded-2xl bg-gradient-to-b from-blue-500 to-gray-200 text-white"
            >
              <p className="font-semibold">
                {emp.name} <span className="text-lime-300">{emp.status}</span>
              </p>
              <p className="text-sm">📍 아이디 : {emp.id}</p>
              <p className="text-sm">📞 {emp.phone}</p>
              <button className="mt-2 px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-600">
                스케줄 보기
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 승인 대기 */}
      <section>
        <h2 className="text-base font-semibold mb-4">직원 승인 대기중</h2>
        <div className="flex flex-wrap gap-4">
          {pendingEmployees.map((emp, idx) => (
            <div
              key={idx}
              className="flex w-[176px] flex-col p-4 items-start gap-2 rounded-2xl bg-gradient-to-b from-blue-500 to-gray-200 text-white"
            >
              <p className="font-semibold">
                {emp.name} <span className="text-lime-300">{emp.status}</span>
              </p>
              <p className="text-sm">📍 아이디 : {emp.id}</p>
              <p className="text-sm">📞 {emp.phone}</p>
              <button className="mt-2 px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-600">
                스케줄 보기
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
