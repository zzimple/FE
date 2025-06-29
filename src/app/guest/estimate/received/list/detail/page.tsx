"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import GuestHeader from "@/components/headers/GuestHeader";
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from "@/lib/axios";
import { formatMoveDate } from "@/lib/utils/formatMoveDate";
import { formatMoveDateTime, formatAddressInfo } from '@/utils/estimateHelpers';
import type { Address, DetailInfo, Item } from '@/types/estimate';

// API 응답 타입 정의
interface EstimateDetailResponse {
  estimateNo: number;
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
  items: Item[];
}

const PILL_CLASS = "flex items-center h-12 px-4 gap-2 rounded-full border border-gray-300 bg-white w-full";

export default function EstimateDetailPage() {
  const [estimateData, setEstimateData] = useState<EstimateDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'가구' | '가전' | '기타'>('가구');

  const router = useRouter();
  const searchParams = useSearchParams();
  const estimateNoParam = searchParams.get("estimateNo");
  const estimateNo = estimateNoParam ? parseInt(estimateNoParam, 10) : null;

  // API 데이터 가져오기
  useEffect(() => {
    if (!estimateNo || isNaN(estimateNo) || estimateNo <= 0) {
      setError('잘못된 견적서 번호입니다.');
      setIsLoading(false);
      return;
    }

    const loadEstimate = async () => {
      try {
        const response = await authApi.get<EstimateDetailResponse>(
          `/view/${estimateNo}`
        );

        setEstimateData(response.data);
        console.log('견적서 상세 데이터:', response.data);
        setError(null);
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

  // 서비스 타입 한글 변환
  const getServiceTypeDisplay = (type: string) => {
    switch (type) {
      case 'SMALL': return '소형이사';
      case 'FAMILY': return '가정이사';
      default: return type;
    }
  };

  // 옵션 타입 한글 변환
  const getOptionTypeDisplay = (type: string) => {
    switch (type) {
      case 'BASIC': return '일반이사';
      case 'PACKAGING': return '포장이사';
      case 'SEMI_PACKAGING': return '반포장이사';
      default: return type;
    }
  };

  // 건물 타입 한글 변환
  const getBuildingTypeDisplay = (type: string) => {
    switch (type) {
      case 'VILLA': return '빌라';
      case 'APARTMENT': return '아파트';
      case 'OFFICETEL': return '오피스텔';
      case 'HOUSE': return '단독주택';
      case 'COMMERCIAL': return '상가';
      default: return type;
    }
  };

  // 방 구조 한글 변환
  const getRoomStructureDisplay = (structure: string) => {
    switch (structure) {
      case 'ONE_ROOM': return '원룸';
      case 'ONE_HALF_ROOM': return '원룸+반';
      case 'TWO_ROOM': return '투룸';
      case 'THREE_ROOM_OR_MORE': return '쓰리룸 이상';
      default: return structure;
    }
  };

  // 날짜 시간 포맷팅 - formatMoveDateTime 함수 사용
  const formatDateTime = (dateString: string, timeString: string) => {
    return formatMoveDateTime(dateString, timeString);
  };

  // 카테고리별 아이템 개수 계산
  const getCategoryCounts = (items: Item[]) => {
    return items.reduce((acc, item) => {
      const category = item.category === 'APPLIANCE' ? '가전' :
        item.category === 'FURNITURE' ? '가구' : '기타';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  // 아이템 상세 정보 생성
  const getItemDetails = (item: Item) => {
    const details = [];
    
    if (item.type) details.push(`타입: ${item.type}`);
    if (item.width && item.height && item.depth) {
      details.push(`크기: ${item.width} x ${item.height} x ${item.depth}`);
    }
    if (item.material) details.push(`재질: ${item.material}`);
    if (item.size) details.push(`사이즈: ${item.size}`);
    if (item.shape) details.push(`형태: ${item.shape}`);
    if (item.capacity) details.push(`용량: ${item.capacity}`);
    if (item.doorCount) details.push(`문 개수: ${item.doorCount}개`);
    if (item.unitCount) details.push(`단위 개수: ${item.unitCount}개`);
    if (item.frame) details.push(`프레임: ${item.frame}`);
    if (item.hasGlass) details.push('유리 포함');
    if (item.foldable) details.push('접이식');
    if (item.hasWheels) details.push('바퀴 포함');
    if (item.hasPrinter) details.push('프린터 포함');
    if (item.purifierType) details.push(`정수기 타입: ${item.purifierType}`);
    if (item.specialNote) details.push(`특이사항: ${item.specialNote}`);
    
    return details;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">견적서를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => router.push("/guest/estimate/received/list")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!estimateData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GuestHeader />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8 text-center text-gray-900">견적서 상세</h1>

          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">

            {/* 서비스 타입 */}
            <div className="space-y-1">
              <div className="text-sm font-semibold text-gray-900">서비스 타입</div>
              <div className={PILL_CLASS}>
                <span className="text-sm text-blue-600">{getServiceTypeDisplay(estimateData.moveType)}</span>
              </div>
            </div>

            {/* 옵션 타입 */}
            <div className="space-y-1">
              <div className="text-sm font-semibold text-gray-900">옵션 타입</div>
              <div className={PILL_CLASS}>
                <span className="text-sm text-blue-600">{getOptionTypeDisplay(estimateData.optionType)}</span>
              </div>
            </div>

            {/* 예약 날짜 및 시간 */}
            <div className="space-y-1">
              <div className="text-sm font-semibold text-gray-900">예약 날짜 및 시간</div>
              <div className={PILL_CLASS}>
                <span className="text-sm">{formatDateTime(estimateData.moveDate, estimateData.moveTime)}</span>
              </div>
            </div>

            {/* 출발지 */}
            <div className="space-y-1">
              <div className="text-sm font-semibold text-gray-900">출발지</div>
              <div className={PILL_CLASS}>
                <span className="text-sm">{estimateData.fromAddress.roadFullAddr}</span>
              </div>
              <p className="text-xs text-blue-500">{formatAddressInfo(estimateData.fromDetailInfo)}</p>
            </div>

            {/* 출발지 상세 정보 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">출발지 상세 정보</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">건물 타입:</span>
                  <span className="ml-2 font-medium">{getBuildingTypeDisplay(estimateData.fromDetailInfo.buildingType)}</span>
                </div>
                <div>
                  <span className="text-gray-600">방 구조:</span>
                  <span className="ml-2 font-medium">{getRoomStructureDisplay(estimateData.fromDetailInfo.roomStructure)}</span>
                </div>
                <div>
                  <span className="text-gray-600">층수:</span>
                  <span className="ml-2 font-medium">{estimateData.fromDetailInfo.floor}층</span>
                </div>
                <div>
                  <span className="text-gray-600">엘리베이터:</span>
                  <span className="ml-2 font-medium">{estimateData.fromDetailInfo.elevator ? '있음' : '없음'}</span>
                </div>
                <div>
                  <span className="text-gray-600">계단:</span>
                  <span className="ml-2 font-medium">{estimateData.fromDetailInfo.hasStairs ? '있음' : '없음'}</span>
                </div>
                <div>
                  <span className="text-gray-600">주차:</span>
                  <span className="ml-2 font-medium">{estimateData.fromDetailInfo.hasParking ? '가능' : '불가능'}</span>
                </div>
              </div>
            </div>

            {/* 도착지 */}
            <div className="space-y-1">
              <div className="text-sm font-semibold text-gray-900">도착지</div>
              <div className={PILL_CLASS}>
                <span className="text-sm">{estimateData.toAddress.roadFullAddr}</span>
              </div>
              <p className="text-xs text-blue-500">{formatAddressInfo(estimateData.toDetailInfo)}</p>
            </div>

            {/* 도착지 상세 정보 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-semibold text-gray-900 mb-2">도착지 상세 정보</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">건물 타입:</span>
                  <span className="ml-2 font-medium">{getBuildingTypeDisplay(estimateData.toDetailInfo.buildingType)}</span>
                </div>
                <div>
                  <span className="text-gray-600">방 구조:</span>
                  <span className="ml-2 font-medium">{getRoomStructureDisplay(estimateData.toDetailInfo.roomStructure)}</span>
                </div>
                <div>
                  <span className="text-gray-600">층수:</span>
                  <span className="ml-2 font-medium">{estimateData.toDetailInfo.floor}층</span>
                </div>
                <div>
                  <span className="text-gray-600">엘리베이터:</span>
                  <span className="ml-2 font-medium">{estimateData.toDetailInfo.elevator ? '있음' : '없음'}</span>
                </div>
                <div>
                  <span className="text-gray-600">계단:</span>
                  <span className="ml-2 font-medium">{estimateData.toDetailInfo.hasStairs ? '있음' : '없음'}</span>
                </div>
                <div>
                  <span className="text-gray-600">주차:</span>
                  <span className="ml-2 font-medium">{estimateData.toDetailInfo.hasParking ? '가능' : '불가능'}</span>
                </div>
              </div>
            </div>

            {/* 물품 목록 */}
            {estimateData.items && estimateData.items.length > 0 && (
              <div className="space-y-4">
                <div className="text-sm font-semibold text-gray-900">물품 목록</div>
                
                {/* 카테고리 필터 */}
                <div className="flex gap-2">
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
                        ({getCategoryCounts(estimateData.items)[category as "가구" | "가전" | "기타"] || 0})
                      </span>
                    </button>
                  ))}
                </div>

                {/* 물품 상세 목록 */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-sm font-semibold text-gray-900 mb-2">물품 상세 목록</div>
                  <div className="space-y-3">
                    {estimateData.items
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
                            {getItemDetails(item).map((detail, idx) => (
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
              </div>
            )}

            {/* 고객님 메모 */}
            {estimateData.customerMemo && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-sm font-semibold text-gray-900 mb-2">고객님 메모</div>
                <div className="text-sm text-gray-700 whitespace-pre-line">{estimateData.customerMemo}</div>
              </div>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="mt-8 flex gap-4">
            <Link href="/guest/estimate/received/list" className="flex-1">
              <button className="w-full h-14 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors">
                견적서 목록
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
