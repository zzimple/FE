export type MoveType = "SMALL" | "FAMILY";
export type MoveOption = "BASIC" | "PACKAGING" | "SEMI_PACKAGING";
export type EstimateStatus = "WAITING" | "ACCEPTED" | "REJECTED" | "CONFIRMED" | "COMPLETED";

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
  acceptedByMe?: boolean;
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
  respondedByMe?: boolean;
  // status: EstimateStatus;
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
  CONFIRMED: { bg: "bg-blue-50", text: "text-blue-600", label: "확정" },
  COMPLETED: { bg: "bg-purple-50", text: "text-purple-600", label: "완료" },
};

export interface Address {
  roadFullAddr: string;      // 전체 도로명 주소
  roadAddrPart1: string;     // 도로명 주소 기본
  zipNo: string;             // 우편번호
  entX: string;              // 입구 X좌표
  entY: string;              // 입구 Y좌표
  addrDetail: string;        // 상세주소
}

export interface DetailInfo {
  buildingType: 'VILLA' | 'APARTMENT' | 'HOUSE' | 'OFFICETEL' | 'COMMERCIAL';
  roomStructure: 'ONE_ROOM' | 'ONE_HALF_ROOM' | 'TWO_ROOM' | 'THREE_ROOM_OR_MORE';
  sizeOption: string;        // 평수 옵션
  floor: number;             // 층수
  hasStairs: boolean;        // 계단 유무
  hasParking: boolean;       // 주차장 유무
  elevator: boolean;         // 엘리베이터 유무
}

export interface Item {
  id: number;                // 아이템 ID
  itemTypeId: number;        // 아이템 타입 ID
  itemTypeName: string;      // 아이템 이름
  category: 'APPLIANCE' | 'FURNITURE' | 'OTHER';
  quantity: number;          // 수량
  type: string | null;       // 타입
  width: string | null;      // 너비
  height: string | null;     // 높이
  depth: string | null;      // 깊이
  material: string | null;   // 재질
  size: string | null;       // 크기
  shape: string | null;      // 형태
  capacity: string | null;   // 용량
  doorCount: string | null;  // 문 개수
  unitCount: string | null;  // 유닛 개수
  frame: string | null;      // 프레임
  hasGlass: boolean;         // 유리 유무
  foldable: boolean;         // 접이식 유무
  hasWheels: boolean;        // 바퀴 유무
  hasPrinter: boolean;       // 프린터 유무
  purifierType: string | null; // 정수기 타입
  specialNote: string | null;  // 특이사항
  requestNote?: string | null; // 고객 요청 메모
}
