"use client";

import React from "react";
import EstimateList from "@/components/estimate/EstimateList";
import EstimateSearch from "@/components/estimate/EstimateSearch";
import { EstimateSearchParams } from "@/types/estimate";

export default function EstimateListPage() {
    const [searchParams, setSearchParams] = React.useState<EstimateSearchParams>({
        moveYear: "",
        moveMonth: "",
        moveDay: "",
        moveType: "",
        moveOption: "",
        fromRegion1: "",
        fromRegion2: "",
        toRegion1: "",
        toRegion2: "",
        status: "PENDING",
    });

    const handleSearch = (params: EstimateSearchParams) => {
        setSearchParams(params);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-8 text-center text-gray-900">견적서 목록</h1>
                <EstimateSearch onSearch={handleSearch} initialParams={searchParams} />
                <EstimateList searchParams={searchParams} />
            </div>
        </div>
    );
}