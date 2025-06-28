"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FiDownload, FiRefreshCw, FiTrendingUp, FiDollarSign, FiUsers } from "react-icons/fi";
import dayjs from "dayjs";
import { authApi } from "@/lib/axios";
import OwnerHeader from "@/components/headers/OwnerHeader";

interface MonthlyAverageData {
  month: string;
  average: number;
  items: Array<{
    id: number;
    date: string;
    customer: string;
    amount: number;
    status: string;
  }>;
}

interface WeeklySalesData {
  weekStartDate: string;
  totalAmount: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: MonthlyAverageData[];
}

interface WeeklyApiResponse {
  success: boolean;
  message: string;
  data: WeeklySalesData[];
}

export default function OwnerStorePage() {
  const [period, setPeriod] = useState("month");
  const [monthlyData, setMonthlyData] = useState<MonthlyAverageData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklySalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 월별 평균 매출 데이터 가져오기
  const fetchMonthlyData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.get<ApiResponse>('/owner/sales/monthly-average');
      
      if (response.data.success) {
        setMonthlyData(response.data.data);
        console.log('월별 평균 매출 데이터:', response.data.data);
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } catch (err: any) {
      console.error('월별 평균 매출 조회 실패:', err);
      setError('데이터 로딩 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 주별 매출 데이터 가져오기
  const fetchWeeklyData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.get<WeeklyApiResponse>('/owner/sales/weekly');
      
      if (response.data.success) {
        setWeeklyData(response.data.data);
        console.log('주별 매출 데이터:', response.data.data);
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } catch (err: any) {
      console.error('주별 매출 조회 실패:', err);
      setError('데이터 로딩 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 기간 변경 시 데이터 다시 가져오기
  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    if (newPeriod === "week") {
      fetchWeeklyData();
    } else {
      fetchMonthlyData();
    }
  };

  useEffect(() => {
    fetchMonthlyData(); // 초기 로딩 시 월별 데이터
  }, []);

  // 차트 데이터 변환 (기간에 따라 다르게)
  const salesChartData = period === "week" 
    ? weeklyData.slice(-4).map(item => ({
        date: `${dayjs(item.weekStartDate).format('MM-DD')}~${dayjs(item.weekStartDate).add(6, 'day').format('MM-DD')}`,
        sales: item.totalAmount,
        week: item.weekStartDate
      }))
    : monthlyData.map(item => ({
        date: dayjs(item.month).format('MM-DD'),
        sales: item.average,
        month: item.month
      }));

  // 상세 매출 내역 데이터 변환 (모든 월의 items를 합침)
  const salesTableData = monthlyData.flatMap(monthData => 
    monthData.items.map(item => ({
      id: item.id,
      date: item.date,
      customer: item.customer,
      amount: item.amount,
      status: item.status === 'CONFIRMED' ? '완료' : '진행중'
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 최신순 정렬

  // 통계 계산
  const totalSales = salesTableData.reduce((sum, item) => sum + item.amount, 0);
  const totalCount = salesTableData.length;
  const averageSales = totalCount > 0 ? Math.round(totalSales / totalCount) : 0;
  const completedCount = salesTableData.filter(item => item.status === '완료').length;


  return (
    <div className="min-h-screen bg-gray-50">
      <OwnerHeader />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">매출 관리</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => period === "week" ? fetchWeeklyData() : fetchMonthlyData()}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                새로고침
              </button>
            </div>
          </div>

          {/* 통계 정보 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <FiDollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{totalSales.toLocaleString()}원</div>
                <div className="text-sm text-gray-500">총 매출</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <FiUsers className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{totalCount}건</div>
                <div className="text-sm text-gray-500">총 거래 건수</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <FiTrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600">{averageSales.toLocaleString()}원</div>
                <div className="text-sm text-gray-500">평균 거래 금액</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">{completedCount}건</div>
                <div className="text-sm text-gray-500">완료된 거래</div>
              </div>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 매출 그래프 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {period === "week" ? "주별 평균 매출 추이" : "월별 평균 매출 추이"}
            </h2>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  period === "week"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                onClick={() => handlePeriodChange("week")}
              >
                1주일
              </button>
              <button
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  period === "month"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                onClick={() => handlePeriodChange("month")}
              >
                1개월
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-sm text-gray-500">데이터를 불러오는 중...</p>
              </div>
            </div>
          ) : salesChartData.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiTrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">매출 데이터가 없습니다</h3>
                <p className="text-gray-500 text-sm">매출 데이터가 여기에 표시됩니다.</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={salesChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(v) => `${(v / 10000).toFixed(0)}만`}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(v) => [`${v.toLocaleString()}원`, period === "week" ? '주별 평균 매출' : '평균 매출']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return period === "week" ? payload[0].payload.week : payload[0].payload.month;
                    }
                    return label;
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  name={period === "week" ? "주별 평균 매출" : "평균 매출"}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 상세 매출 내역 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">상세 매출 내역</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {monthlyData.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiDollarSign className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">매출 내역이 없습니다</h3>
                <p className="text-gray-500 text-sm">매출 내역이 여기에 표시됩니다.</p>
              </div>
            ) : (
              monthlyData.map((monthData) => {
                const monthItems = monthData.items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                const monthTotal = monthItems.reduce((sum, item) => sum + item.amount, 0);
                const monthCompletedCount = monthItems.filter(item => item.status === 'CONFIRMED').length;
                
                return (
                  <div key={monthData.month} className="p-6">
                    {/* 월별 헤더 */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {dayjs(monthData.month).format('YYYY년 MM월')}
                        </h3>
                        <p className="text-sm text-gray-500">
                          평균 매출: {monthData.average.toLocaleString()}원
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {monthTotal.toLocaleString()}원
                        </div>
                        <div className="text-sm text-gray-500">
                          {monthItems.length}건 ({monthCompletedCount}건 완료)
                        </div>
                      </div>
                    </div>

                    {/* 월별 거래 내역 테이블 */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              날짜
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              고객명
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              금액
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              상태
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {monthItems.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                이번 달 거래 내역이 없습니다.
                              </td>
                            </tr>
                          ) : (
                            monthItems.map((item) => (
                              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {dayjs(item.date).format('MM-DD')}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.customer}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">
                                  {item.amount.toLocaleString()}원
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                      item.status === "CONFIRMED"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {item.status === "CONFIRMED" ? "완료" : "진행중"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
