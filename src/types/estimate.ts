export type MoveType = "SMALL" | "FAMILY" ;
export type MoveOption = "BASIC" | "PACKAGING" | "SEMI_PACKAGING" ;
export type EstimateStatus = "WAITING" | "ACCEPTED" | "REJECTED";

export interface Estimate {
    estimateNo: number;
    moveYear: number;
    moveMonth: number;
    moveDay: number;
    moveType: "" | MoveType;
    moveOption: "" | MoveOption;
    fromRegion1: string;
    fromRegion2: string;
    toRegion1: string;
    toRegion2: string;
    status: EstimateStatus;
}

export interface EstimateSearchParams {
    moveYear: string;
    moveMonth: string;
    moveDay: string;
    moveType: "" | MoveType;
    moveOption: "" | MoveOption;
    fromRegion1: string;
    fromRegion2: string;
    toRegion1: string;
    toRegion2: string;
    status: EstimateStatus;
}

export const MOVE_TYPE_LABELS: Record<MoveType, string> = {
    SMALL: "소형이사",
    FAMILY: "가정이사"
};

export const MOVE_OPTION_LABELS: Record<MoveOption, string> = {
    BASIC: "일반",
    PACKAGING: "포장이사",
    SEMI_PACKAGING: "포장"
};

export const STATUS_BADGE_STYLES: Record<EstimateStatus, { bg: string; text: string; label: string }> = {
    WAITING: { bg: "bg-yellow-50", text: "text-yellow-600", label: "대기중" },
    ACCEPTED: { bg: "bg-green-50", text: "text-green-600", label: "수락" },
    REJECTED: { bg: "bg-red-50", text: "text-red-600", label: "거절" },
}; 