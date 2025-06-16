import React from "react";
import EstimateCard from "./EstimateCard";
import Pagination from "@/components/common/Pagination";
import { Estimate, EstimateSearchParams } from "@/types/estimate";
import { authApi } from "@/lib/axios";

interface EstimateListProps {
    searchParams: EstimateSearchParams;
    onSelect: (estimateNo: number) => void; // 수정: 상세 보기 콜백 prop 추가
}

export default function EstimateList({ searchParams, onSelect }: EstimateListProps) {
    const [estimates, setEstimates] = React.useState<Estimate[]>([]);
    const [page, setPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(false);

    const fetchEstimates = React.useCallback(async () => {
        try {
            setIsLoading(true);

            // 검색 조건이 있으면 해당 조건으로 검색, 없으면 빈 객체로 모든 데이터 요청
            const response = await authApi.get('/estimates/owner/list/public', {
                params: {
                    ...(searchParams.moveYear !== "" && { moveYear: Number(searchParams.moveYear) }),
                    ...(searchParams.moveMonth !== "" && { moveMonth: Number(searchParams.moveMonth) }),
                    ...(searchParams.moveDay !== "" && { moveDay: Number(searchParams.moveDay) }),
                    ...(searchParams.moveType !== "" && { moveType: searchParams.moveType }),
                    ...(searchParams.moveOption !== "" && { moveOption: searchParams.moveOption }),
                    ...(searchParams.fromRegion1 !== "" && { fromRegion1: searchParams.fromRegion1 }),
                    ...(searchParams.fromRegion2 !== "" && { fromRegion2: searchParams.fromRegion2 }),
                    ...(searchParams.toRegion1 !== "" && { toRegion1: searchParams.toRegion1 }),
                    ...(searchParams.toRegion2 !== "" && { toRegion2: searchParams.toRegion2 }),
                    ...(searchParams.status && { status: searchParams.status }),
                    page,
                    size: 10,
                }
            });

            const data = response.data.data;
            setEstimates(Array.isArray(data?.content) ? data.content : []); // ✅ map 오류 방지
            setTotalPages(response.data.data.totalPages);   // 이전: response.data.totalPages

        } catch (error) {
            console.error("견적서 목록을 불러오는데 실패했습니다:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, searchParams]);

    React.useEffect(() => {
        fetchEstimates();
    }, [fetchEstimates]);

    const handleViewDetail = (estimateNo: number) => {
        onSelect(estimateNo); // 수정: 부모로 estimateNo 전달
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-sm text-gray-500">견적서를 불러오는 중입니다...</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {estimates.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <p className="text-gray-500 text-sm">견적서가 없습니다.</p>
                    </div>
                ) : (
                    estimates.map(estimate => (
                        <EstimateCard
                            key={estimate.estimateNo}                               // 수정: estimateNo를 key로 사용
                            estimate={estimate}
                            onViewDetail={() => handleViewDetail(estimate.estimateNo)}
                        />
                    ))
                )}
            </div>

            <div className="mt-8">
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
} 