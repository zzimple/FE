export type MoveType = "SMALL" | "MEDIUM" | "LARGE";
export type MoveOption = "BASIC" | "DELUXE";
export type EstimateStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface Estimate {
    id: number;
    moveYear: number;
    moveMonth: number;
    moveDay: number;
    moveType: MoveType;
    moveOption: MoveOption;
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
    moveType: string;
    moveOption: string;
    fromRegion1: string;
    fromRegion2: string;
    toRegion1: string;
    toRegion2: string;
    status: EstimateStatus;
}

export const MOVE_TYPE_LABELS: Record<MoveType, string> = {
    SMALL: "소형",
    MEDIUM: "중형",
    LARGE: "대형",
};

export const MOVE_OPTION_LABELS: Record<MoveOption, string> = {
    BASIC: "기본",
    DELUXE: "고급",
};

export const STATUS_BADGE_STYLES: Record<EstimateStatus, { bg: string; text: string; label: string }> = {
    PENDING: { bg: "bg-yellow-50", text: "text-yellow-600", label: "대기중" },
    ACCEPTED: { bg: "bg-green-50", text: "text-green-600", label: "수락" },
    REJECTED: { bg: "bg-red-50", text: "text-red-600", label: "거절" },
}; 