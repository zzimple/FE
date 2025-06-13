import React from "react";
import { useRouter } from "next/navigation";
import EstimateCard from "./EstimateCard";
import Pagination from "@/components/common/Pagination";
import { Estimate, EstimateSearchParams } from "@/types/estimate";

interface EstimateListProps {
    searchParams: EstimateSearchParams;
}

export default function EstimateList({ searchParams }: EstimateListProps) {
    const router = useRouter();
    const [estimates, setEstimates] = React.useState<Estimate[]>([]);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [isLoading, setIsLoading] = React.useState(false);

    const fetchEstimates = React.useCallback(async () => {
        try {
            setIsLoading(true);
            // 실제로는 fetch(`/api/estimates?page=${page}&size=10&request=...`)
            // 아래는 예시용 더미 데이터
            setEstimates([
                {
                    id: 1,
                    moveYear: 2025,
                    moveMonth: 5,
                    moveDay: 6,
                    moveType: "SMALL",
                    moveOption: "BASIC",
                    fromRegion1: "서울",
                    fromRegion2: "강남구",
                    toRegion1: "경기",
                    toRegion2: "성남시",
                    status: "PENDING",
                },
                // ...더미 데이터
            ]);
            setTotalPages(3); // 예시
        } catch (error) {
            console.error("견적서 목록을 불러오는데 실패했습니다:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, searchParams]);

    React.useEffect(() => {
        fetchEstimates();
    }, [fetchEstimates]);

    const handleViewDetail = (id: number) => {
        router.push(`/estimate/detail/${id}`);
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
                            key={estimate.id}
                            estimate={estimate}
                            onViewDetail={handleViewDetail}
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