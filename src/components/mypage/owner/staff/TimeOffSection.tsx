"use client";

import React from "react";
import TimeOffCard from "./TimeOffCard";
import TimeOffModal from "./TimeOffModal";

type Status = "APPROVED" | "PENDING" | "REJECTED";

interface Props {
  status: Status;
  title: string;
  items: any[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function TimeOffSection({
  status,
  title,
  items,
  onApprove,
  onReject,
  isOpen,
  onOpen,
  onClose,
}: Props) {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <span
            className={`text-sm px-2.5 py-1 rounded ${
              status === "APPROVED"
                ? "bg-green-50 text-green-600"
                : status === "REJECTED"
                ? "bg-red-50 text-red-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {items.length}건
          </span>
        </div>

        {items.length > 0 && (
          <button
            onClick={onOpen}
            className="text-sm text-blue-600 hover:underline"
          >
            전체 보기
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.slice(0, 6).map((request) => (
          <TimeOffCard
            key={request.staffTimeOffId}
            request={request}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}

        {items.length === 0 && (
          <p className="text-sm text-gray-500 col-span-full">
            {title}이 없습니다.
          </p>
        )}
      </div>

      <TimeOffModal
        isOpen={isOpen}
        onClose={onClose}
        requests={items}
        title={`${title}`}
        onApprove={onApprove}
        onReject={onReject}
      />
    </section>
  );
}
