"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// [추가/수정] 기본금 불러오기용 예시 API 함수 (실제 API로 교체)
async function fetchDefaultPrices(): Promise<{ [id: number]: number }> {
    // 실제로는 authApi.get("/owner/my/estimate/default-prices") 등 사용
    // 예시: { 1: 30000, 2: 50000, 3: 10000 }
    return {
        1: 30000,
        2: 50000,
        3: 10000,
    };
}

const CATEGORY_ORDER = ["가구", "가전", "기타"] as const;

interface EstimateItem {
    itemTypeId: number;
    name: string;
    category: "가구" | "가전" | "기타";
}

interface ExtraCharge {
    reason: string;
    amount: number;
}

interface PricePayload {
    itemTypeId: number;
    basePrice: number;
    extraCharges: ExtraCharge[];
}

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
    const dummyEstimateNo = "dummy-123";
    const router = useRouter();

    const [items, setItems] = useState<EstimateItem[]>([]);
    const [priceMap, setPriceMap] = useState<{ [id: number]: number }>({});
    const [extraChargeMap, setExtraChargeMap] = useState<{ [id: number]: ExtraCharge }>({});
    const [showExtra, setShowExtra] = useState<{ [id: number]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [totalAmount, setTotalAmount] = useState<number>(0); // [추가] 총 금액 상태

    useEffect(() => {
        const hardcodedItems: EstimateItem[] = [
            { itemTypeId: 1, name: "침대", category: "가구" },
            { itemTypeId: 2, name: "냉장고", category: "가전" },
            { itemTypeId: 3, name: "거울", category: "기타" },
        ];

        const initPrices: { [id: number]: number } = {};
        const initExtras: { [id: number]: ExtraCharge } = {};
        const initShowExtra: { [id: number]: boolean } = {};

        hardcodedItems.forEach((item) => {
            initPrices[item.itemTypeId] = 0;
            initExtras[item.itemTypeId] = { reason: "", amount: 0 };
            initShowExtra[item.itemTypeId] = false;
        });

        setItems(hardcodedItems);
        setPriceMap(initPrices);
        setExtraChargeMap(initExtras);
        setShowExtra(initShowExtra);
        setLoading(false);
    }, []);

    // [추가/수정] 기본금 불러오기 버튼 핸들러
    const handleLoadDefaultPrices = async () => {
        const defaults = await fetchDefaultPrices();
        setPriceMap((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((id) => {
                const numId = parseInt(id);
                if (defaults[numId] !== undefined) {
                    updated[numId] = defaults[numId];
                }
            });
            return updated;
        });
    };

    const handleSave = async () => {
        const itemsPayload: PricePayload[] = Object.entries(priceMap).map(([id, basePrice]) => {
            const itemTypeId = parseInt(id);
            const extra = extraChargeMap[itemTypeId];
            return {
                itemTypeId,
                basePrice,
                extraCharges:
                    showExtra[itemTypeId] && extra?.reason && extra?.amount > 0
                        ? [{ amount: extra.amount, reason: extra.reason }]
                        : [],
            };
        });

        const payload = {
            estimateNo: dummyEstimateNo,
            items: itemsPayload,
        };

        try {
            // 1. DB에 저장하는 API 호출
            const saveResponse = await fetch("/api/estimate/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!saveResponse.ok) {
                throw new Error("저장 실패");
            }

            // 2. 계산 API 호출하여 총 금액 받아오기
            const calcResponse = await fetch(`/api/estimate/calculate/${dummyEstimateNo}`);
            if (!calcResponse.ok) {
                throw new Error("계산 실패");
            }

            const { totalAmount } = await calcResponse.json();
            setTotalAmount(totalAmount); // [추가] 총 금액 상태 업데이트

            // alert 제거
        } catch (error) {
            console.error("Error:", error);
            alert("저장 중 오류가 발생했습니다.");
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
                    onClick={() => router.push('/estimate/step8')}
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
                    onClick={handleLoadDefaultPrices}
                    className="flex items-center bg-gray-100 text-gray-600 px-3 py-2 rounded hover:bg-gray-200"
                >
                    기본금 불러오기
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