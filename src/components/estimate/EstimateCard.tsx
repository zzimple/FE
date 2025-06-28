import React, { useEffect, useState } from "react";
import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineTruck, HiOutlineChevronRight } from "react-icons/hi";
import { Estimate, MOVE_TYPE_LABELS, MOVE_OPTION_LABELS, STATUS_BADGE_STYLES, MoveType, MoveOption } from "@/types/estimate";
import { authApi } from "@/lib/axios";

interface EstimateCardProps {
    estimate: Estimate;
    onViewDetail: (id: number) => void;
    showStaffInfo?: boolean; // 직원 정보 표시 여부 (기본값 true)
}

export default function EstimateCard({ estimate, onViewDetail, showStaffInfo = true }: EstimateCardProps) {
    // ✅ 수정: acceptedByMe가 true면 '수락 완료' 뱃지로 표시
    const statusBadge = (status: Estimate["status"], acceptedByMe?: boolean) => {
        if (acceptedByMe) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    수락 완료
                </span>
            );
        }

        const styles = STATUS_BADGE_STYLES[status];
        return (
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}
            >
                {styles.label}
            </span>
        );
    };

    // 직원 정보 상태
    const [staffInfo, setStaffInfo] = useState<{ count: number; names: string[] } | null>(null);
    const [staffLoading, setStaffLoading] = useState(true);
    const [staffError, setStaffError] = useState<string | null>(null);

    useEffect(() => {
        if (!showStaffInfo) return;
        let ignore = false;
        setStaffLoading(true);
        setStaffError(null);
        authApi.get(`/owner/schedule/${estimate.estimateNo}/assigned-staff`)
            .then(res => {
                if (!ignore && res.data.success && res.data.data) {
                    setStaffInfo({
                        count: res.data.data.count,
                        names: res.data.data.staffList.map((s: any) => s.staffName)
                    });
                }
            })
            .catch(() => {
                if (!ignore) setStaffError('직원 정보를 불러올 수 없음');
            })
            .finally(() => {
                if (!ignore) setStaffLoading(false);
            });
        return () => { ignore = true; };
    }, [estimate.estimateNo, showStaffInfo]);

    return (
        <div
            className="group bg-white rounded-xl p-4 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => onViewDetail(estimate.estimateNo)}
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-900">
                        <HiOutlineLocationMarker className="text-blue-500" />
                        <span className="text-sm font-medium">
                            {estimate.fromRegion1} {estimate.fromRegion2}
                            <span className="mx-2 text-gray-300">→</span>
                            {estimate.toRegion1} {estimate.toRegion2}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {statusBadge(estimate.status)}
                        <HiOutlineChevronRight className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <HiOutlineCalendar className="text-blue-400" />
                        {estimate.moveYear}.{String(estimate.moveMonth).padStart(2, "0")}.{String(estimate.moveDay).padStart(2, "0")}
                    </div>
                    <div className="flex items-center gap-1">
                        <HiOutlineTruck className="text-blue-400" />
                        {MOVE_TYPE_LABELS[estimate.moveType as MoveType]}
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-medium">
                        {MOVE_OPTION_LABELS[estimate.moveOption as MoveOption]}
                    </span>
                </div>
            </div>
            {/* 직원 정보 실제 API 연동 (showStaffInfo가 true일 때만) */}
            {showStaffInfo && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-700">
                    {staffLoading && <span className="text-gray-400">직원 정보를 불러오는 중...</span>}
                    {staffError && <span className="text-red-400">{staffError}</span>}
                    {staffInfo && !staffLoading && !staffError && (
                        <>
                            <span className="font-semibold">직원 {staffInfo.count}명:</span>
                            <span>{staffInfo.names.join(", ")}</span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
} 