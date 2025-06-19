"use client";

import React from "react";
import EstimateList from "@/components/estimate/EstimateList";
import EstimateSearch from "@/components/estimate/EstimateSearch";
import { EstimateSearchParams, MoveOption, MoveType } from "@/types/estimate";
import { useRouter, useSearchParams } from "next/navigation";


export default function EstimateListPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchParamState, setSearchParamState] = React.useState<EstimateSearchParams>({
        moveYear: "",
        moveMonth: "",
        moveDay: "",
        moveType: "" as MoveType,
        moveOption: "" as MoveOption,
        fromRegion1: "",
        fromRegion2: "",
        toRegion1: "",
        toRegion2: "",
        // status: "WAITING",
    });

    const handleSearch = (params: EstimateSearchParams) => {
        setSearchParamState(params);
    };

    function handleSelect(estimateNo: number): void {
        router.push(`/estimate/owner/final?estimateNo=${estimateNo}`);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-8 text-center text-gray-900">견적서 목록</h1>
                <EstimateSearch onSearch={handleSearch} initialParams={searchParams} />
                <EstimateList
                    searchParams={searchParams}
                    onSelect={handleSelect}
                />
            </div>
        </div>
    );
}