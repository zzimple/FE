"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import KakaoMapRoute from "@/components/kakao/KakaoMapRoute ";
import { useRouter, useSearchParams } from 'next/navigation'; // [수정] useParams 추가
import { authApi } from "@/lib/axios";
import axios from "axios";


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

interface Item {
    id: number;                // 아이템 ID
    itemTypeId: number;        // 아이템 타입 ID
    itemTypeName: string;      // 아이템 이름
    category: 'APPLIANCE' | 'FURNITURE' | 'OTHER';
    quantity: number;          // 수량
    type: string | null;       // 타입
    width: string | null;      // 너비
    height: string | null;     // 높이
    depth: string | null;      // 깊이
    material: string | null;   // 재질
    size: string | null;       // 크기
    shape: string | null;      // 형태
    capacity: string | null;   // 용량
    doorCount: string | null;  // 문 개수
    unitCount: string | null;  // 유닛 개수
    frame: string | null;      // 프레임
    hasGlass: boolean;         // 유리 유무
    foldable: boolean;         // 접이식 유무
    hasWheels: boolean;        // 바퀴 유무
    hasPrinter: boolean;       // 프린터 유무
    purifierType: string | null; // 정수기 타입
    specialNote: string | null;  // 특이사항
}

interface EstimateResponse {
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
        estimatedCost?: number;    // 예상 비용
        finalPrice?: number;       // 최종 가격
    };
}

// 카테고리별 아이템 개수 계산 함수
const getCategoryCounts = (items: Item[]): Record<string, number> => {
    return items.reduce((acc, item) => {
        const category = item.category === 'APPLIANCE' ? '가전' :
            item.category === 'FURNITURE' ? '가구' : '기타';
        acc[category] = (acc[category] || 0) + item.quantity;
        return acc;
    }, {} as Record<string, number>);
};

// 아이템 세부사항을 문자열로 변환하는 함수
const getItemDetails = (item: Item): string[] => {
    const details: string[] = [];

    if (item.type) details.push(`타입: ${item.type}`);
    if (item.width && item.height && item.depth) {
        details.push(`크기: ${item.width} x ${item.height} x ${item.depth}`);
    }
    if (item.material) details.push(`재질: ${item.material}`);
    if (item.size) details.push(`사이즈: ${item.size}`);
    if (item.shape) details.push(`형태: ${item.shape}`);
    if (item.capacity) details.push(`용량: ${item.capacity}`);
    if (item.doorCount) details.push(`문 개수: ${item.doorCount}`);
    if (item.unitCount) details.push(`수납장 개수: ${item.unitCount}`);
    if (item.frame) details.push(`프레임: ${item.frame}`);
    if (item.hasGlass) details.push('유리 포함');
    if (item.foldable) details.push('접이식');
    if (item.hasWheels) details.push('바퀴 있음');
    if (item.hasPrinter) details.push('프린터 포함');
    if (item.purifierType) details.push(`정수기 타입: ${item.purifierType}`);
    if (item.specialNote) details.push(`특이사항: ${item.specialNote}`);

    return details;
};

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

export default function Step8() {
    // 상태 관리
    const [cost, setCost] = useState("");                    // 예상 비용
    const [truckCount, setTruckCount] = useState("");        // 트럭 개수
    const [ownerNote, setOwnerNote] = useState("");          // 사장님 전달사항
    const [boxCount, setBoxCount] = useState(5);             // 박스 개수
    const [estimateData, setEstimateData] = useState<EstimateResponse | null>(null); // API 데이터
    const [isLoading, setIsLoading] = useState(true);        // 로딩 상태
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<'가구' | '가전' | '기타' | '전체'>('전체');


    const router = useRouter();

    const searchParams = useSearchParams();
    const estimateNo = parseInt(searchParams.get("estimateNo") ?? "", 10); // 쿼리스트링에서 추출

    const [duration, setDuration] = useState<number | null>(null);   // ← 추가
    const [distance, setDistance] = useState<number | null>(null);   // ← 추가

    const [estimatedCost, setEstimatedCost] = useState<number>(0);

    // API 데이터 가져오기
    useEffect(() => {
        if (isNaN(estimateNo)) { // [수정] 잘못된 번호 방어 로직 추가
            setError('잘못된 견적서 번호입니다.');
            setIsLoading(false);
            return;
        }

        const fetchEstimateData = async () => {
            try {
                const response = await authApi.get<EstimateResponse>(`/estimates/owner/drafts/${estimateNo}`);
                console.log("🔥 moveDate:", response.data.data.moveDate);
                console.log("🔥 moveTime:", response.data.data.moveTime);
                setEstimateData(response.data);
                setError(null);
            } catch (error) {
                console.error('견적서 데이터 조회 실패:', error);
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 403) {
                        setError('견적서를 조회할 권한이 없습니다.');
                    } else if (error.response?.status === 401) {
                        setError('로그인이 필요합니다.');
                    } else {
                        setError('견적서 데이터를 불러오는데 실패했습니다.');
                    }
                } else {
                    setError('알 수 없는 오류가 발생했습니다.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        // 예상비용 자동 조회 추가
        const fetchEstimatedCost = async () => {
            try {
                const res = await authApi.post(`/estimates/owner/drafts/${estimateNo}/items/item-total`);
                const items = res.data.data.items || [];
                const total = items.reduce((sum: number, item: any) => sum + (item.itemTotal || 0), 0);
                setEstimatedCost(total);
                console.log("🔥 estimatedCost:", estimatedCost);
            } catch {
                setEstimatedCost(0);
            }
        };

        fetchEstimateData();
        fetchEstimatedCost(); // 🚩 예상비용 자동 호출 추가
    }, [estimateNo]);

    // ===== 데이터 변환 =====
    const reviewData = estimateData ? {
        serviceType: estimateData.data.moveType === "SMALL" ? "가정이사" : "사무실이사",
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
        itemCount: estimateData.data.items.length,
        memo: estimateData.data.customerMemo,
        notes: NOTES,
        items: estimateData.data.items,
        estimatedCost: estimateData.data.estimatedCost || 0,
        finalPrice: estimateData.data.finalPrice || 0,
    } : null;

    // ===== 이벤트 핸들러 =====
    const handleSubmit = async () => {
        if (!cost || !truckCount) {
            alert('예상 비용과 트럭 개수를 입력해주세요.');
            return;
        }

        try {
            const response = await authApi.post('/estimates/submit', {
                estimateNo: estimateData!.data.estimateNo,
                cost: parseInt(cost),
                truckCount: parseInt(truckCount),
                ownerNote,
            });

            if (response.data.success) {
                alert('견적서가 성공적으로 제출되었습니다.');
                router.push('/estimate/complete');
            } else {
                alert('견적서 제출에 실패했습니다.');
            }
        } catch (err) {
            console.error('견적서 제출 중 오류가 발생했습니다:', err);
            alert('견적서 제출 중 오류가 발생했습니다.');
        }
    };

    const handleCancel = () => {
        if (confirm('견적서 작성을 취소하시겠습니까? 입력하신 내용은 저장되지 않습니다.')) {
            router.push('/estimate/owner/publiclist');
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

                    {/* 물품 카테고리별 개수 */}
                    <div className="space-y-1">
                        <div className="text-sm font-semibold text-gray-900">물품 카테고리</div>
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
                                        ({getCategoryCounts(reviewData.items)[category] || 0})
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 물품 상세 목록 */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="text-sm font-semibold text-gray-900 mb-2">물품 상세 목록</div>
                        <div className="space-y-3">
                            {reviewData.items
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
                    <div className="space-y-3">
                        <div>
                            <div className="flex items-center mb-1">
                                <span className="text-sm font-semibold text-gray-900">짐 목록 예상 비용</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    className="!h-6 px-2 whitespace-nowrap"
                                    type="button"
                                    onClick={() => router.push(`/estimate/step8/bill?estimateNo=${estimateNo}`)}
                                >
                                    책정하기
                                </Button>
                                <div className={PILL_CLASS}>
                                    <span className="flex-1 text-sm text-gray-600">예상 비용</span>
                                    <div className="text-blue-600 font-semibold text-sm">
                                        {estimatedCost?.toLocaleString()}원
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-900 mb-1">트럭 개수</div>
                            <div className="px-3 border rounded-lg">
                                <select
                                    className="w-full pr-3 py-2 text-sm select-none outline-0"
                                    value={truckCount}
                                    onChange={e => setTruckCount(e.target.value)}
                                >
                                    <option value="">트럭 개수를 선택하세요</option>
                                    {[...Array(10)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-900 mb-1">+ 사장님 전달사항</div>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                                placeholder="추가 요청사항을 입력하세요"
                                value={ownerNote}
                                onChange={e => setOwnerNote(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 최종 가격 정보 */}
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="text-sm font-semibold text-blue-900 mb-2">최종 가격 정보</div>
                        <div className="text-lg font-bold text-blue-600">
                            {reviewData.finalPrice?.toLocaleString()}원
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                            * 예상 비용과 최종 가격은 서비스 옵션에 따라 변동될 수 있습니다.
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
                            className="flex-1 h-14 bg-gray-500 text-white"
                            onClick={handleCancel}
                        >
                            작성 안 할래요
                        </Button>
                        <Button
                            className="flex-1 h-14 bg-blue-500 text-white"
                            onClick={handleSubmit}
                        >
                            작성 완료
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function setError(arg0: null) {
    throw new Error("Function not implemented.");
}
