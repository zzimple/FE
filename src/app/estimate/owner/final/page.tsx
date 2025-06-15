"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import KakaoMapRoute from "@/components/kakao/KakaoMapRoute ";
import { useRouter, useSearchParams } from 'next/navigation'; 
import type { Address, DetailInfo, Item } from '@/types/estimate';
import { getCategoryCounts, getItemDetailsNoFrame, formatMoveDateTime, NOTES, formatAddressInfo } from '@/utils/estimateHelpers';

import { authApi } from "@/lib/axios";
import axios from "axios";

interface EstimateFinalResponse {
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

interface ExtraCharge {
    amount: number;
    reason: string;
}

const PILL_CLASS = "flex items-center h-12 px-4 gap-2 rounded-full border border-gray-300 bg-white w-full";

export default function EstimateFinalPage() {
    // 상태 관리
    const [cost, setCost] = useState("");                    // 예상 비용
    const [truckCount, setTruckCount] = useState("");        // 트럭 개수
    const [ownerMessage, setOwnerMessage] = useState("");          // 사장님 전달사항
    const [boxCount, setBoxCount] = useState(5);             // 박스 개수
    const [estimateData, setEstimateData] = useState<EstimateFinalResponse | null>(null); // API 데이터
    const [isLoading, setIsLoading] = useState(true);        // 로딩 상태
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<'가구' | '가전' | '기타' | '전체'>('전체');

    const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);
    const [newChargeAmount, setNewChargeAmount] = useState("");
    const [newChargeReason, setNewChargeReason] = useState("");

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
                const response = await authApi.get<EstimateFinalResponse>(`/estimates/owner/drafts/${estimateNo}`);
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

        const fetchEstimatedCost = async () => {
            try {
                const res = await authApi.post(`/estimates/owner/drafts/${estimateNo}/items/item-total`);
                const items = res.data.data.items || [];
                const total = items.reduce((sum: number, item: any) => sum + (item.itemTotal || 0), 0);
                setEstimatedCost(total); // ✅ set 후 바로 console 찍어도 값은 이전 값일 수 있음
            } catch {
                setEstimatedCost(0);
            }
        };

        fetchEstimateData();
        fetchEstimatedCost();
    }, [estimateNo]);

    // ✅ 실시간 반영 여부 확인용 로그 추가
    useEffect(() => {
        console.log("🔁 estimatedCost updated:", estimatedCost);
    }, [estimatedCost]);

    // ===== 데이터 변환 =====
    const reviewData = estimateData ? {
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
        itemCount: estimateData.data.items.length,
        memo: estimateData.data.customerMemo,
        notes: NOTES,
        items: estimateData.data.items,
        estimatedCost: estimateData.data.estimatedCost || 0,
        finalPrice: estimateData.data.finalPrice || 0,
    } : null;

    // ===== 이벤트 핸들러 =====
    const handleSubmit = async () => {
        if (!truckCount) {
            alert('트럭 개수를 입력해주세요.');
            return;
        }

        try {
            const response = await authApi.post(`/estimates/owner/drafts/${estimateNo}/save-owner-input`,
                {
                    estimateNo,
                    truckCount: Number(truckCount),
                    ownerMessage,
                    extraCharges
                }
            );

            if (response.data.success) {
                router.push(`/estimate/owner/final/check?estimateNo=${estimateNo}`);
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

    // 추가금 추가 핸들러
    const handleAddExtraCharge = () => {
        if (!newChargeAmount || !newChargeReason) {
            alert('추가금 금액과 사유를 모두 입력해주세요.');
            return;
        }

        const amount = parseInt(newChargeAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('유효한 금액을 입력해주세요.');
            return;
        }

        setExtraCharges([...extraCharges, { amount, reason: newChargeReason }]);
        setNewChargeAmount("");
        setNewChargeReason("");
    };

    // 추가금 삭제 핸들러
    const handleRemoveExtraCharge = (index: number) => {
        setExtraCharges(extraCharges.filter((_, i) => i !== index));
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
                    <div className="space-y-4">
                        {/* 기존 입력 필드들 */}
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center mb-1">
                                    <span className="text-sm font-semibold text-gray-900">짐 목록 예상 비용</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        className="!h-6 px-2 whitespace-nowrap"
                                        type="button"
                                        onClick={() => router.push(`/estimate/owner/final/bill?estimateNo=${estimateNo}`)}
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
                                <div className="text-sm font-semibold text-gray-900 mb-1">사장님 전달사항</div>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                    placeholder="추가 요청사항을 입력하세요"
                                    value={ownerMessage}
                                    onChange={e => setOwnerMessage(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 추가금 입력 섹션 */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900">추가금 항목</h3>
                                <div className="text-sm text-gray-500">
                                    총 {extraCharges.reduce((sum, charge) => sum + charge.amount, 0).toLocaleString()}원
                                </div>
                            </div>

                            {/* 추가금 입력 폼 */}
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg px-3 py-2 text-sm"
                                        placeholder="추가금 사유"
                                        value={newChargeReason}
                                        onChange={e => setNewChargeReason(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        className="w-full border rounded-lg px-3 py-2 text-sm"
                                        placeholder="금액"
                                        value={newChargeAmount}
                                        onChange={e => setNewChargeAmount(e.target.value)}
                                    />
                                </div>
                                <Button
                                    className="!h-10 px-4 whitespace-nowrap"
                                    onClick={handleAddExtraCharge}
                                >
                                    추가
                                </Button>
                            </div>

                            {/* 추가금 목록 */}
                            <div className="space-y-2">
                                {extraCharges.map((charge, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">{charge.reason}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-blue-600">
                                                {charge.amount.toLocaleString()}원
                                            </span>
                                            <button
                                                onClick={() => handleRemoveExtraCharge(index)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
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
                            className="flex-1 h-14 bg-gray-500 text-white"
                            onClick={handleCancel}
                        >
                            작성 안 할래요
                        </Button>
                        <Button
                            className="flex-1 h-14 bg-blue-500 text-white"
                            onClick={handleSubmit}
                        >
                            최종 확인
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
