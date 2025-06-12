"use client";

import React from "react";

type Employee = {
  staffId: number;
  name: string;
  id: string;
  phone: string;
};

type Props = {
  employees: Employee[];
  onApprove: (staffId: number) => void;
  onReject: (staffId: number) => void;
};

export default function PendingStaffSection({ employees, onApprove, onReject }: Props) {
  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900 mb-4">승인 대기 중</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.length > 0 ? (
          employees.map((emp) => (
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
                  onClick={() => onApprove(emp.staffId)}
                  className="py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                  승인
                </button>
                <button
                  onClick={() => onReject(emp.staffId)}
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
  );
}
