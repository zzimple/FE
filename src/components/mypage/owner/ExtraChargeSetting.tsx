"use client";

import React from "react";

interface Charges {
  perTruckCharge: number;
  holidayCharge: number;
  goodDayCharge: number;
  weekendCharge: number;
}

interface ExtraChargeSettingProps {
  charges: Charges;
  editing: boolean;
  onChange: (field: keyof Charges, value: string) => void;
  onEditToggle: () => void;
}

const formatNumber = (value: number) => value.toLocaleString("ko-KR");

export default function ExtraChargeSetting({
  charges,
  editing,
  onChange,
  onEditToggle
}: ExtraChargeSettingProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium">
          추가금 설정
        </label>
        <button
          type="button"
          onClick={onEditToggle}
          className="text-xs text-[#2948FF] hover:text-blue-700 transition-colors"
        >
          <p className="pr-4.5">{editing ? "저장" : "변경하기"}</p>
        </button>
      </div>

      <div className="space-y-3">
        {[
          { label: "트럭 1대당", field: "perTruckCharge" },
          { label: "공휴일", field: "holidayCharge" },
          { label: "손 없는 날", field: "goodDayCharge" },
          { label: "주말", field: "weekendCharge" }
        ].map(({ label, field }) => (
          <div
            key={field}
            className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${
              editing ? "bg-white border border-[#2948FF]" : "bg-gray-50"
            }`}
          >
            <span className="text-sm text-gray-600">{label}</span>
            <input
              type="text"
              value={formatNumber(charges[field as keyof Charges]) + "원"}
              onChange={(e) => onChange(field as keyof Charges, e.target.value)}
              disabled={!editing}
              className={`text-right text-sm w-24 outline-none ${
                editing
                  ? "bg-white text-[#2948FF] font-medium"
                  : "bg-transparent text-gray-900"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
