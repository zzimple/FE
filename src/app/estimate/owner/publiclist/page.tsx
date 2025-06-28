"use client";

import React from "react";
import EstimateList from "@/components/estimate/EstimateList";
import EstimateSearch from "@/components/estimate/EstimateSearch";
import OwnerHeader from "@/components/headers/OwnerHeader";
import { EstimateSearchParams, MoveOption, MoveType } from "@/types/estimate";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/axios";

// 초기 검색 파라미터 상수 선언
const initialSearchParams: EstimateSearchParams = {
    moveYear: "",
    moveMonth: "",
    moveDay: "",
    moveType: "" as MoveType,
    moveOption: "" as MoveOption,
    fromRegion1: "",
    fromRegion2: "",
    toRegion1: "",
    toRegion2: "",
};

export default function EstimateListPage() {
    const router = useRouter();
    const [searchParams, setSearchParams] = React.useState<EstimateSearchParams>(initialSearchParams);
    const [showAlert, setShowAlert] = React.useState(false);

    React.useEffect(() => {
        const fetchCharges = async () => {
            try {
                const response = await authApi.get("/owner/my/price-setting");
                if (response.data.success) {
                    const { perTruckCharge, holidayCharge, goodDayCharge, weekendCharge } = response.data.data;
                    if ((perTruckCharge ?? 0) === 0 && (holidayCharge ?? 0) === 0 && (goodDayCharge ?? 0) === 0 && (weekendCharge ?? 0) === 0) {
                        setShowAlert(true);
                    }
                } else {
                    setShowAlert(true);
                }
            } catch (e) {
                setShowAlert(true);
            }
        };
        fetchCharges();
    }, []);

    const handleSearch = (params: EstimateSearchParams) => {
        setSearchParams(params);
    };

    const handleReset = () => {
        setSearchParams({ ...initialSearchParams }); // 항상 새로운 객체로!
    };

    const handleSelect = (estimateNo: number) => {
        router.push(`/estimate/owner/final?estimateNo=${estimateNo}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <OwnerHeader />
            <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
                <h1 className="text-2xl font-bold mb-8 text-center text-gray-900">견적서 목록</h1>
                <EstimateSearch onSearch={handleSearch} initialParams={searchParams} onReset={handleReset} />
                <EstimateList searchParams={searchParams} onSelect={handleSelect} showStaffInfo={false} />
            </div>
            {showAlert && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-xs w-full border border-blue-100">
                        <div className="flex flex-col items-center mb-4">
                            {/* 경고/안내 아이콘 */}
                            <svg className="w-12 h-12 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                            </svg>
                            <h2 className="text-xl font-bold mb-1 text-blue-600">추가금 설정 필요</h2>
                        </div>
                        <p className="mb-4 text-gray-700 font-medium">
                            고객 견적서 작성 전<br />
                            <span className="text-blue-600 font-semibold">추가금 설정</span>을 먼저 완료해주세요.
                        </p>
                        <button
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition mb-2"
                            onClick={() => {
                                setShowAlert(false);
                                router.push("/owner/profile");
                            }}
                        >
                            추가금 설정하러 가기
                        </button>
                        <button
                            className="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
                            onClick={() => setShowAlert(false)}
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}