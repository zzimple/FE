'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authApi } from '@/lib/axios';
import StaffHeader from "@/components/headers/StaffHeader";
import UnauthorizedPage from "@/components/common/UnauthorizedPage";
import { formatMoveDateTime, formatAddressInfo } from '@/utils/estimateHelpers';
import type { DetailInfo, Item } from '@/types/estimate';
import KakaoMapRoute from '@/components/kakao/KakaoMapRoute ';

interface Schedule {
  date: string;
  time: string;
  type: string;
}

interface CalendarItem {
  date: string;
  type: 'WORK' | 'TIME_OFF';
  timeOff?: {
    type: 'ANNUAL' | 'HALF' | 'SICK' | 'ETC';
    reason: string;
  };
}

interface Address {
  roadFullAddr: string;
  roadAddrPart1: string;
  zipNo: string;
  entX: string;
  entY: string;
  addrDetail: string;
}

interface EstimateDetail {
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
  status: string;
}

interface TimeOff {
  startDate: string;
  endDate: string;
  status: string;
  type: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

// API 응답 타입 정의
type CalendarResponse = CalendarItem[];

interface EstimateDetailResponse {
  success: boolean;
  code: string;
  message: string;
  data: EstimateDetail;
}

export default function WorkDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const estimateNo = searchParams.get('estimateNo');
  const storeId = searchParams.get('storeId');
  
  const [estimateDetail, setEstimateDetail] = useState<EstimateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'가구' | '가전' | '기타'>('가구');
  const [duration, setDuration] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  // 스태프 권한 확인
  useEffect(() => {
    const checkStaffAccess = async () => {
      try {
        const res = await authApi.get("/staff/profile");
        if (res.data.success) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (e: any) {
        console.error("Staff 권한 확인 실패", e);
        if (e.response?.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (e.response?.status === 403) {
          setError("스태프 권한이 필요합니다. 사장님께 인증을 받아주세요.");
        }
        setHasAccess(false);
      }
    };

    checkStaffAccess();
  }, []);

  // 견적서 상세 정보 가져오기
  useEffect(() => {
    if (hasAccess === true && estimateNo && storeId) {
      fetchEstimateDetail();
    }
  }, [hasAccess, estimateNo, storeId]);

  const fetchEstimateDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!estimateNo || !storeId) {
        setError('견적서 번호 또는 매장 ID가 없습니다.');
        return;
      }

      // Guest 페이지와 동일한 API 사용
      const response = await authApi.get<EstimateDetailResponse>(
        `/view/stores/${storeId}/estimates/${estimateNo}`
      );

      if (response.data.success) {
        setEstimateDetail(response.data.data);
        console.log('견적서 상세 데이터:', response.data.data);
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
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  const formatCost = (cost: number) => {
    return cost.toLocaleString('ko-KR') + '원';
  };

  const getMoveTypeKorean = (type: string) => {
    if (type === 'SMALL') return '소형이사';
    if (type === 'FAMILY') return '가정이사';
    return type;
  };

  const getStatusKorean = (status: string) => {
    switch (status) {
      case 'PENDING': return '대기중';
      case 'APPROVED': return '승인됨';
      case 'REJECTED': return '거절됨';
      case 'COMPLETED': return '완료';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-600';
      case 'APPROVED': return 'bg-green-50 text-green-600';
      case 'REJECTED': return 'bg-red-50 text-red-600';
      case 'COMPLETED': return 'bg-blue-50 text-blue-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getTimeOffTypeKorean = (type: string) => {
    switch (type) {
      case 'ANNUAL': return '연차';
      case 'HALF': return '반차';
      case 'SICK': return '병가';
      case 'ETC': return '기타';
      default: return type;
    }
  };

  // 상태 표시 함수
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

  // 카테고리별 개수 계산
  const getCategoryCounts = (items: Item[]) => {
    return items.reduce((acc, item) => {
      const category = item.category === 'APPLIANCE' ? '가전' :
        item.category === 'FURNITURE' ? '가구' : '기타';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  // 물품 상세 정보 표시
  const getItemDetailsNoFrame = (item: Item) => {
    const details: string[] = [];
    
    if (item.size) details.push(`크기: ${item.size}`);
    if (item.material) details.push(`재질: ${item.material}`);
    if (item.specialNote) details.push(`특이사항: ${item.specialNote}`);
    if (item.width && item.height && item.depth) {
      details.push(`치수: ${item.width} x ${item.height} x ${item.depth}`);
    }
    if (item.capacity) details.push(`용량: ${item.capacity}`);
    if (item.doorCount) details.push(`문 개수: ${item.doorCount}개`);
    if (item.unitCount) details.push(`단위 개수: ${item.unitCount}개`);
    if (item.hasGlass) details.push('유리 포함');
    if (item.foldable) details.push('접이식');
    if (item.hasWheels) details.push('바퀴 포함');
    if (item.hasPrinter) details.push('프린터 포함');
    if (item.purifierType) details.push(`정수기 타입: ${item.purifierType}`);
    
    return details;
  };

  if (hasAccess === null) {
    return (
      <div className="min-h-screen bg-white">
        <StaffHeader />
        <div className="text-center mt-20 text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (hasAccess === false) {
    return (
      <div className="min-h-screen bg-white">
        <StaffHeader />
        <UnauthorizedPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StaffHeader />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-12">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">견적서 상세정보</h1>
            <p className="text-gray-600 mt-1">견적번호: {estimateNo}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            뒤로가기
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center px-4 py-2 text-sm text-gray-500">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              견적서 정보를 불러오는 중...
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-lg font-medium">{error}</p>
            </div>
            <button
              onClick={fetchEstimateDetail}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : estimateDetail ? (
          <div className="space-y-6">
            {/* 서비스 타입 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-gray-900 w-32 shrink-0">서비스 타입</div>
                <div className="inline-block px-3 py-1 rounded-full bg-blue-50">
                  <span className="text-sm text-blue-600">{getMoveTypeKorean(estimateDetail.moveType)}</span>
                </div>
              </div>
            </div>

            {/* 예약 날짜 및 시간 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-gray-900 w-32 shrink-0">예약 날짜 및 시간</div>
                <div className="text-sm text-gray-900">
                  {formatMoveDateTime(estimateDetail.moveDate, estimateDetail.moveTime)}
                </div>
              </div>
            </div>

            {/* 출발지 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-1">출발지</div>
                <div className="text-sm text-gray-900">
                  {estimateDetail.fromAddress.roadFullAddr}
                  {estimateDetail.fromAddress.addrDetail ? `, ${estimateDetail.fromAddress.addrDetail}` : ''}
                </div>
                <div className="text-xs text-blue-500 mt-1">{formatAddressInfo(estimateDetail.fromDetailInfo)}</div>
              </div>
            </div>

            {/* 도착지 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-1">도착지</div>
                <div className="text-sm text-gray-900">
                  {estimateDetail.toAddress.roadFullAddr}
                  {estimateDetail.toAddress.addrDetail ? `, ${estimateDetail.toAddress.addrDetail}` : ''}
                </div>
                <div className="text-xs text-blue-500 mt-1">{formatAddressInfo(estimateDetail.toDetailInfo)}</div>
              </div>
            </div>

            {/* 카카오맵 경로 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <div className="text-sm font-semibold text-gray-900 mb-2">예상 경로 및 거리</div>
              <div className="relative w-full h-80 rounded-lg overflow-hidden border border-gray-200" style={{height: '320px'}}>
                <KakaoMapRoute 
                  estimateNo={estimateDetail.estimateNo}
                  onStatus={(dur, dist) => {
                    setDuration(dur);
                    setDistance(dist);
                  }}
                />
              </div>
              <div className="flex justify-around text-center pt-2">
                <div>
                  <div className="text-xs text-gray-500">예상 소요 시간</div>
                  <div className="text-sm font-semibold text-blue-600">
                    {duration != null ? `${Math.floor(duration / 60)}분` : "- 분"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">예상 이동 거리</div>
                  <div className="text-sm font-semibold text-blue-600">
                    {distance != null ? `${(distance / 1000).toFixed(1)}km` : "- km"}
                  </div>
                </div>
              </div>
            </div>

            {/* 카테고리 버튼 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                      ({getCategoryCounts(estimateDetail.items)[category as "가구" | "가전" | "기타"] || 0})
                    </span>
                  </button>
                ))}
              </div>

              {/* 물품 상세 목록 */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-sm font-semibold text-gray-900 mb-2">물품 상세 목록</div>
                <div className="space-y-3">
                  {estimateDetail.items
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
            </div>

            {/* 고객 메모 */}
            {estimateDetail.customerMemo && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-sm font-semibold text-gray-900 mb-2">고객님 메모</div>
                  <div className="text-sm text-gray-700 whitespace-pre-line">{estimateDetail.customerMemo}</div>
                </div>
              </div>
            )}

            {/* 트럭 정보 및 사장님 메시지 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
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
                      {estimateDetail.truckCount}대
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
                        {estimateDetail.ownerMessage || "전달사항이 없습니다."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 최종 가격 정보 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold mb-4">최종 가격 정보</h2>
              
              {/* 물품별 가격 상세 */}
              <div className="mb-6">
                <div className="text-sm font-semibold mb-2">물품별 가격</div>
                <ul className="space-y-2">
                  {estimateDetail.itemPriceDetails?.map((item, idx) => (
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
                  {estimateDetail.truckTotalPrice && estimateDetail.truckTotalPrice > 0 && (
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600">트럭 {estimateDetail.truckCount}대</span>
                      <span className="text-blue-600 font-semibold">
                        {estimateDetail.truckTotalPrice.toLocaleString()}원
                      </span>
                    </li>
                  )}
                  {/* 기존 추가 요금들 */}
                  {estimateDetail.extraCharges && estimateDetail.extraCharges.map((charge, idx) => (
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
                  {estimateDetail.totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
} 