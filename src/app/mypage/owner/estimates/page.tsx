"use client";

import React from "react";
import { useRouter } from "next/navigation";

const employees = [
  { name: "김채린", status: "신규 견적서", id: "test01", phone: "010-0000-0000" },
];

export default function EmployeeListPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white px-4 py-6 max-w-md mx-auto">
      <h1 className="text-center text-xl font-bold mb-6">견적서</h1>

      {/* 견적서 */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-4">
          {employees.map((emp, idx) => (
            <div
              key={idx}
              className="flex w-[176px] flex-col p-4 items-start gap-2 rounded-2xl bg-gradient-to-b from-blue-500 to-gray-200 text-white"
            >
              <p className="font-semibold">
                {emp.name} <span className="text-lime-300">{emp.status}</span>
              </p>
              <p className="text-sm">📍출발: 서울 강북구</p>
              <p className="text-sm">📍도착: 서울 강남구</p>
              <button
                className="mt-2 px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-600"
                onClick={() => router.push(`/mypage/owner/estimates/${emp.id}`)}
              >
                상세보기
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
