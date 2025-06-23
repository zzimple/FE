"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Button from "@/components/common/Button";
import { useRouter, useSearchParams } from 'next/navigation';
import type { Address, DetailInfo, Item } from '@/types/estimate';
import { getCategoryCounts, getItemDetailsNoFrame, formatMoveDateTime, NOTES, formatAddressInfo } from '@/utils/estimateHelpers';
import { authApi } from "@/lib/axios";
import KakaoMapRoute from "@/components/kakao/KakaoMapRoute ";

interface EstimateFinalCheckResponse {
    success: boolean;          // API 호출 성공 여부
    message: string;           // API 응답 메시지
    data: {
        estimateNo: number;      // 견적서 번호
        userId: number;          // 사용자 ID
        moveDate: string;        // 이사 날짜
        moveTime: string;
        moveType: 'SMALL' | 'FAMILY';
        optionType: 'BASIC' | 'PACKAGING' | 'SEMI_PACKAGING';
        fromAddress: Address;    // 출발지 주소
        fromDetailInfo: DetailInfo; // 출발지 상세정보
        toAddress: Address;      // 도착지 주소
        toDetailInfo: DetailInfo;  // 도착지 상세정보
        boxCount: number;   // 박스 개수
        leftoverBoxCount: number;  // 잔여 박스 개수
        items: Item[];             // 물품 목록
        customerMemo: string;      // 고객 메모
        truckCount: number;
        truckTotalPrice: number;
        ownerMessage: string;
        estimatedCost?: number;    // 예상 비용
        finalPrice?: number;       // 최종 가격
        extraCharges?: Array<{     // 추가 요금
            amount: number;
            reason: string;
        }>;
        itemPriceDetails?: Array<{  // 아이템 가격 상세
            itemTypeId: number;
            itemTypeName: string;
            quantity: number;
            basePrice: number;
            extraCharges?: Array<{
                amount: number;
                reason: string;
            }>;
        }>;
        storeName?: string;        // 매장명
        ownerName?: string;        // 사장님 이름
        ownerPhone?: string;       // 사장님 전화번호
        totalPrice?: number;       // 총액
    };
}

const PILL_CLASS = "flex items-center h-12 px-4 gap-2 rounded-full border border-gray-300 bg-white w-full";

export default function EstimateFinalCheckPage() {

    const [finalTotal, setFinalTotal] = useState("");
    const [estimateData, setEstimateData] = useState<EstimateFinalCheckResponse | null>(null); // API 데이터
    const [isLoading, setIsLoading] = useState(true);        // 로딩 상태
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<'가구' | '가전' | '기타' | '전체'>('전체');
    const [duration, setDuration] = useState<number | null>(null);   // 예상 소요 시간
    const [distance, setDistance] = useState<number | null>(null);   // 예상 거리

    const router = useRouter();
    const searchParams = useSearchParams();
    const estimateNoParam = searchParams.get("estimateNo");
    const estimateNo = estimateNoParam ? parseInt(estimateNoParam, 10) : null;

    const storeIdParam = searchParams.get("storeId");
    const storeId = storeIdParam ? parseInt(storeIdParam, 10) : null;

    const hasCalculated = useRef(false);


    // API 데이터 가져오기
    useEffect(() => {

        console.log("▶️ estimateNo:", estimateNo);
        console.log("▶️ storeId:", storeId);
        if (!estimateNo || isNaN(estimateNo) || estimateNo <= 0) {
            setError('잘못된 견적서 번호입니다.');
            setIsLoading(false);
            return;
        }

        const loadAll = async () => {
            try {
                if (!hasCalculated.current) {
                    hasCalculated.current = true;  // 이후 호출 방지
                    const calcResp = await authApi.post(
                        `/estimates/owner/drafts/${estimateNo}/calculate-and-save-final`
                    );
                    setFinalTotal(calcResp.data.data.finalTotal);
                }

                // owner drafts 기본 정보만 가져오기
                const draftResp = await authApi.get<EstimateFinalCheckResponse>(
                    `/estimates/owner/drafts/${estimateNo}`
                );

                // [수정] 3) 이름 맵 생성: items 배열에서 ID->이름 매핑
                const nameMap: Record<number, string> = draftResp.data.data.items.reduce(
                    (acc, cur) => ({ ...acc, [cur.itemTypeId]: cur.itemTypeName }),
                    {}
                );

                // 3) view estimate 상세 정보 (itemPriceDetails, extraCharges, totalPrice)
                const viewResp = await authApi.get<EstimateFinalCheckResponse>(
                    `/view/stores/${storeId}/estimates/${estimateNo}`
                );

                // 4) 두 응답을 머지해서 state에 저장
                const mergedData = {
                    ...draftResp.data,
                    data: {
                        ...draftResp.data.data,
                        // viewResp쪽 data로 덮어쓰기
                        itemPriceDetails: viewResp.data.data.itemPriceDetails,
                        extraCharges: viewResp.data.data.extraCharges,
                        truckTotalPrice: viewResp.data.data.truckTotalPrice, // viewResp의 데이터 사용
                        totalPrice: viewResp.data.data.totalPrice,
                        nameMap,
                    }
                };
                console.log('merged truckTotalPrice:', mergedData.data.truckTotalPrice);
                setEstimateData(mergedData);

                setError(null);
            } catch (err) {
                console.error(err);
                setError('데이터 로딩 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        loadAll();
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
        boxCount: estimateData.data.boxCount || 0,
        leftoverBoxCount: estimateData.data.leftoverBoxCount ?? 0,
        truckCount: estimateData.data.truckCount,
        truckTotalPrice: estimateData.data.truckTotalPrice,
        ownerMessage: estimateData.data.ownerMessage,
        // itemCount: estimateData.data.items.length,
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
        // API 호출 생략
        router.push('/estimate/owner/publiclist');
    }

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


    // 시간/거리 포맷팅 헬퍼
    const formattedTime = duration != null
        ? `${Math.floor(duration / 60)}분`
        : "- 분";
    const formattedDist = distance != null
        ? `${(distance / 1000).toFixed(1)}km`
        : "- km";


    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto py-8 px-4">
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

                        {/* 짐 박스, 짐 목록 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className={PILL_CLASS}>
                                <span className="flex-1 text-sm text-gray-600">짐 박스</span>
                                <div className="text-blue-600 underline text-sm bg-transparent outline-none">
                                    {reviewData.boxCount}
                                </div>
                            </div>
                            <div className={PILL_CLASS}>
                                <span className="flex-1 text-sm text-gray-600">잔짐 박스</span>
                                <div className="text-blue-600 underline text-sm">
                                    {reviewData.leftoverBoxCount}
                                </div>
                            </div>
                        </div>

                        {/* 지도 */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="text-sm font-semibold text-gray-900 mb-2">최적 경로 추천</div>
                            <KakaoMapRoute
                                estimateNo={reviewData.estimateNo}
                                onStatus={(duration, distance) => {
                                    setDuration(duration);
                                    setDistance(distance);
                                }}
                            />

                            <div className="flex gap-4 mt-2 text-sm text-gray-700">
                                <div>예상 시간 : <span className="font-semibold">{formattedTime}</span></div>
                                <div>예상 거리 : <span className="font-semibold">{formattedDist}</span></div>
                            </div>
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

                                            {/* ─── 여기서 extraCharges만 무조건 출력 ─── */}
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
                                    {finalTotal !== null ? finalTotal.toLocaleString() : '계산 중...'}원
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

                        {/* 버튼 */}
                        <div className="flex gap-2">
                            <Button
                                className="flex-1 h-14 bg-blue-500 text-white"
                                onClick={handleSubmit}
                            >
                                제출하기
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}