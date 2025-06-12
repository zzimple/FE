// components/mypage/owner/staff/ApprovedStaffSection.tsx
import React from "react";

type Employee = {
  staffId: number;
  name: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  id: string;
  phone: string;
};

type Props = {
  employees: Employee[];
};

export default function ApprovedStaffSection({ employees }: Props) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-medium text-gray-900 mb-4">직원 목록</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.length > 0 ? (
          employees.map((emp) => (
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
              <p className="text-sm text-gray-600 mb-3">전화번호: {emp.phone}</p>
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
  );
}
