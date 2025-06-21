"use client";

import React from "react";
import EstimateList from "@/components/estimate/EstimateList";
import EstimateSearch from "@/components/estimate/EstimateSearch";
import { EstimateSearchParams, MoveOption, MoveType } from "@/types/estimate";
import { useRouter, useSearchParams } from "next/navigation";


export default function EstimateListPage() {
    const router = useRouter();
    const urlSearchParams = useSearchParams();

    // const parseSearchParams = (): EstimateSearchParams => {
    //     return {
    //         moveYear: "",
    //         moveMonth: "",
    //         moveDay: "",
    //         moveType: "" as MoveType,
    //         moveOption: "" as MoveOption,
    //         fromRegion1: "",
    //         fromRegion2: "",
    //         toRegion1: "",
    //         toRegion2: "",
    //         // status: "WAITING",
    //     };
    // };

    // 🔧 수정: URL 파라미터를 EstimateSearchParams로 변환하는 함수
    const parseSearchParams = (): EstimateSearchParams => {
        return {
            moveYear: urlSearchParams.get('moveYear') || "",
            moveMonth: urlSearchParams.get('moveMonth') || "",
            moveDay: urlSearchParams.get('moveDay') || "",
            moveType: (urlSearchParams.get('moveType') as MoveType) || "" as MoveType,
            moveOption: (urlSearchParams.get('moveOption') as MoveOption) || "" as MoveOption,
            fromRegion1: urlSearchParams.get('fromRegion1') || "",
            fromRegion2: urlSearchParams.get('fromRegion2') || "",
            toRegion1: urlSearchParams.get('toRegion1') || "",
            toRegion2: urlSearchParams.get('toRegion2') || "",
        };
    };

    const estimateSearchParams = parseSearchParams();

    // 마운트 시점
    React.useEffect(() => {
        console.log("🟢 [publiclist] 페이지 마운트됨");
    }, []);


    const handleSearch = (params: EstimateSearchParams) => {
        // setSearchParamState(params);
        console.log("🔍 [publiclist] 검색 파라미터 변경됨:", params);

    };

    // function handleSelect(estimateNo: number): void {
    //     router.push(`/estimate/owner/final?estimateNo=${estimateNo}`);
    // }

    React.useEffect(() => {
        console.log("🔄 [publiclist] searchParams 변경됨:", estimateSearchParams);
    }, [estimateSearchParams])

    const handleSelect = (estimateNo: number) => {
        console.log("�� [publiclist] 견적서 상세보기 클릭:", estimateNo);
        router.push(`/estimate/owner/final?estimateNo=${estimateNo}`);
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-8 text-center text-gray-900">견적서 목록</h1>
                {/* <EstimateSearch onSearch={handleSearch} initialParams={searchParams} /> */}
                <EstimateSearch onSearch={handleSearch} initialParams={estimateSearchParams} />
                <EstimateList searchParams={estimateSearchParams} onSelect={handleSelect} />
                {/* <EstimateList
                        searchParams={searchParams}
                        onSelect={handleSelect}
                    /> */}
            </div>
        </div>
    );
}