import React from "react";
import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineTruck, HiOutlineChevronRight } from "react-icons/hi";
import { Estimate, MOVE_TYPE_LABELS, MOVE_OPTION_LABELS, STATUS_BADGE_STYLES, MoveType, MoveOption } from "@/types/estimate";

interface EstimateCardProps {
    estimate: Estimate;
    onViewDetail: (id: number) => void;
}

// export default function EstimateCard({ estimate, onViewDetail }: EstimateCardProps) {
//     const statusBadge = (status: Estimate["status"]) => {
//         const styles = STATUS_BADGE_STYLES[status];
//         return (
//             <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}>
//                 {styles.label}
//             </span>
//         );
//     };

export default function EstimateCard({ estimate, onViewDetail }: EstimateCardProps) {
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
        </div>
    );
} 