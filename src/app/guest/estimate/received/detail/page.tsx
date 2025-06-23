"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from 'next/link';
import GuestHeader from "@/components/headers/GuestHeader";
import { useRouter, useSearchParams } from 'next/navigation';
import type { Address, DetailInfo, Item } from '@/types/estimate';
import { getCategoryCounts, getItemDetailsNoFrame, formatMoveDateTime, NOTES, formatAddressInfo } from '@/utils/estimateHelpers';
import { authApi } from "@/lib/axios";

interface EstimateDetailResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    estimateNo: number;
    storeName: string;
    ownerName: string;
    ownerPhone: string;
    userId: number;
    moveDate: string;
    moveTime: string;
    moveType: 'SMALL' | 'FAMILY';
    optionType: 'BASIC' | 'PACKAGING' | 'SEMI_PACKAGING';
    fromAddress: Address;
    fromDetailInfo: DetailInfo;
    toAddress: Address;
    toDetailInfo: DetailInfo;
    customerMemo: string;
    truckCount: number;
    truckTotalPrice: number;
    ownerMessage: string;
    itemPriceDetails: Array<{
      itemTypeId: number;
      itemTypeName: string;
      quantity: number;
      basePrice: number;
      extraCharges?: Array<{
        amount: number;
        reason: string;
      }>;
    }>;
    extraCharges: Array<{
      amount: number;
      reason: string;
    }>;
    items: Item[];
    totalPrice: number;
    holidayCharge?: number;
    goodDayCharge?: number;
    weekendCharge?: number;
  };
}

const PILL_CLASS = "flex items-center h-12 px-4 gap-2 rounded-full border border-gray-300 bg-white w-full";

export default function ReceivedEstimateDetailPage() {

  const [estimateData, setEstimateData] = useState<EstimateDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'가구' | '가전' | '기타' | '전체'>('전체');
  const [isAccepting, setIsAccepting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const estimateNoParam = searchParams.get("estimateNo");
  const estimateNo = estimateNoParam ? parseInt(estimateNoParam, 10) : null;

  const storeIdParam = searchParams.get("storeId");
  const storeId = storeIdParam ? parseInt(storeIdParam, 10) : null;

  // API 데이터 가져오기
  useEffect(() => {
    if (!estimateNo || isNaN(estimateNo) || estimateNo <= 0) {
      setError('잘못된 견적서 번호입니다.');
      setIsLoading(false);
      return;
    }

    const loadEstimate = async () => {
      try {
        // Guest용 API만 사용
        const response = await authApi.get<EstimateDetailResponse>(
          `/view/stores/${storeId}/estimates/${estimateNo}`
        );

        if (response.data.success) {
          setEstimateData(response.data);
          setError(null);
        } else {
          setError('견적서를 불러오는데 실패했습니다.');
        }
      } catch (err: any) {
        console.error('견적서 데이터 조회 실패:', err);
        if (err.response?.status === 403) {
          setError('견적서를 조회할 권한이 없습니다.');
        } else if (err.response?.status === 401) {
          setError('로그인이 필요합니다.');
        } else if (err.response?.status === 404) {
          setError('존재하지 않는 견적서입니다.');
        } else {
          setError('데이터 로딩 중 오류가 발생했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadEstimate();
  }, [estimateNo]);

  // ===== 데이터 변환 =====
  const reviewData = estimateData ? {
    estimateNo: estimateData.data.estimateNo,
    serviceType: estimateData.data.moveType === "SMALL" ? "소형이사" : "가정이사",
    dateTime: formatMoveDateTime(estimateData.data.moveDate, estimateData.data.moveTime),
    from: {
      address: estimateData.data.fromAddress.roadFullAddr,
      info: formatAddressInfo(estimateData.data.fromDetailInfo),
      coord: {
        x: parseFloat(estimateData.data.fromAddress.entX),
        y: parseFloat(estimateData.data.fromAddress.entY),
      }
    },
    to: {
      address: estimateData.data.toAddress.roadFullAddr,
      info: formatAddressInfo(estimateData.data.toDetailInfo),
      coord: {
        x: parseFloat(estimateData.data.toAddress.entX),
        y: parseFloat(estimateData.data.toAddress.entY),
      }
    },
    truckCount: estimateData.data.truckCount,
    truckTotalPrice: estimateData.data.truckTotalPrice,
    ownerMessage: estimateData.data.ownerMessage,
    memo: estimateData.data.customerMemo,
    notes: NOTES,
    itemPriceDetails: estimateData.data.itemPriceDetails,
    extraCharges: estimateData.data.extraCharges,
    items: estimateData.data.items,
    totalPrice: estimateData.data.totalPrice,
    storeName: estimateData.data.storeName,
    ownerName: estimateData.data.ownerName,
    ownerPhone: estimateData.data.ownerPhone
  } : null;

  // ===== 이벤트 핸들러 =====
  const handleSubmit = () => {
    router.push('/guest/estimate/received');
  }

  const handleGoBack = () => {
    router.back();
  }

  // 수락 API 호출 함수
  const handleAccept = async () => {
    if (!estimateNo || !storeId) {
      alert('견적서 정보가 올바르지 않습니다.');
      return;
    }

    try {
      setIsAccepting(true);
      const response = await authApi.put(`/guest/my/${estimateNo}/respond/${storeId}`);
      
      if (response.data.success) {
        alert('견적서가 성공적으로 수락되었습니다.');
        // 수락 성공 후 견적서 목록으로 이동
        router.push('/guest/estimate/received/list');
      } else {
        alert(response.data.message || '견적서 수락에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('견적서 수락 실패:', err);
      if (err.response?.status === 400) {
        alert('이미 수락된 견적서입니다.');
      } else if (err.response?.status === 404) {
        alert('견적서를 찾을 수 없습니다.');
      } else {
        alert('견적서 수락 중 오류가 발생했습니다.');
      }
    } finally {
      setIsAccepting(false);
    }
  };

  // ===== 렌더링 =====
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!reviewData) {
    return <div className="min-h-screen flex items-center justify-center">데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50">
        <GuestHeader />
        <div className="max-w-7xl mx-auto px-4 py-8 pt-12">

          <h1 className="text-2xl font-bold mb-8 text-center text-gray-900">견적서 상세</h1>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            {/* 서비스 타입 */}
            <div className="space-y-1">
              <div className="text-sm font-semibold text-gray-900">서비스 타입</div>
              <div className={PILL_CLASS}>
                <span className="text-sm text-blue-600">{reviewData.serviceType}</span>
              </div>
            </div>

            {/* 예약 날짜 및 시간 */}
            <div className="space-y-1">
              <div className="text-sm font-semibold text-gray-900">예약 날짜 및 시간</div>
              <div className={PILL_CLASS}>
                <span className="text-sm">{reviewData.dateTime}</span>
              </div>
            </div>

            {/* 출발지 */}
            <div className="space-y-1">
              <div className="text-sm font-semibold text-gray-900">출발지</div>
              <div className={PILL_CLASS}>
                <span className="text-sm">{reviewData.from.address}</span>
              </div>
              <p className="text-xs text-blue-500">{reviewData.from.info}</p>
            </div>

            {/* 도착지 */}
            <div className="space-y-1">
              <div className="text-sm font-semibold text-gray-900">도착지</div>
              <div className={PILL_CLASS}>
                <span className="text-sm">{reviewData.to.address}</span>
              </div>
              <p className="text-xs text-blue-500">{reviewData.to.info}</p>
            </div>

            {/* 카테고리 버튼 */}
            <div className="flex gap-2 mb-4">
              {['가구', '가전', '기타'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category as '가구' | '가전' | '기타')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                                    ${selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                >
                  {category}
                  <span className="ml-1 text-xs">
                    ({getCategoryCounts(estimateData?.data.items || [])[category as "가구" | "가전" | "기타"] || 0})
                  </span>
                </button>
              ))}
            </div>

            {/* 물품 상세 목록 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">물품 상세 목록</div>
              <div className="space-y-3">
                {(estimateData?.data.items || [])
                  .filter(item => {
                    const category = item.category === 'APPLIANCE' ? '가전' :
                      item.category === 'FURNITURE' ? '가구' : '기타';
                    return category === selectedCategory;
                  })
                  .map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {item.itemTypeName} x {item.quantity}개
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.category === 'APPLIANCE' ? '가전' :
                            item.category === 'FURNITURE' ? '가구' : '기타'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {getItemDetailsNoFrame(item).map((detail, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-center">
                            <span className="text-blue-500 mr-1">•</span>
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 고객님 메모 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">고객님 메모</div>
              <div className="text-sm text-gray-700 whitespace-pre-line">{reviewData.memo}</div>
            </div>

            {/* 입력란 */}
            <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-6a1 1 0 00-.293-.707l-2-2A1 1 0 0017 4H3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">트럭 개수</div>
                  <div className="text-lg text-gray-900">
                    {reviewData.truckCount}대
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500 mb-2">사장님 전달사항</div>
                    <div className="bg-gray-50 rounded-lg p-3 text-gray-700 text-sm">
                      {reviewData.ownerMessage || "전달사항이 없습니다."}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 최종 가격 정보 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mt-8">
              <h2 className="text-lg font-bold mb-4">최종 가격 정보</h2>
              {/* 물품별 가격 상세 */}
              <div className="mb-6">
                <div className="text-sm font-semibold mb-2">물품별 가격</div>
                <ul className="space-y-2">
                  {reviewData.itemPriceDetails?.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex flex-col gap-1 border-b last:border-b-0 pb-2 last:pb-0"
                    >
                      {/* 기본 가격 */}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.itemTypeName}
                        </span>
                        <span className="text-blue-600 font-semibold">
                          {item.basePrice.toLocaleString()}원
                        </span>
                      </div>

                      {/* extraCharges */}
                      {item.extraCharges?.map((charge, cidx) => (
                        <div
                          key={cidx}
                          className="flex justify-between text-xs text-gray-500 pl-2"
                        >
                          <span>+ {charge.reason}</span>
                          <span>+{charge.amount.toLocaleString()}원</span>
                        </div>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 추가 요금 내역 */}
              <div className="mb-4">
                <div className="text-sm font-semibold mb-2">추가 요금</div>
                <ul className="space-y-1">
                  {/* 트럭 가격 */}
                  {estimateData?.data?.truckTotalPrice && estimateData.data.truckTotalPrice > 0 && (
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600">트럭 {estimateData.data.truckCount}대</span>
                      <span className="text-blue-600 font-semibold">
                        {estimateData.data.truckTotalPrice.toLocaleString()}원
                      </span>
                    </li>
                  )}
                  {/* 기존 추가 요금들 */}
                  {reviewData.extraCharges && reviewData.extraCharges.map((charge, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{charge.reason}</span>
                      <span className="text-blue-600 font-semibold">+{charge.amount.toLocaleString()}원</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 총액 */}
              <div className="flex justify-between items-center border-t pt-4 mt-4">
                <span className="text-base font-bold">총액</span>
                <span className="text-2xl font-bold text-blue-600">
                  {reviewData.totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 유의사항 */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
              <h4 className="font-semibold text-red-600 mb-2">유의사항</h4>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
                {reviewData.notes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* 견적서 목록 버튼 */}
          <div className="mt-8 flex gap-4">
            {/* 견적서 목록 버튼 */}
            <Link href="/guest/estimate/received/list" className="flex-1">
              <button className="w-full h-14 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors">
                견적서 목록
              </button>
            </Link>
            
            {/* 수락 버튼 */}
            <button 
              onClick={handleAccept}
              disabled={isAccepting}
              className="flex-1 h-14 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isAccepting ? '수락 중...' : '수락하기'}
            </button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}