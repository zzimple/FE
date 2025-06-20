"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/common/Button";
import { authApi } from "@/lib/axios";

interface EstimateDetail {
  estimateNo: number;
  storeName: string;
  truckCount: number;
  totalPrice: number;
  ownerMessage?: string;
  extraCharges?: number;
}

export default function ReceivedEstimateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const [estimate, setEstimate] = useState<EstimateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }
        const response = await authApi.get(`/view/estimate/${id}`);
        setEstimate(response.data.data);
      } catch (err) {
        setError("존재하지 않는 견적서입니다.");
      } finally {
        setIsLoading(false);
      }
    };
    if (!isNaN(id)) fetchEstimate();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">
            견적서를 불러오는 중입니다...
          </p>
        </div>
      </div>
    );
  }

  if (error || !estimate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          {error || "존재하지 않는 견적서입니다."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-blue-600 text-center mb-2">
          견적서 상세
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-lg font-semibold">{estimate.storeName}</span>
            <span className="text-sm text-gray-400">
              ID: {estimate.estimateNo}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">견적가</span>
            <span className="text-xl font-bold text-blue-700">
              {estimate.totalPrice.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">트럭</span>
            <span className="font-semibold">{estimate.truckCount}대</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">추가금</span>
            <span className="font-semibold text-red-500">
              {estimate.extraCharges
                ? estimate.extraCharges.toLocaleString() + "원"
                : "0원"}
            </span>
          </div>
          <div className="border-t pt-4 text-gray-700 text-base whitespace-pre-line min-h-[48px]">
            <span className="font-semibold text-blue-500">사장님 안내사항</span>
            <br />
            {estimate.ownerMessage || "-"}
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button
            className="flex-1 h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow"
            onClick={() => {
              alert(`'${estimate.storeName}' 견적을 수락하셨습니다!`);
              router.push("/guest/estimate/received");
            }}
          >
            수락
          </Button>
          <Button
            className="flex-1 h-12 text-lg font-bold bg-red-500 hover:bg-red-700 text-white rounded-xl shadow"
            onClick={() => {
              const rejected = JSON.parse(
                localStorage.getItem("rejectedEstimates") || "[]"
              );
              if (!rejected.includes(estimate.estimateNo)) {
                rejected.push(estimate.estimateNo);
                localStorage.setItem(
                  "rejectedEstimates",
                  JSON.stringify(rejected)
                );
              }
              alert(`'${estimate.storeName}' 견적을 거절하셨습니다.`);
              router.push("/guest/estimate/received");
            }}
          >
            거절
          </Button>
        </div>
      </div>
    </div>
  );
}
