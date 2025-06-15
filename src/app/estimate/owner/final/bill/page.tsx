"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/axios";

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

interface DefaultPriceResponse {
    estimateNo: number;
    itemTypeId: number;
    itemTypeName: string;
    basePrice: number;
    extraCharge: number;
    reason: string;
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

export default function EstimatePriceByEstimateId() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const estimateNo = parseInt(searchParams.get("estimateNo") ?? "", 10);

    const [items, setItems] = useState<EstimateItem[]>([]);
    const [priceMap, setPriceMap] = useState<{ [id: number]: number }>({});
    const [extraChargeMap, setExtraChargeMap] = useState<{ [id: number]: ExtraCharge }>({});
    const [showExtra, setShowExtra] = useState<{ [id: number]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // 기본 단가와 추가금까지 한 번에 조회
    //             const response = await authApi.get(`/estimates/owner/with-extra/${estimateNo}`);
    //             console.log("API 응답 전체:", response.data);
    //             console.log("API 응답 데이터:", response.data.data);

    //             if (response.data.success && Array.isArray(response.data.data)) {
    //                 const estimateItems = response.data.data.map((item: {
    //                     itemTypeId: number;
    //                     itemTypeName: string;
    //                     moveItemCategory: string;
    //                     basePrice: number;
    //                     extraCharge: number;
    //                     reason: string;
    //                 }) => ({
    //                     itemTypeId: item.itemTypeId,
    //                     name: item.itemTypeName,
    //                     // moveItemCategory를 소문자로 변환하고 매핑된 카테고리로 변환
    //                     category: CATEGORY_MAP[item.moveItemCategory] || "기타"
    //                 }));
    //                 setItems(estimateItems);

    //                 const initPrices: { [id: number]: number } = {};
    //                 const initExtras: { [id: number]: ExtraCharge } = {};
    //                 const initShowExtra: { [id: number]: boolean } = {};

    //                 response.data.data.forEach((item: any) => {
    //                     initPrices[item.itemTypeId] = Number(item.basePrice) || 0;
    //                     initExtras[item.itemTypeId] = {
    //                         reason: item.reason || "",
    //                         amount: Number(item.extraCharge) || 0,
    //                     };
    //                     initShowExtra[item.itemTypeId] = Boolean(item.extraCharge && item.reason);
    //                 });

    //                 setPriceMap(initPrices);
    //                 setExtraChargeMap(initExtras);
    //                 setShowExtra(initShowExtra);
    //             } else {
    //                 console.warn("응답에 data 배열이 없음 또는 실패:", response.data);
    //             }


    //         } catch (error) {
    //             console.error("데이터 조회 실패:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     if (!isNaN(estimateNo)) {
    //         fetchData();
    //     }
    // }, [estimateNo]);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true); // ✅ 이거 추가!
            try {
                const response = await authApi.get(`/estimates/owner/${estimateNo}/items`);
                const items = response.data.data?.items || [];

                setItems(
                    items.map((item: any) => ({
                        itemTypeId: item.itemTypeId,
                        name: item.itemTypeName,
                        category: CATEGORY_MAP[item.category] || "기타",
                    }))
                );
            } catch (error) {
                console.error("짐 목록 불러오기 실패:", error);
            } finally {
                setLoading(false); // ✅ 실패해도 로딩 종료
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

            data.forEach((item: any) => {
                newPriceMap[item.itemTypeId] = item.basePrice || 0;

                const reason = item.reason || "";
                const amount = item.extraCharge || 0;

                newExtraChargeMap[item.itemTypeId] = { reason, amount };
                newShowExtra[item.itemTypeId] = reason.length > 0 && amount > 0;
            });

            setPriceMap(newPriceMap);
            setExtraChargeMap(newExtraChargeMap);
            setShowExtra(newShowExtra);
        } catch (e) {
            console.error("가격 불러오기 실패", e);
            alert("단가 정보를 불러오지 못했습니다.");
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
            if (response.success) {
                setTotalAmount(response.data.totalAmount);
                alert("가격이 성공적으로 저장되었습니다.");
                router.push(`/estimate/owner/final?estimateNo=${estimateNo}`);
            }
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

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                {/* 왼쪽: 이전 페이지 버튼 */}
                <button
                    onClick={() => router.push(`/estimate/owner/final?estimateNo=${estimateNo}`)}
                    className="flex items-center bg-gray-100 text-gray-600 px-3 py-2 rounded hover:bg-gray-200"
                >
                    <span className="mr-1">&lt;</span>
                    이전페이지
                </button>

                {/* 가운데: 제목 */}
                <h2 className="text-lg font-semibold text-center flex-1">
                    기본 단가 및 추가금 입력
                </h2>

                {/* 오른쪽: 기본금 불러오기 버튼 */}
                <button
                    onClick={handleLoadPrices}
                    className="flex items-center bg-gray-100 text-gray-600 px-3 py-2 rounded hover:bg-gray-200"
                >
                    이전 입력 가져오기
                </button>
            </div>

            {loading && <div className="text-center py-8">로딩 중...</div>}

            {
                !loading && items.length > 0 && (
                    <>
                        <div className="space-y-12">
                            {CATEGORY_ORDER.map((cat) =>
                                grouped[cat] && grouped[cat].length > 0 ? (
                                    <div key={cat}>
                                        <div className="flex items-center gap-2 mb-6">
                                            <h3 className="text-base font-bold">{cat}</h3>
                                            <div className="h-px flex-1 bg-gray-100" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {grouped[cat].map((item) => (
                                                <div
                                                    key={item.itemTypeId}
                                                    className="flex flex-col items-center justify-between p-5 rounded-2xl bg-white border shadow-sm"
                                                >
                                                    <Image
                                                        src={getImagePath(item.category, item.name)}
                                                        alt={item.name}
                                                        width={56}
                                                        height={56}
                                                        className="rounded-xl object-cover bg-gray-100"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = "/icons/placeholder.jpeg";
                                                        }}
                                                    />
                                                    <span className="text-sm font-medium mt-2">{item.name}</span>
                                                    <div className="flex items-center w-full mt-3">
                                                        <input
                                                            value={priceMap[item.itemTypeId] ?? 0}
                                                            onChange={(e) =>
                                                                setPriceMap((prev) => ({
                                                                    ...prev,
                                                                    [item.itemTypeId]: parseInt(e.target.value || "0"),
                                                                }))
                                                            }
                                                            className="flex-1 text-right outline-none rounded-lg px-3 py-2 bg-gray-50 border"
                                                            placeholder="기본 단가"
                                                        />
                                                        <span className="ml-1 text-gray-700">원</span>
                                                    </div>
                                                    {!showExtra[item.itemTypeId] ? (
                                                        <button
                                                            className="mt-2 text-xs text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50"
                                                            onClick={() =>
                                                                setShowExtra((prev) => ({
                                                                    ...prev,
                                                                    [item.itemTypeId]: true,
                                                                }))
                                                            }
                                                        >
                                                            + 추가금
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-2 w-full mt-2">
                                                            <input
                                                                type="text"
                                                                placeholder="사유 (예: 사다리차)"
                                                                className="flex-[2] min-w-0 px-3 py-2 border rounded"
                                                                value={extraChargeMap[item.itemTypeId]?.reason || ""}
                                                                onChange={(e) =>
                                                                    setExtraChargeMap((prev) => ({
                                                                        ...prev,
                                                                        [item.itemTypeId]: {
                                                                            ...prev[item.itemTypeId],
                                                                            reason: e.target.value,
                                                                            amount: prev[item.itemTypeId]?.amount || 0,
                                                                        },
                                                                    }))
                                                                }
                                                            />
                                                            <input
                                                                placeholder="0"
                                                                className="flex-[1] min-w-0 text-right outline-none rounded-lg px-3 py-2 bg-gray-50 border"
                                                                value={extraChargeMap[item.itemTypeId]?.amount || ""}
                                                                onChange={(e) =>
                                                                    setExtraChargeMap((prev) => ({
                                                                        ...prev,
                                                                        [item.itemTypeId]: {
                                                                            ...prev[item.itemTypeId],
                                                                            amount: parseInt(e.target.value || "0"),
                                                                            reason: prev[item.itemTypeId]?.reason || "",
                                                                        },
                                                                    }))
                                                                }
                                                            />
                                                            <span className="ml-1 text-gray-700 whitespace-nowrap">원</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </div>

                        <div className="text-center mt-10">
                            <button
                                onClick={handleSave}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
                            >
                                저장하기
                            </button>
                            {totalAmount > 0 && (
                                <div className="mt-4 text-lg font-bold text-blue-600">
                                    물품 총 금액: {totalAmount.toLocaleString()}원
                                </div>
                            )}
                        </div>
                    </>
                )
            }

            {
                !loading && items.length === 0 && (
                    <div className="text-center text-gray-400 py-8">짐 목록이 없습니다.</div>
                )
            }
        </div>
    );
}