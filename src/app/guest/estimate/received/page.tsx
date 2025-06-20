"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/axios";

interface Estimate {
  estimateNo: number;
  storeName: string;
  truckCount: number;
  totalPrice: number;
  ownerMessage?: string;
  extraCharges?: number;
}

export default function ReceivedEstimatesPage() {
  const router = useRouter();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectedEstimates, setRejectedEstimates] = useState<number[]>([]);

  useEffect(() => {
    const fetchEstimates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }
        const response = await authApi.get("/guest/my/estimate/list", {
          params: { page: 0, size: 50 },
        });
        setEstimates(response.data.data?.content || []);
      } catch (err) {
        setError("견적서 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEstimates();
    // 거절된 견적서 목록 불러오기
    const rejected = JSON.parse(
      localStorage.getItem("rejectedEstimates") || "[]"
    );
    setRejectedEstimates(rejected);
  }, [router]);

  return (
    <div className="min-h-screen bg-white max-w-2xl mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6 text-center">
        받은 견적서 관리
      </h1>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <Button
          className="w-full sm:w-auto h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            router.push(`/estimate/gpt`);
          }}
        >
          견적서 비교하러 가기
        </Button>
        <span className="text-xs text-gray-400 sm:ml-2">
          어떤 업체를 선택해야 할지 고민된다면? <br />
          ai에게 견적서 비교 요청을 해보세요!
        </span>
      </div>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">
            견적서를 불러오는 중입니다...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="flex flex-col gap-4">
          {estimates.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <p className="text-gray-500 text-sm">견적서가 없습니다.</p>
            </div>
          ) : (
            estimates
              .filter(
                (estimate) => !rejectedEstimates.includes(estimate.estimateNo)
              )
              .map((estimate) => (
                <div
                  key={estimate.estimateNo}
                  className="flex flex-row items-center border rounded-xl bg-white px-6 py-5 shadow-sm transition-all duration-200 border-gray-200 gap-4 flex-wrap sm:flex-nowrap"
                >
                  <span className="font-semibold text-base sm:text-lg text-gray-900 truncate max-w-[120px]">
                    {estimate.storeName}
                  </span>
                  <span className="text-sm sm:text-base text-gray-700">
                    견적가:{" "}
                    <b className="text-base font-bold text-blue-700">
                      {estimate.totalPrice.toLocaleString()}원
                    </b>
                  </span>
                  <span className="text-sm sm:text-base text-gray-700">
                    트럭: <b>{estimate.truckCount}대</b>
                  </span>
                  <span className="text-sm sm:text-base text-gray-700">
                    추가금:{" "}
                    <b>
                      {estimate.extraCharges
                        ? estimate.extraCharges.toLocaleString() + "원"
                        : "0원"}
                    </b>
                  </span>
                  {estimate.ownerMessage && (
                    <span className="text-gray-500 text-sm truncate max-w-[180px] hidden sm:inline">
                      {estimate.ownerMessage}
                    </span>
                  )}
                  <Button
                    className="ml-auto w-24 sm:w-28 h-10 sm:h-11 text-sm sm:text-base font-bold bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      router.push(
                        `/guest/estimate/received/${estimate.estimateNo}`
                      );
                    }}
                  >
                    상세보기
                  </Button>
                </div>
              ))
          )}
        </div>
      )}
      <style jsx global>{`
        @media (max-width: 640px) {
          h1 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
