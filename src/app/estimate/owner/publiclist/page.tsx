"use client";

import React from "react";
import EstimateList from "@/components/estimate/EstimateList";
import EstimateSearch from "@/components/estimate/EstimateSearch";
import OwnerHeader from "@/components/headers/OwnerHeader";
import { EstimateSearchParams, MoveOption, MoveType } from "@/types/estimate";
import { useRouter } from "next/navigation";

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
        </div>
    );
}