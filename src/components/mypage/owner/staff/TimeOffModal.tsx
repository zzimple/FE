import React from 'react';
import { TimeOffRequest } from './TimeOffCard';
import TimeOffCard from './TimeOffCard';

interface TimeOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  requests: TimeOffRequest[];
  title: string;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const TimeOffModal = ({
  isOpen,
  onClose,
  requests,
  title,
  onApprove,
  onReject,
}: TimeOffModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* 모달 헤더 */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 모달 본문 */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 150px)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((request) => (
                <TimeOffCard
                  key={request.staffTimeOffId}
                  request={request}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              ))}
              {requests.length === 0 && (
                <p className="text-sm text-gray-500 col-span-full text-center py-4">
                  표시할 휴무 신청이 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeOffModal; 