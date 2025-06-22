import React from "react";
import EstimateCard from "./EstimateCard";
import Pagination from "@/components/common/Pagination";
import { Estimate, EstimateSearchParams } from "@/types/estimate";
import { authApi } from "@/lib/axios";

interface EstimateListProps {
    searchParams: EstimateSearchParams;
    onSelect: (estimateNo: number) => void;
}

export default function EstimateList({ searchParams, onSelect }: EstimateListProps) {
    const [estimates, setEstimates] = React.useState<Estimate[]>([]);
    const [page, setPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handlePageChange = (newPage: number) => {
        // Pagination은 1부터 시작하므로 0부터 시작하는 page로 변환
        setPage(newPage - 1);
    };

    const fetchEstimates = React.useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authApi.get('/estimates/owner/list/public', {
                params: {
                    page,
                    size: 10,
                    request: {
                        ...(searchParams.moveYear && { moveYear: Number(searchParams.moveYear) }),
                        ...(searchParams.moveMonth && { moveMonth: Number(searchParams.moveMonth) }),
                        ...(searchParams.moveDay && { moveDay: Number(searchParams.moveDay) }),
                        ...(searchParams.moveType && { moveType: searchParams.moveType }),
                        ...(searchParams.moveOption && { moveOption: searchParams.moveOption }),
                        ...(searchParams.fromRegion1 && { fromRegion1: searchParams.fromRegion1 }),
                        ...(searchParams.fromRegion2 && { fromRegion2: searchParams.fromRegion2 }),
                        ...(searchParams.toRegion1 && { toRegion1: searchParams.toRegion1 }),
                        ...(searchParams.toRegion2 && { toRegion2: searchParams.toRegion2 }),
                    }
                }
            });

            const data = response.data.data;
            setEstimates(Array.isArray(data?.content) ? data.content : []);
            setTotalPages(data?.totalPages || 1);

        } catch (error: any) {
            console.error("견적서 목록을 불러오는데 실패했습니다:", error);
            setError(error?.response?.data?.message || "견적서 목록을 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [page, searchParams]);

    React.useEffect(() => {
        fetchEstimates();
    }, [fetchEstimates]);

    const handleViewDetail = (estimateNo: number) => {
        onSelect(estimateNo);
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-sm text-gray-500">견적서를 불러오는 중입니다...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 bg-red-50 rounded-2xl">
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <button
                    onClick={() => {
                        setError(null);
                        fetchEstimates();
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    다시 시도
                </button>
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
                    <>
                        {/* ✅ 이 위치에서 console.log로 중복 확인 */}
                        {console.log("📌 estimateNo 목록:", estimates.map(e => e.estimateNo))}
                        {estimates.map(estimate => (
                            <EstimateCard
                                key={estimate.estimateNo}
                                estimate={estimate}
                                onViewDetail={() => handleViewDetail(estimate.estimateNo)}
                            />
                        ))}

                    </>
                )}
            </div>

            <div className="mt-8">
                <Pagination
                    // �� 수정: currentPage를 1부터 시작하는 값으로 변환
                    currentPage={page + 1}
                    totalPages={totalPages}
                    // 🔧 수정: onPageChange를 handlePageChange로 변경
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    );
} 