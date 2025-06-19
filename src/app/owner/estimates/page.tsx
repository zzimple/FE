"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/axios";
import EstimateCard from "@/components/estimate/EstimateCard";
import Pagination from "@/components/common/Pagination";
import { Estimate } from "@/types/estimate";
import { HiOutlineSearch, HiOutlineFilter, HiOutlineCalendar, HiOutlineUserAdd, HiOutlineCheck } from "react-icons/hi";

interface ConfirmedEstimate extends Estimate {
    guestName?: string;
    guestPhone?: string;
    confirmedAt?: string;
    totalPrice?: number;
    assignedStaff?: {
        id: number;
        name: string;
        phone: string;
    };
}

interface SearchFilters {
    keyword: string;
    moveDateFrom: string;
    moveDateTo: string;
    status: 'all' | 'completed' | 'in-progress';
}

interface StaffMember {
    id: number;
    name: string;
    phone: string;
    isAvailable: boolean;
}

export default function OwnerConfirmedEstimatesPage() {
    const router = useRouter();
    const [estimates, setEstimates] = useState<ConfirmedEstimate[]>([]);
    const [filteredEstimates, setFilteredEstimates] = useState<ConfirmedEstimate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({
        keyword: '',
        moveDateFrom: '',
        moveDateTo: '',
        status: 'all'
    });

    // 직원 배정 모달 상태
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedEstimate, setSelectedEstimate] = useState<ConfirmedEstimate | null>(null);
    const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([]);
    const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
    const [isAssigning, setIsAssigning] = useState(false);

    const fetchConfirmedEstimates = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // 사장님이 보낸 견적서 중 CONFIRMED 상태인 것만 조회
            const response = await authApi.get(`/owner/my/list/confirmed`, {
                params: {
                    page: page - 1, // 백엔드에서 0-based pagination 사용
                    size: 10
                }
            });

            if (response.data.success) {
                setEstimates(response.data.data.content || []);
                setTotalPages(response.data.data.totalPages || 1);
                setTotalCount(response.data.data.totalElements || 0);
            } else {
                setError('견적서 목록을 불러오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('견적서 목록 조회 실패:', error);
            setError('견적서 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfirmedEstimates();
    }, [page]);

    // 필터링 로직
    useEffect(() => {
        let filtered = [...estimates];

        // 키워드 검색
        if (filters.keyword) {
            filtered = filtered.filter(estimate => 
                estimate.guestName?.includes(filters.keyword) ||
                estimate.fromRegion1?.includes(filters.keyword) ||
                estimate.toRegion1?.includes(filters.keyword) ||
                estimate.estimateNo.toString().includes(filters.keyword)
            );
        }

        // 이사 날짜 범위 필터
        if (filters.moveDateFrom) {
            filtered = filtered.filter(estimate => {
                const moveDate = new Date(estimate.moveYear, estimate.moveMonth - 1, estimate.moveDay);
                return moveDate >= new Date(filters.moveDateFrom);
            });
        }

        if (filters.moveDateTo) {
            filtered = filtered.filter(estimate => {
                const moveDate = new Date(estimate.moveYear, estimate.moveMonth - 1, estimate.moveDay);
                return moveDate <= new Date(filters.moveDateTo);
            });
        }

        // 상태 필터
        if (filters.status === 'completed') {
            filtered = filtered.filter(estimate => estimate.totalPrice);
        } else if (filters.status === 'in-progress') {
            filtered = filtered.filter(estimate => !estimate.totalPrice);
        }

        setFilteredEstimates(filtered);
    }, [estimates, filters]);

    const handleViewDetail = (estimateNo: number) => {
        router.push(`/estimate/owner/final/check?estimateNo=${estimateNo}`);
    };

    const handleRefresh = () => {
        fetchConfirmedEstimates();
    };

    const handleFilterChange = (key: keyof SearchFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            keyword: '',
            moveDateFrom: '',
            moveDateTo: '',
            status: 'all'
        });
    };

    // 직원 배정 관련 함수들
    const handleAssignStaff = async (estimate: ConfirmedEstimate) => {
        setSelectedEstimate(estimate);
        setShowAssignModal(true);
        
        try {
            // 사용 가능한 직원 목록 조회
            const response = await authApi.get('/owner/staff/available');
            if (response.data.success) {
                setAvailableStaff(response.data.data);
            }
        } catch (error) {
            console.error('직원 목록 조회 실패:', error);
            alert('직원 목록을 불러오는데 실패했습니다.');
        }
    };

    const handleConfirmAssignment = async () => {
        if (!selectedEstimate || !selectedStaffId) {
            alert('직원을 선택해주세요.');
            return;
        }

        setIsAssigning(true);
        try {
            const response = await authApi.post(`/estimates/${selectedEstimate.estimateNo}/assign-staff`, {
                staffId: selectedStaffId
            });

            if (response.data.success) {
                alert('직원 배정이 완료되었습니다.');
                setShowAssignModal(false);
                fetchConfirmedEstimates(); // 목록 새로고침
            } else {
                alert('직원 배정에 실패했습니다.');
            }
        } catch (error) {
            console.error('직원 배정 실패:', error);
            alert('직원 배정에 실패했습니다.');
        } finally {
            setIsAssigning(false);
        }
    };

    const handleCompleteEstimate = async (estimateNo: number) => {
        if (!confirm('이 견적서를 완료 처리하시겠습니까?')) {
            return;
        }

        try {
            const response = await authApi.put(`/estimates/${estimateNo}/status`, null, {
                params: { status: 'COMPLETED' }
            });

            if (response.data.success) {
                alert('견적서가 완료 처리되었습니다.');
                fetchConfirmedEstimates();
            } else {
                alert('견적서 완료 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('견적서 완료 처리 실패:', error);
            alert('견적서 완료 처리에 실패했습니다.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto py-8 px-4">
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="mt-2 text-sm text-gray-500">견적서를 불러오는 중입니다...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto py-8 px-4">
                {/* 헤더 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">확정된 견적서 목록</h1>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <HiOutlineFilter className="w-4 h-4" />
                                필터
                            </button>
                            <button
                                onClick={handleRefresh}
                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                새로고침
                            </button>
                        </div>
                    </div>
                    
                    {/* 통계 정보 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                                <div className="text-sm text-gray-500">총 확정 견적서</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {estimates.filter(e => e.totalPrice).length}
                                </div>
                                <div className="text-sm text-gray-500">완료된 견적서</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {estimates.filter(e => !e.totalPrice).length}
                                </div>
                                <div className="text-sm text-gray-500">진행중인 견적서</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 필터 섹션 */}
                {showFilters && (
                    <div className="mb-6 bg-white rounded-xl p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* 키워드 검색 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    검색
                                </label>
                                <div className="relative">
                                    <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="고객명, 지역, 견적번호"
                                        value={filters.keyword}
                                        onChange={(e) => handleFilterChange('keyword', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* 이사 날짜 범위 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    이사 날짜 (시작)
                                </label>
                                <div className="relative">
                                    <HiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="date"
                                        value={filters.moveDateFrom}
                                        onChange={(e) => handleFilterChange('moveDateFrom', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    이사 날짜 (종료)
                                </label>
                                <div className="relative">
                                    <HiOutlineCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="date"
                                        value={filters.moveDateTo}
                                        onChange={(e) => handleFilterChange('moveDateTo', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* 상태 필터 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    상태
                                </label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">전체</option>
                                    <option value="completed">완료</option>
                                    <option value="in-progress">진행중</option>
                                </select>
                            </div>
                        </div>

                        {/* 필터 초기화 버튼 */}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                필터 초기화
                            </button>
                        </div>
                    </div>
                )}

                {/* 에러 메시지 */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* 견적서 목록 */}
                <div className="space-y-4">
                    {filteredEstimates.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {estimates.length === 0 ? '확정된 견적서가 없습니다' : '검색 결과가 없습니다'}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {estimates.length === 0 
                                    ? '게스트가 확정한 견적서가 여기에 표시됩니다.'
                                    : '다른 검색 조건을 시도해보세요.'
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* 결과 개수 표시 */}
                            <div className="text-sm text-gray-500">
                                총 {filteredEstimates.length}개의 견적서를 찾았습니다.
                            </div>
                            
                            {filteredEstimates.map(estimate => (
                                <div key={estimate.estimateNo} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                    <EstimateCard
                                        estimate={estimate}
                                        onViewDetail={handleViewDetail}
                                    />
                                    
                                    {/* 추가 정보 */}
                                    <div className="px-4 pb-4 border-t border-gray-100">
                                        <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">고객명:</span>
                                                <span className="font-medium text-gray-900">
                                                    {estimate.guestName || '정보 없음'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">이사 날짜:</span>
                                                <span className="font-medium text-gray-900">
                                                    {estimate.moveYear}-{estimate.moveMonth}-{estimate.moveDay}
                                                </span>
                                            </div>
                                            {estimate.totalPrice && (
                                                <div className="flex items-center gap-2 md:col-span-2">
                                                    <span className="text-gray-500">총 금액:</span>
                                                    <span className="font-bold text-lg text-blue-600">
                                                        {estimate.totalPrice.toLocaleString()}원
                                                    </span>
                                                </div>
                                            )}
                                            {estimate.assignedStaff && (
                                                <div className="flex items-center gap-2 md:col-span-2">
                                                    <span className="text-gray-500">배정 직원:</span>
                                                    <span className="font-medium text-gray-900">
                                                        {estimate.assignedStaff.name} ({estimate.assignedStaff.phone})
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* 액션 버튼들 */}
                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => handleViewDetail(estimate.estimateNo)}
                                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                상세보기
                                            </button>
                                            
                                            {!estimate.totalPrice && !estimate.assignedStaff && (
                                                <button
                                                    onClick={() => handleAssignStaff(estimate)}
                                                    className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
                                                >
                                                    <HiOutlineUserAdd className="w-4 h-4" />
                                                    직원 배정
                                                </button>
                                            )}
                                            
                                            {!estimate.totalPrice && estimate.assignedStaff && (
                                                <button
                                                    onClick={() => handleCompleteEstimate(estimate.estimateNo)}
                                                    className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-2"
                                                >
                                                    <HiOutlineCheck className="w-4 h-4" />
                                                    완료 처리
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>

            {/* 직원 배정 모달 */}
            {showAssignModal && selectedEstimate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            직원 배정
                        </h3>
                        
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">
                                견적서 #{selectedEstimate.estimateNo}에 배정할 직원을 선택해주세요.
                            </p>
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {availableStaff.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    사용 가능한 직원이 없습니다.
                                </p>
                            ) : (
                                availableStaff.map(staff => (
                                    <label
                                        key={staff.id}
                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                            selectedStaffId === staff.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="staff"
                                            value={staff.id}
                                            checked={selectedStaffId === staff.id}
                                            onChange={(e) => setSelectedStaffId(Number(e.target.value))}
                                            className="mr-3"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">{staff.name}</div>
                                            <div className="text-sm text-gray-500">{staff.phone}</div>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setSelectedEstimate(null);
                                    setSelectedStaffId(null);
                                }}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                disabled={isAssigning}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleConfirmAssignment}
                                disabled={!selectedStaffId || isAssigning}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAssigning ? '배정 중...' : '배정하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
