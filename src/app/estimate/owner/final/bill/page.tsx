"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/axios";
import OwnerHeader from "@/components/headers/OwnerHeader";
import axios from "axios";

// 타입 정의
interface EstimateItem {
    itemTypeId: number;
    name: string;
    category: string;
}

interface ExtraCharge {
    reason: string;
    amount: number;
}

interface PriceItem {
    itemTypeId: number;
    basePrice: number;
    extraCharges: {
        amount: number;
        reason: string;
    }[];
}

// 기본 단가 불러오기 API 응답 타입 추가
interface DefaultPriceResponse {
    success: boolean;
    message: string;
    data: Array<{
        itemTypeId: number;
        itemTypeName: string;
        basePrice: number;
    }>;
}

// API 응답 타입 정의
interface PriceResponse {
    success: boolean;
    message: string;
    data: {
        totalAmount: number;
        items: PriceItem[];
    };
}

interface ApiItem {
    itemTypeId: number;
    itemTypeName: string;
    category: string;
}

// 가격 저장 API
async function savePrices(estimateNo: number, items: PriceItem[]): Promise<PriceResponse> {
    try {
        const response = await authApi.post(`/estimates/owner/drafts/${estimateNo}/items`,
            items.map(item => ({
                itemTypeId: item.itemTypeId,
                quantity: 1,
                basePrice: item.basePrice,
                extraCharges: item.extraCharges || []
            }))
        );
        return response.data;
    } catch (error) {
        console.error("가격 저장 실패:", error);
        throw error;
    }
}

const CATEGORY_ORDER = ["가구", "가전", "기타"] as const;

// 카테고리 매핑 추가
const CATEGORY_MAP: { [key: string]: string } = {
    "FURNITURE": "가구",
    "APPLIANCE": "가전",
    "OTHER": "기타"
};

const getImagePath = (category: string, name: string): string => {
    const categoryMap: { [key: string]: string } = {
        "가구": "furniture",
        "가전": "appliance",
        "기타": "other"
    };
    const nameMap: { [key: string]: string } = {
        "침대": "Bed",
        "쇼파": "Sofa",
        "옷장-단품": "WardrobeSing",
        "옷장-연결장": "WardrobeSing",
        "행거": "Hanger",
        "시스템 행거": "SystemHanger",
        "화장대": "DressingTable",
        "수납장/서랍장": "Drawer",
        "진열장": "Display",
        "선반": "Shelf",
        "거실장/TV장": "TvCabinet",
        "책장": "Bookshelf",
        "책상": "Desk",
        "테이블/식탁": "DiningTable",
        "의자": "Chair",
        // 가전
        "TV": "Tv",
        "모니터": "Moniter",
        "PC/데스크탑": "Pc",
        "세탁기": "WashingMachine",
        "건조기": "Dryer",
        "청소기": "VacuumCleaner",
        "의류관리기": "ClothingCare",
        "냉장고": "Refrigerator",
        "전자레인지": "Microwave",
        "가스레인지": "GasStove",
        "정수기": "WaterPurifier",
        "에어컨": "Aircon",
        "공기청정기": "AirPurifier",
        "선풍기": "Fan",
        "안마의자": "MassageChair",
        // 기타
        "거울": "Mirror",
        "커튼": "Curtain",
        "빨래 건조대": "DryingRack",
        "캐리어": "Carrier",
        "운동용품": "Fitness",
        "책": "Book",
        "화분": "PlantPot",
        "비데": "Bidet",
        "조명기구": "Light"
    };
    const folder = categoryMap[category] || "other";
    const fileName = nameMap[name] || "default";
    return `/icons/${folder}/${fileName}.jpeg`;
};

// ✨ 수정: 페이지 로직을 담당할 내부 컴포넌트 생성
function BillPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const estimateNo = parseInt(searchParams.get("estimateNo") ?? "", 10);

    const [items, setItems] = useState<EstimateItem[]>([]);
    const [priceMap, setPriceMap] = useState<{ [id: number]: number }>({});
    const [extraChargeMap, setExtraChargeMap] = useState<{ [id: number]: ExtraCharge }>({});
    const [showExtra, setShowExtra] = useState<{ [id: number]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [estimatedCost, setEstimatedCost] = useState(0);


    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const response = await authApi.get(`/estimates/owner/${estimateNo}/items`);
                const items = response.data.data?.items || [];

                setItems(
                    items.map((item: ApiItem) => ({
                        itemTypeId: item.itemTypeId,
                        name: item.itemTypeName,
                        category: CATEGORY_MAP[item.category] || "기타",
                    }))
                );
            } catch (error) {
                console.error("짐 목록 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!isNaN(estimateNo)) {
            fetchItems();
        }
    }, [estimateNo]);

    const handleLoadPrices = async () => {
        try {
            const response = await authApi.get(`/estimates/owner/with-extra/${estimateNo}`);
            const data = response.data.data;

            const newPriceMap: { [id: number]: number } = {};
            const newExtraChargeMap: { [id: number]: ExtraCharge } = {};
            const newShowExtra: { [id: number]: boolean } = {};

            data.forEach((item: {
                estimateNo: number;
                itemTypeId: number;
                itemTypeName: string;
                moveItemCategory: string;
                basePrice: number;
                extraCharge: number;
                reason: string;
            }, index: number) => {
                console.log(`�� [handleLoadPrices] 아이템 ${index + 1}:`, item);

                // ✅ basePrice 필드 사용
                newPriceMap[item.itemTypeId] = item.basePrice || 0;

                // ✅ reason과 extraCharge 필드 사용
                const reason = item.reason || "";
                const amount = item.extraCharge || 0;

                newExtraChargeMap[item.itemTypeId] = { reason, amount };
                // ✅ 추가금이 있을 때만 showExtra를 true로 설정
                newShowExtra[item.itemTypeId] = reason.length > 0 && amount > 0;
            });

            console.log("�� [handleLoadPrices] 새로운 priceMap:", newPriceMap);
            console.log("�� [handleLoadPrices] 새로운 extraChargeMap:", newExtraChargeMap);
            console.log("�� [handleLoadPrices] 새로운 showExtra:", newShowExtra);

            setPriceMap(newPriceMap);
            setExtraChargeMap(newExtraChargeMap);
            setShowExtra(newShowExtra);

            // ✅ 성공 메시지 추가
            alert("이전 입력을 성공적으로 가져왔습니다.");

        } catch (e) {
            console.error("❌ [handleLoadPrices] 가격 불러오기 실패", e);

            if (axios.isAxiosError(e)) {
                console.error("❌ [handleLoadPrices] 에러 상태:", e.response?.status);
                console.error("❌ [handleLoadPrices] 에러 메시지:", e.response?.data);

                if (e.response?.status === 404) {
                    alert("이전 입력 데이터를 찾을 수 없습니다.");
                } else if (e.response?.status === 403) {
                    alert("이전 입력 데이터에 접근할 권한이 없습니다.");
                } else {
                    alert(`단가 정보를 불러오지 못했습니다. (${e.response?.status})`);
                }
            } else {
                alert("단가 정보를 불러오지 못했습니다.");
            }
        }
    };

    // 기본 단가 불러오기 함수 추가
    const handleLoadDefaultPrices = async () => {
        try {
            const response = await authApi.get<DefaultPriceResponse>('/owner/my/estimate/default-prices');
            if (response.data.success) {
                const newPriceMap = { ...priceMap };
                response.data.data.forEach(item => {
                    newPriceMap[item.itemTypeId] = item.basePrice;
                });
                setPriceMap(newPriceMap);
                alert('기본 단가를 불러왔습니다.');
            }
        } catch (error) {
            console.error('기본 단가 불러오기 실패:', error);
            alert('기본 단가를 불러오는데 실패했습니다.');
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const itemsPayload: PriceItem[] = Object.entries(priceMap).map(([id, basePrice]) => {
                const itemTypeId = parseInt(id);
                const extra = extraChargeMap[itemTypeId];
                return {
                    itemTypeId,
                    basePrice,
                    extraCharges: showExtra[itemTypeId] && extra?.reason && extra?.amount > 0
                        ? [{ amount: extra.amount, reason: extra.reason }]
                        : []
                };
            });

            const response = await savePrices(estimateNo, itemsPayload);
            if (!response.success) {
                alert("가격 저장 실패: " + response.message);
                return;
            }

            // [🆕 추가] 저장 성공 후 item-total API 호출
            const itemTotalRes = await authApi.post(`/estimates/owner/drafts/${estimateNo}/items/item-total`);
            const itemTotalData = itemTotalRes.data;

            if (!itemTotalData.success) {
                alert("총 금액 계산 실패: " + itemTotalData.message);
                return;
            }

            // [🆕 추가] 총 금액 계산
            const amount = itemTotalData.data?.items?.reduce((sum: number, item: any) => {
                return sum + (item.itemTotal || item.total || item.price || 0);
            }, 0) || 0;

            // [🆕 추가] storeId 추출
            const storeId = itemTotalData.data?.storeId;

            // [🆕 추가] 최종 페이지로 이동
            router.push(`/estimate/owner/final?estimateNo=${estimateNo}&amount=${amount}&storeId=${storeId}`);

        } catch (error) {
            console.error("가격 저장 중 오류 발생:", error);
            alert("가격 저장 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const grouped: { [cat: string]: EstimateItem[] } = {};
    items.forEach((item) => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
    });

    useEffect(() => {
        const calculateTotal = () => {
            let total = 0;
            items.forEach(item => {
                total += priceMap[item.itemTypeId] || 0;
                if (showExtra[item.itemTypeId]) {
                    total += extraChargeMap[item.itemTypeId]?.amount || 0;
                }
            });
            setTotalAmount(total);
        };
        calculateTotal();
    }, [priceMap, extraChargeMap, showExtra, items]);

    return (
        <div className="min-h-screen bg-gray-50 font-pretendard">
            <OwnerHeader />

            <main className="pt-24 pb-40">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    품목별 비용 산정
                </h2>

                <div className="px-4 flex justify-center gap-4 mb-8">
                    <button
                        onClick={handleLoadDefaultPrices}
                        className="flex-grow sm:flex-grow-0 px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        기본 단가 불러오기
                    </button>
                    {/* <button
                        onClick={handleLoadPrices}
                        className="flex-grow sm:flex-grow-0 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        이전 입력 가져오기
                    </button> */}
                </div>

                <div className="px-4 space-y-4">
                    {loading && <div className="text-center py-8">로딩 중...</div>}
                    {!loading && items.length === 0 && <div className="text-center py-12 text-gray-500">등록된 짐이 없습니다.</div>}

                    {!loading && CATEGORY_ORDER.map((cat) =>
                        grouped[cat] && grouped[cat].length > 0 ? (
                            <div key={cat} className="space-y-3">
                                <h3 className="text-lg font-semibold text-gray-900 px-1">{cat}</h3>
                                {grouped[cat].map((item) => (
                                    <div key={item.itemTypeId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                                    <Image
                                                        src={getImagePath(item.category, item.name)}
                                                        alt={item.name}
                                                        width={64}
                                                        height={64}
                                                        className="object-cover w-full h-full"
                                                        onError={(e) => { e.currentTarget.src = "/icons/placeholder.jpeg"; }}
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="text-base font-semibold text-gray-800">{item.name}</div>
                                                    <div className="text-sm text-gray-500">{item.category}</div>
                                                </div>
                                            </div>

                                            <div className="flex-grow w-full">
                                                <div className="flex flex-col sm:flex-row gap-2 w-full">
                                                    <div className="relative flex-grow">
                                                        <input
                                                            type="number"
                                                            placeholder="기본 비용"
                                                            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                            value={priceMap[item.itemTypeId] || ''}
                                                            onChange={(e) => setPriceMap(prev => ({ ...prev, [item.itemTypeId]: parseInt(e.target.value) || 0 }))}
                                                        />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
                                                    </div>
                                                    <button
                                                        className="h-12 px-4 text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                                                        onClick={() => setShowExtra(prev => ({ ...prev, [item.itemTypeId]: !prev[item.itemTypeId] }))}
                                                    >
                                                        {showExtra[item.itemTypeId] ? '추가금 닫기' : '추가금 열기'}
                                                    </button>
                                                </div>

                                                {showExtra[item.itemTypeId] && (
                                                    <div className="mt-2 flex flex-col sm:flex-row gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="추가금 사유"
                                                            className="flex-grow h-12 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                                                            value={extraChargeMap[item.itemTypeId]?.reason || ''}
                                                            onChange={(e) => setExtraChargeMap(prev => ({ ...prev, [item.itemTypeId]: { ...prev[item.itemTypeId], reason: e.target.value, amount: prev[item.itemTypeId]?.amount || 0 } }))}
                                                        />
                                                        <div className="relative flex-grow">
                                                            <input
                                                                type="number"
                                                                placeholder="추가 금액"
                                                                className="w-full h-12 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                                                                value={extraChargeMap[item.itemTypeId]?.amount || ''}
                                                                onChange={(e) => setExtraChargeMap(prev => ({ ...prev, [item.itemTypeId]: { ...prev[item.itemTypeId], amount: parseInt(e.target.value) || 0, reason: prev[item.itemTypeId]?.reason || '' } }))}
                                                            />
                                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">원</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null
                    )}
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-top z-10">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-gray-800">총 합계</span>
                        <span className="text-xl font-bold text-blue-600">
                            {totalAmount ? totalAmount.toLocaleString() : 0}원
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.back()}
                            className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                        >
                            계속 작성하기
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                            저장하기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ✨ 수정: export default 컴포넌트는 Suspense로 내부 컴포넌트를 감싸는 역할만 하도록 변경
export default function EstimatePriceByEstimateId() {
    return (
        <Suspense fallback={<div className="text-center py-10">페이지를 불러오는 중입니다...</div>}>
            <BillPageContent />
        </Suspense>
    );
}