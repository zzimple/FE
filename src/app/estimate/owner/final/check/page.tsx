"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import KakaoMapRoute from "@/components/kakao/KakaoMapRoute ";
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from "@/lib/axios";

// API 응답 데이터 타입 정의
interface Address {
    roadFullAddr: string;      // 전체 도로명 주소
    roadAddrPart1: string;     // 도로명 주소 기본
    zipNo: string;             // 우편번호
    entX: string;              // 입구 X좌표
    entY: string;              // 입구 Y좌표
    addrDetail: string;        // 상세주소
}

interface DetailInfo {
    buildingType: 'VILLA' | 'APARTMENT' | 'HOUSE' | 'OFFICETEL' | 'COMMERCIAL';
    roomStructure: 'ONE_ROOM' | 'ONE_HALF_ROOM' | 'TWO_ROOM' | 'THREE_ROOM_OR_MORE';
    sizeOption: string;        // 평수 옵션
    floor: number;             // 층수
    hasStairs: boolean;        // 계단 유무
    hasParking: boolean;       // 주차장 유무
    elevator: boolean;         // 엘리베이터 유무
}

interface ExtraCharge {
    reason: string;
    amount: number;
}

interface ItemPriceDetail {
    itemTypeId: number;
    quantity: number;
    basePrice: number;
    extraCharges: ExtraCharge[];
}

interface EstimateResponse {
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
        ownerMessage: string;
        itemPriceDetails: ItemPriceDetail[];
        extraCharges: ExtraCharge[];
        totalPrice: number;
    };
}

// 날짜/시간 포맷팅 함수
const formatMoveDateTime = (moveDate?: string, moveTime?: string): string => {
    if (!moveDate || !moveTime) return "";

    // 1) 날짜 포맷 (YYYYMMDD → YYYY.MM.DD)
    const year = moveDate.slice(0, 4);
    const month = moveDate.slice(4, 6);
    const day = moveDate.slice(6, 8);
    const formattedDate = `${year}.${month}.${day}`;

    // 2) 시간 문자열 추출
    // ISO (T) 또는 공백 둘 다 처리, 밀리세컨드 제거
    let rawTime: string;
    if (moveTime.includes("T")) {
        rawTime = moveTime.split("T")[1];
    } else {
        rawTime = moveTime.split(" ")[1] || moveTime;
    }
    rawTime = rawTime.split(".")[0]; // "14:00:00"

    // 3) 시:분만 취하기
    const [hourStr, minuteStr] = rawTime.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = minuteStr.padStart(2, "0");

    // 4) 오전/오후 + 12h→12h 변환
    const ampm = hour < 12 ? "오전" : "오후";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${formattedDate} ${ampm} ${displayHour}:${minute}`;
};

// ===== 상수 =====
const NOTES = [
    "사전에 협의되지 않은 항목은 서비스 당일 추가금이 발생할 수 있습니다.",
    "견적 요청 후 24시간 동안 견적서를 받습니다.",
    "제출 후 내용을 수정할 수 없습니다.",
];

const PILL_CLASS = "flex items-center h-12 px-4 gap-2 rounded-full border border-gray-300 bg-white w-full";

const formatAddressInfo = (detailInfo: DetailInfo): string => {
    const elevatorLabel = detailInfo.elevator ? "O" : "X";
    return [
        detailInfo.buildingType,        // 건물 타입 (VILLA 등)
        detailInfo.sizeOption,          // 평수 옵션
        `${detailInfo.floor}층`,        // 층수
        `엘리베이터 ${elevatorLabel}`   // 🚨 엘리베이터 정보 추가
    ].join(" | ");
};

export default function EstimateFinalPage() {
    // 상태 관리
    const [estimateData, setEstimateData] = useState<EstimateResponse | null>(null); // API 데이터
    const [isLoading, setIsLoading] = useState(true);        // 로딩 상태
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<'가구' | '가전' | '기타' | '전체'>('전체');
    const [duration, setDuration] = useState<number | null>(null);
    const [distance, setDistance] = useState<number | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const estimateNo = parseInt(searchParams.get("estimateNo") ?? "", 10);

    // API 데이터 가져오기
    useEffect(() => {
        if (isNaN(estimateNo)) {
            setError('잘못된 견적서 번호입니다.');
            setIsLoading(false);
            return;
        }

        const fetchEstimateData = async () => {
            try {
                const response = await authApi.get<EstimateResponse>(`/view/estimate/${estimateNo}`);
                console.log("🔥 견적서 불러오기 완료:", response.data);
                setEstimateData(response.data);
                setError(null);
            } catch (e) {
                console.error("견적서 조회 실패:", e);
                setError('견적서 정보를 불러오지 못했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEstimateData();
    }, [estimateNo]);

    // ===== 데이터 변환 =====
    const reviewData = estimateData ? {
        serviceType: estimateData.data.moveType === "SMALL" ? "가정이사" : "사무실이사",
        dateTime: formatMoveDateTime(estimateData.data.moveDate),
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
        boxCount: 0, // API 응답에 없음
        leftoverBoxCount: 0, // API 응답에 없음
        truckCount: estimateData.data.truckCount,
        ownerMessage: estimateData.data.ownerMessage,
        itemCount: estimateData.data.itemPriceDetails.length,
        memo: estimateData.data.customerMemo,
        notes: NOTES,
        extraCharges: estimateData.data.extraCharges,
        itemPriceDetails: estimateData.data.itemPriceDetails,
        finalPrice: estimateData.data.totalPrice,
        storeName: estimateData.data.storeName,
        ownerName: estimateData.data.ownerName,
        ownerPhone: estimateData.data.ownerPhone
    } : null;

    // ===== 이벤트 핸들러 =====
    const handleSubmit = async () => {
        if (!estimateData) {
            alert('데이터를 불러오지 못했습니다.');
            return;
        }

        try {
            const response = await authApi.post('/estimates/submit', {
                estimateNo: estimateData.data.estimateNo
            });

            if (response.data.success) {
                router.push('/estimate/complete');
            } else {
                alert('견적서 제출에 실패했습니다.');
            }
        } catch (err) {
            console.error('견적서 제출 중 오류가 발생했습니다:', err);
            alert('견적서 제출 중 오류가 발생했습니다.');
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

    // 시간/거리 포맷팅 헬퍼
    const formattedTime = duration != null
        ? `${Math.floor(duration / 60)}분`
        : "- 분";
    const formattedDist = distance != null
        ? `${(distance / 1000).toFixed(1)}km`
        : "- km";

    return (
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

                    {/* 물품 상세 목록 */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">물품 목록</h2>
                            <div className="flex gap-2">
                                {(['전체', '가구', '가전', '기타'] as const).map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full text-sm ${
                                            selectedCategory === category
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 아이템 목록 */}
                        {reviewData?.itemPriceDetails && reviewData.itemPriceDetails.length > 0 && (
                            <div className="space-y-4">
                                {reviewData.itemPriceDetails.map((detail, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">아이템 #{detail.itemTypeId}</span>
                                            <span className="text-sm text-gray-500">수량: {detail.quantity}개</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">기본 가격</span>
                                            <span className="font-medium">{detail.basePrice.toLocaleString()}원</span>
                                        </div>
                                        {detail.extraCharges && detail.extraCharges.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                {detail.extraCharges.map((charge, chargeIndex) => (
                                                    <div key={chargeIndex} className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-600">{charge.reason}</span>
                                                        <span className="font-medium">+{charge.amount.toLocaleString()}원</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
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
                            from={reviewData.from.coord}
                            to={reviewData.to.coord}
                            onStats={(d, m) => {
                                setDuration(d);
                                setDistance(m);
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
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">최종 가격 정보</h2>
                        <div className="space-y-4">
                            {/* 추가 요금 */}
                            {reviewData?.extraCharges && reviewData.extraCharges.length > 0 && (
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-medium mb-3">추가 요금 내역</h3>
                                    <div className="space-y-2">
                                        {reviewData.extraCharges.map((charge, index) => (
                                            <div key={index} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">{charge.reason}</span>
                                                <span className="font-medium">+{charge.amount.toLocaleString()}원</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 총액 */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">총액</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {reviewData?.finalPrice.toLocaleString()}원
                                    </span>
                                </div>
                            </div>
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
    );
}

