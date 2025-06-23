"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import GuestHeader from "@/components/headers/GuestHeader";
import { useRouter } from "next/navigation";
import { authApi, getAccessTokenFromCookie } from "@/lib/axios";

interface Estimate {
  estimateNo: number;
  storeName: string;
  truckCount: number;
  totalPrice: number;
}

interface EstimateResponse {
  content: Estimate[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export default function ReceivedEstimatesPage() {
  const router = useRouter();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectedEstimates, setRejectedEstimates] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  const checkLogin = () => {
    const token = getAccessTokenFromCookie();
    if (!token) {
      setError("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      setTimeout(() => router.push("/login"), 2000);
      return false;
    }
    return true;
  };

  const fetchEstimates = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!checkLogin()) return;

      const response = await authApi.get("/guest/my/estimate/list", {
        params: {
          page: page - 1,
          size: pageSize
        },
      });

      if (response.data.success) {
        const data: EstimateResponse = response.data.data;
        setEstimates(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } else {
        setError("견적서 목록을 불러오는데 실패했습니다.");
      }
    } catch (err: any) {
      console.error("견적서 목록 조회 실패:", err);

      if (err.response?.status === 401) {
        setError("인증이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        setError("견적서 목록을 불러오는데 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchEstimates(page);
  };

  useEffect(() => {
    fetchEstimates(currentPage);

    const rejected = JSON.parse(
      localStorage.getItem("rejectedEstimates") || "[]"
    );
    setRejectedEstimates(rejected);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <GuestHeader />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              받은 견적서
            </h1>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              {/* 수정 3: 설명 텍스트를 왼쪽으로, AI 버튼을 오른쪽으로 */}
              <div className="text-left">
                <p className="text-gray-600 text-sm">
                  어떤 업체를 선택해야 할지 고민된다면? AI에게 견적서 비교 요청을 해보세요!
                </p>
              </div>
              <Button
                className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium"
                onClick={() => router.push(`/estimate/gpt`)}
              >
                AI 견적서 비교
              </Button>
            </div>
          </div>

          {/* 통계 */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>총 {totalElements}개의 견적서</span>
              <span>{currentPage} / {totalPages} 페이지</span>
            </div>
          </div>

          {/* 로딩 */}
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-sm p-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600">견적서를 불러오는 중입니다...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-sm p-12">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                {error.includes("로그인") && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    onClick={() => router.push("/login")}
                  >
                    로그인하기
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* 견적서 목록 */}
              <div className="space-y-4">
                {estimates.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-12">
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">받은 견적서가 없습니다</p>
                      <p className="text-sm text-gray-500">새로운 견적서가 도착하면 여기에 표시됩니다</p>
                    </div>
                  </div>
                ) : (
                  estimates
                    .filter(estimate => !rejectedEstimates.includes(estimate.estimateNo))
                    .map((estimate) => (
                      <div
                        key={estimate.estimateNo}
                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl font-bold text-gray-900">
                                {estimate.storeName}
                              </h3>
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                #{estimate.estimateNo}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">견적가</p>
                                <p className="text-lg font-bold text-blue-600">
                                  {estimate.totalPrice.toLocaleString()}원
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">트럭 수</p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {estimate.truckCount}대
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">상태</p>
                                {/* 수정 1: 검토 대기 배경을 글씨에 맞춤 */}
                                <span className="inline-block text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                  검토 대기
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              className="w-full sm:w-32 bg-blue-500 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium"
                              onClick={() => {
                                router.push(`/guest/estimate/received/detail?estimateNo=${estimate.estimateNo}`);
                              }}
                            >
                              상세보기
                            </Button>
                            {/* 수정 2: 거절 버튼을 더 눈에 띄게 변경 */}
                            {/* <Button
                              className="w-full sm:w-24 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                              onClick={() => {
                                const rejected = JSON.parse(
                                  localStorage.getItem("rejectedEstimates") || "[]"
                                );
                                if (!rejected.includes(estimate.estimateNo)) {
                                  rejected.push(estimate.estimateNo);
                                  localStorage.setItem("rejectedEstimates", JSON.stringify(rejected));
                                  setRejectedEstimates(rejected);
                                }
                              }}
                            >
                              거절
                            </Button> */}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}