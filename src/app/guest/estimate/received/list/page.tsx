"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import GuestHeader from "@/components/headers/GuestHeader";
import { useRouter } from "next/navigation";
import { authApi, getAccessTokenFromCookie } from "@/lib/axios";
import { formatMoveDate } from "@/lib/utils/formatMoveDate"; // ✅ 헬퍼 import

// ✅ API 응답 구조에 맞는 타입 정의
interface Estimate {
  estimateNo: number;
  moveDate: string;
  fromAddr: string;
  toAddr: string;
  createdAt: string;
  responseCount: number;
}

interface EstimateListResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    estimates: Estimate[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export default function MyEstimatesListPage() {
  const router = useRouter();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      // ✅ 새로운 엔드포인트 사용
      const response = await authApi.get<EstimateListResponse>("/guest/my/all/list/estimates", {
        params: {
          page: page - 1,
          size: pageSize
        },
      });

      if (response.data.success) {
        const data = response.data.data;
        setEstimates(data.estimates || []);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchEstimates(currentPage);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <GuestHeader />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              내가 작성한 견적서
            </h1>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="text-left">
                <p className="text-gray-600 text-sm">
                  작성한 견적서 목록을 확인하고 응답을 받아보세요!
                </p>
              </div>
              <Button
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                onClick={() => router.push("/guest/estimate/step1")}
              >
                새 견적서 작성
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
                      <p className="text-gray-600 mb-2">작성한 견적서가 없습니다</p>
                      <p className="text-sm text-gray-500">새로운 견적서를 작성해보세요</p>
                      <Button
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                        onClick={() => router.push("/guest/estimate")}
                      >
                        견적서 작성하기
                      </Button>
                    </div>
                  </div>
                ) : (
                  estimates.map((estimate) => (
                    <div
                      key={estimate.estimateNo}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">
                              견적서 #{estimate.estimateNo}
                            </h3>
                            <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${estimate.responseCount > 0
                                ? 'text-green-600 bg-green-50'
                                : 'text-gray-600 bg-gray-50'
                              }`}>
                              {estimate.responseCount > 0 ? `${estimate.responseCount}개 응답` : '응답 대기'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">이사 날짜</p>
                              <p className="text-base font-semibold text-gray-900">
                                {formatMoveDate(estimate.moveDate)} {/* ✅ moveDate 문자열 포맷팅 */}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">작성일</p>
                              <p className="text-base text-gray-700">
                                {formatDateTime(estimate.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">출발지</p>
                              <p className="text-base text-gray-900">{estimate.fromAddr}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">도착지</p>
                              <p className="text-base text-gray-900">{estimate.toAddr}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                            onClick={() => router.push(`/guest/estimate/received?estimateNo=${estimate.estimateNo}`)}
                          >
                            응답 보기
                          </Button>
                          <Button
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                            onClick={() => router.push(`/guest/estimate/received/list/detail?estimateNo=${estimate.estimateNo}`)}
                          >
                            상세보기
                          </Button>
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