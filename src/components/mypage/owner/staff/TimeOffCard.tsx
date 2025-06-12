import React from "react";

type Status = "APPROVED" | "PENDING" | "REJECTED";
type TimeOffType = "ANNUAL" | "HALF" | "SICK" | "ETC";

export type TimeOffRequest = {
  staffTimeOffId: number;
  staffName: string;
  startDate: string;
  endDate: string;
  type: TimeOffType;
  reason?: string;
  status: Status;
};

type TimeOffCardProps = {
  request: TimeOffRequest;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};

const mapTimeOffTypeToKorean = (type: TimeOffType): string => {
  switch (type) {
    case "ANNUAL":
      return "연차";
    case "HALF":
      return "반차";
    case "SICK":
      return "병가";
    case "ETC":
      return "기타";
    default:
      return type;
  }
};

const TimeOffCard = ({ request, onApprove, onReject }: TimeOffCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-base text-gray-800">
          {request.staffName}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            request.status === "APPROVED"
              ? "bg-green-100 text-green-600"
              : request.status === "PENDING"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {request.status === "APPROVED"
            ? "승인됨"
            : request.status === "PENDING"
            ? "대기중"
            : "거절됨"}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-1">
        {request.startDate} ~ {request.endDate}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        종류: {mapTimeOffTypeToKorean(request.type)}
      </p>
      {request.reason && (
        <p className="text-sm text-gray-500 mb-3">사유: {request.reason}</p>
      )}
      {request.status === "PENDING" && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onApprove(request.staffTimeOffId)}
            className="py-1.5 px-3 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            승인
          </button>
          <button
            onClick={() => onReject(request.staffTimeOffId)}
            className="py-1.5 px-3 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100"
          >
            거절
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeOffCard;
