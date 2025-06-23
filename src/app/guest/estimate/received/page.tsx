"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import Pagination from "@/components/common/Pagination";
import GuestHeader from "@/components/headers/GuestHeader";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi, getAccessTokenFromCookie } from "@/lib/axios";

// ✅ 새로운 API 응답 구조에 맞는 타입 정의
interface Response {
  storeId: number;
  storeName: string;
  truckCount: number;
  ownerMessage: string;
  respondedAt: string;
  itemsTotal: number;
  extraTotal: number;
  finalTotal: number;
  status: string;
}

interface EstimateResponsesResponse {
  success: boolean;
  message: string;
  data: {
    estimateNo: number;
    responses: Response[];
  };
}

export default function ReceivedEstimatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const estimateNo = searchParams.get("estimateNo");
  
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectedEstimates, setRejectedEstimates] = useState<number[]>([]);

  const checkLogin = () => {
    const token = getAccessTokenFromCookie();
    if (!token) {
      setError("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      setTimeout(() => router.push("/login"), 2000);
      return false;
    }
    return true;
  };

  const fetchResponses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!checkLogin()) return;

      if (!estimateNo) {
        setError("견적서 번호가 없습니다.");
        return;
      }

      // ✅ 새로운 엔드포인트 사용
      const response = await authApi.get<EstimateResponsesResponse>(`/guest/my/${estimateNo}/responses`);

      if (response.data.success) {
        const data = response.data.data;
        setResponses(data.responses || []);
      } else {
        setError("견적서 응답을 불러오는데 실패했습니다.");
      }
    } catch (err: any) {
      console.error("견적서 응답 조회 실패:", err);

      if (err.response?.status === 401) {
        setError("인증이 만료되었습니다. 다시 로그인해주세요.");
      } else if (err.response?.status === 404) {
        setError("견적서를 찾을 수 없습니다.");
      } else {
        setError("견적서 응답을 불러오는데 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
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

  // 상태 표시 함수 추가
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'WAITING':
        return {
          text: '검토대기',
          className: 'text-green-600 bg-green-50'
        };
      case 'ACCEPTED':
        return {
          text: '수락됨',
          className: 'text-blue-600 bg-blue-50'
        };
      case 'CONFIRMED':
        return {
          text: '매칭됨',
          className: 'text-purple-600 bg-purple-50'
        };
      case 'REJECTED':
        return {
          text: '거절됨',
          className: 'text-red-600 bg-red-50'
        };
      default:
        return {
          text: '검토대기',
          className: 'text-green-600 bg-green-50'
        };
    }
  };

  useEffect(() => {
    fetchResponses();

    const rejected = JSON.parse(
      localStorage.getItem("rejectedEstimates") || "[]"
    );
    setRejectedEstimates(rejected);
  }, [estimateNo]);

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
              <div className="text-left">
                <p className="text-gray-600 text-sm">
                  어떤 업체를 선택해야 할지 고민된다면? AI에게 견적서 비교 요청을 해보세요!
                </p>
              </div>
              <Button
                className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium"
                onClick={() => router.push(`/estimate/gpt?estimateNo=${estimateNo}`)}
              >
                AI 견적서 비교
              </Button>
            </div>
          </div>

          {/* 견적서 정보 */}
          {estimateNo && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  견적서 #{estimateNo}
                </h2>
                <p className="text-sm text-gray-600">
                  총 {responses.length}개의 응답을 받았습니다
                </p>
              </div>
            </div>
          )}

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
                {responses.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-12">
                    <div className="text-center">
                      <p className="text-gray-600 mb-2">받은 견적서가 없습니다</p>
                      <p className="text-sm text-gray-500">새로운 견적서가 도착하면 여기에 표시됩니다</p>
                    </div>
                  </div>
                ) : (
                  responses
                    .filter(response => !rejectedEstimates.includes(response.storeId))
                    .map((response) => (
                      <div
                        key={response.storeId}
                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-xl font-bold text-gray-900">
                                {response.storeName}
                              </h3>
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                #{estimateNo}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">견적가</p>
                                <p className="text-lg font-bold text-blue-600">
                                  {response.finalTotal.toLocaleString()}원
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">트럭 수</p>
                                <p className="text-lg font-semibold text-gray-900">
                                  {response.truckCount}대
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">상태</p>
                                {(() => {
                                  const statusInfo = getStatusDisplay(response.status);
                                  return (
                                    <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${statusInfo.className}`}>
                                      {statusInfo.text}
                                    </span>
                                  );
                                })()}
                              </div>
                            </div>

                            {/* ✅ 상세 정보 표시 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                              <div>
                                <p>아이템 총액: {response.itemsTotal.toLocaleString()}원</p>
                                <p>추가 비용: {response.extraTotal.toLocaleString()}원</p>
                              </div>
                              <div>
                                <p>응답 시간: {formatDateTime(response.respondedAt)}</p>
                              </div>
                            </div>

                            {response.ownerMessage && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">{response.ownerMessage}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                              onClick={() => router.push(`/guest/estimate/received/detail?estimateNo=${estimateNo}&storeId=${response.storeId}`)}
                            >
                              상세보기

                            </Button>
                            {/* <Button
                              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                              onClick={() => {
                                const newRejected = [...rejectedEstimates, response.storeId];
                                setRejectedEstimates(newRejected);
                                localStorage.setItem("rejectedEstimates", JSON.stringify(newRejected));
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}