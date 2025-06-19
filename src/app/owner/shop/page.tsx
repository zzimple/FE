"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FiDownload } from "react-icons/fi";
import dayjs from "dayjs";

// Mock Data
const summary = {
  today: { sales: 320000, count: 2, avg: 160000 },
  month: { sales: 5400000, count: 32, avg: 168750 },
};
const salesChartData = [
  { date: "05-01", sales: 400000 },
  { date: "05-02", sales: 350000 },
  { date: "05-03", sales: 200000 },
  { date: "05-04", sales: 500000 },
  { date: "05-05", sales: 600000 },
  { date: "05-06", sales: 700000 },
  { date: "05-07", sales: 800000 },
];
const salesTableData = [
  {
    id: 1,
    date: "2025-05-07",
    customer: "홍길동",
    amount: 400000,
    status: "완료",
  },
  {
    id: 2,
    date: "2025-05-07",
    customer: "김철수",
    amount: 320000,
    status: "완료",
  },
  {
    id: 3,
    date: "2025-05-06",
    customer: "이영희",
    amount: 700000,
    status: "진행중",
  },
  {
    id: 4,
    date: "2025-05-05",
    customer: "박민수",
    amount: 600000,
    status: "완료",
  },
];

export default function OwnerStorePage() {
  const [period, setPeriod] = useState("week");
  const [dateRange, setDateRange] = useState({
    from: dayjs().subtract(6, "day"),
    to: dayjs(),
  });

  // 엑셀 다운로드 (Mock)
  const handleDownload = () => {
    alert("엑셀 다운로드 기능은 추후 제공됩니다.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-2 py-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">매출 관리</h1>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">오늘 매출</span>
          <span className="text-lg font-bold text-blue-600">
            {summary.today.sales.toLocaleString()}원
          </span>
          <span className="text-xs text-gray-400 mt-1">
            {summary.today.count}건 · 평균 {summary.today.avg.toLocaleString()}
            원
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">이번 달 매출</span>
          <span className="text-lg font-bold text-pink-600">
            {summary.month.sales.toLocaleString()}원
          </span>
          <span className="text-xs text-gray-400 mt-1">
            {summary.month.count}건 · 평균 {summary.month.avg.toLocaleString()}
            원
          </span>
        </div>
      </div>

      {/* 매출 그래프 + 기간 필터 */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-gray-700">최근 매출 추이</span>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                period === "week"
                  ? "bg-blue-100 text-blue-600 border-blue-300"
                  : "bg-gray-100 text-gray-500 border-gray-200"
              }`}
              onClick={() => setPeriod("week")}
            >
              1주일
            </button>
            <button
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                period === "month"
                  ? "bg-blue-100 text-blue-600 border-blue-300"
                  : "bg-gray-100 text-gray-500 border-gray-200"
              }`}
              onClick={() => setPeriod("month")}
            >
              1개월
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={salesChartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`} />
            <Tooltip formatter={(v) => `${v.toLocaleString()}원`} />
            <Bar dataKey="sales" fill="#60a5fa" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 상세 매출 내역 */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-gray-700">상세 매출 내역</span>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium"
          >
            <FiDownload className="w-4 h-4" /> 엑셀 다운로드
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-2 font-semibold text-gray-600">날짜</th>
                <th className="px-2 py-2 font-semibold text-gray-600">
                  고객명
                </th>
                <th className="px-2 py-2 font-semibold text-gray-600">금액</th>
                <th className="px-2 py-2 font-semibold text-gray-600">상태</th>
              </tr>
            </thead>
            <tbody>
              {salesTableData.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0">
                  <td className="px-2 py-2 whitespace-nowrap">{row.date}</td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    {row.customer}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    {row.amount.toLocaleString()}원
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        row.status === "완료"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
