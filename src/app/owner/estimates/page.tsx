"use client";

import React, { useState, useEffect, useCallback } from "react";
import OwnerHeader from "@/components/headers/OwnerHeader";
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
    storeId: number;
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

    const fetchConfirmedEstimates = useCallback(async () => {
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
                console.log('API Response:', response.data.data.content);

                // API 응답 데이터를 프론트엔드 구조에 맞게 변환
                const processedEstimates = (response.data.data.content || []).map((item: any) => {
                    // moveDate를 년, 월, 일로 분리 (YYYYMMDD 형식)
                    const moveDateStr = item.moveDate?.toString() || '';
                    const moveYear = moveDateStr.length >= 4 ? parseInt(moveDateStr.substring(0, 4)) : new Date().getFullYear();
                    const moveMonth = moveDateStr.length >= 6 ? parseInt(moveDateStr.substring(4, 6)) : 1;
                    const moveDay = moveDateStr.length >= 8 ? parseInt(moveDateStr.substring(6, 8)) : 1;

                    // 주소를 지역으로 변환 (간단한 파싱)
                    const fromRegion1 = item.roadFullAddr1?.split(' ')[0] || '';
                    const fromRegion2 = item.roadFullAddr1?.split(' ')[1] || '';
                    const toRegion1 = item.roadFullAddr2?.split(' ')[0] || '';
                    const toRegion2 = item.roadFullAddr2?.split(' ')[1] || '';

                    return {
                        estimateNo: item.estimateNo || 0,
                        moveYear,
                        moveMonth,
                        moveDay,
                        moveType: item.moveType || '',
                        moveOption: item.optionType || '', // optionType을 moveOption으로 매핑
                        fromRegion1,
                        fromRegion2,
                        toRegion1,
                        toRegion2,
                        status: 'CONFIRMED' as const, // 이 페이지는 확정된 견적서만 조회하므로
                        // ConfirmedEstimate의 추가 필드들
                        guestName: item.guestName,
                        guestPhone: item.guestPhone,
                        confirmedAt: item.confirmedAt,
                        totalPrice: item.totalPrice,
                        assignedStaff: item.assignedStaff,
                        storeId: item.storeId
                    };
                });

                setEstimates(processedEstimates);
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
    }, [page]); // page만 의존성으로 추가

    useEffect(() => {
        fetchConfirmedEstimates();
    }, [fetchConfirmedEstimates]);

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

    const handleViewDetail = (estimateNo: number, storeId: number) => {
        router.push(`/owner/estimates/detail?estimateNo=${estimateNo}&storeId=${storeId}`);
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
            // API 요청 정보 출력
            const requestUrl = `/owner/schedule/${estimate.estimateNo}/available-staff`;
            console.log('=== 직원 조회 디버깅 ===');
            console.log('요청 URL:', requestUrl);
            console.log('견적서 정보:', {
                estimateNo: estimate.estimateNo,
                moveDate: `${estimate.moveYear}-${estimate.moveMonth}-${estimate.moveDay}`,
                moveType: estimate.moveType,
                moveOption: estimate.moveOption
            });

            const response = await authApi.get(requestUrl);

            // API 응답 상세 정보 출력
            console.log('응답 상태:', response.status);
            console.log('응답 데이터:', response.data);

            if (response.data.success) {
                // API 응답 데이터 구조 확인
                console.log('직원 데이터 상세:', JSON.stringify(response.data.data, null, 2));

                // API 응답 구조에 맞게 변환
                const staffList = (response.data.data || []).map((staff: any) => {
                    console.log('개별 직원 데이터:', staff);
                    return {
                        id: staff.staffId,
                        name: staff.staffName,
                        phone: staff.staffPhoneNum,
                        isAvailable: true // 목록에 있는 직원은 모두 가용한 것으로 간주
                    };
                });

                console.log('변환된 직원 목록:', staffList);
                setAvailableStaff(staffList);
            }
        } catch (error: any) {
            console.error('직원 목록 조회 실패:', error);
            if (error.response) {
                console.error('에러 응답:', error.response.data);
                console.error('에러 상태:', error.response.status);
            }
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
            // staffId를 query parameter로 전송
            const response = await authApi.post(
                `/owner/schedule/${selectedEstimate.estimateNo}/assign`,
                null,  // body는 null
                {
                    params: {
                        staffId: selectedStaffId.toString(),
                        workDate: `${selectedEstimate.moveYear}-${String(selectedEstimate.moveMonth).padStart(2, '0')}-${String(selectedEstimate.moveDay).padStart(2, '0')}`
                    }
                }
            );

            if (response.data.success) {
                alert('직원 배정이 완료되었습니다.');
                setShowAssignModal(false);
                setSelectedEstimate(null);
                setSelectedStaffId(null);
                fetchConfirmedEstimates(); // 목록 새로고침
            } else {
                alert(response.data.message || '직원 배정에 실패했습니다.');
            }
        } catch (error: any) {
            console.error('직원 배정 실패:', error);
            if (error.response) {
                console.error('에러 응답:', error.response.data);
                alert(error.response.data.message || '직원 배정에 실패했습니다.');
            } else {
                alert('직원 배정에 실패했습니다.');
            }
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
        <div className="min-h-screen bg-white-50">
            <OwnerHeader />
            <div className="max-w-7xl mx-auto px-4 py-8 pt-12">                {/* 헤더 */}
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
                                        onViewDetail={(estimateNo) => handleViewDetail(estimateNo, estimate.storeId)}
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
                                                onClick={() => handleViewDetail(estimate.estimateNo, estimate.storeId)}
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
                            {availableStaff.filter(staff => staff.isAvailable).length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-500 mb-2">
                                        해당 날짜에 배정 가능한 직원이 없습니다.
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        이사 날짜: {selectedEstimate?.moveYear}년 {selectedEstimate?.moveMonth}월 {selectedEstimate?.moveDay}일
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        직원의 스케줄을 확인해주세요.
                                    </p>
                                </div>
                            ) : (
                                availableStaff
                                    .filter(staff => staff.isAvailable)
                                    .map(staff => (
                                        <label
                                            key={staff.id}
                                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedStaffId === staff.id
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
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{staff.name}</div>
                                                <div className="text-sm text-gray-500">{staff.phone}</div>
                                            </div>
                                            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                                사용 가능
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
