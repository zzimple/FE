"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from "@/lib/axios";
import Button from "@/components/common/Button";

interface Estimate {
    estimateNo: number;
    storeName: string;
    truckCount: number;
    totalPrice: number;
    moveDate?: string;
    moveTime?: string;
}

interface EstimateResponse {
    success: boolean;
    message: string;
    data: {
        content: Estimate[];
        page: number;
        size: number;
        totalElements: number;
        totalPages: number;
        last: boolean;
    };
}

interface AnalysisResponse {
    success?: boolean;
    code?: string;
    message?: string;
    data?: {
        comparisonTable: Array<{
            category: string;
            estimateA: string | number | null;
            estimateB: string | number | null;
        }>;
        summary: string;
        recommendation: string;
    };
    // data가 없을 경우 직접 포함될 수 있는 필드들
    comparisonTable?: Array<{
        category: string;
        estimateA: string | number | null;
        estimateB: string | number | null;
    }>;
    summary?: string;
    recommendation?: string;
}

// 카테고리 라벨 변환 함수
const getCategoryLabel = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
        'truckCount': '트럭 대수',
        'truckTotalPrice': '트럭 기본 비용',
        'itemExtraCharges': '물품 추가 요금',
        'extraCharges': '기타 추가 요금',
        'holidayCharge': '공휴일 요금',
        'goodDayCharge': '길일 요금',
        'weekendCharge': '주말 요금',
        'ownerMessage': '사장님 메시지',
        'totalPrice': '총 비용'
    };
    return categoryMap[category] || category;
};

// 값 포맷팅 함수
const formatValue = (value: string | number | null): string => {
    if (value === null || value === undefined) {
        return '-';
    }
    if (typeof value === 'number') {
        if (value === 0) return '0원';
        return `${value.toLocaleString()}원`;
    }
    if (typeof value === 'string') {
        if (value === '') return '-';
        return value;
    }
    return String(value);
};

export default function EstimateGptPage() {
    const router = useRouter();
    const [estimates, setEstimates] = useState<Estimate[]>([]);
    const [selectedEstimates, setSelectedEstimates] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse['data'] | null>(null);

    // analysisResult 상태 변화 추적
    useEffect(() => {
        console.log('🔄 analysisResult 상태 변화:', analysisResult);
    }, [analysisResult]);

    // 견적서 목록 가져오기
    useEffect(() => {
        const fetchEstimates = async () => {
            try {
                console.log('🔍 견적서 목록 조회 시작...');
                
                // 먼저 토큰 확인
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setError('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                    setTimeout(() => router.push('/login'), 2000);
                    return;
                }

                console.log('🔑 토큰 확인됨:', token.substring(0, 20) + '...');

                // API 호출
                const response = await authApi.get<EstimateResponse>('/guest/my/estimate/list', {
                    params: {
                        page: 0,
                        size: 50
                    }
                });
                
                console.log('✅ 견적서 목록 조회 성공:', response.data);
                setEstimates(response.data.data?.content || []);
                setError(null);
            } catch (err) {
                console.error('❌ 견적서 목록 조회 실패:', err);
                setError('견적서 목록을 불러오는데 실패했습니다. 로그인 상태를 확인해주세요.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEstimates();
    }, [router]);

    // 견적서 선택 토글
    const toggleEstimate = (estimateNo: number) => {
        setSelectedEstimates(prev => {
            if (prev.includes(estimateNo)) {
                // 이미 선택된 견적서는 제거
                return prev.filter(id => id !== estimateNo);
            } else {
                // 2개까지만 선택 가능
                if (prev.length >= 2) {
                    setError('최대 2개의 견적서만 선택할 수 있습니다.');
                    return prev;
                }
                setError(null);
                return [...prev, estimateNo];
            }
        });
    };

    // GPT 분석 요청
    const handleAnalyze = async () => {
        if (selectedEstimates.length !== 2) {
            setError('정확히 2개의 견적서를 선택해주세요.');
            return;
        }

        try {
            setIsAnalyzing(true);
            setError(null);
            console.log('🔍 GPT 분석 요청 시작...', selectedEstimates);
            
            // 선택된 견적서들의 상세 정보 가져오기
            const estimateDetails = await Promise.all(
                selectedEstimates.map(async (estimateNo) => {
                    try {
                        const response = await authApi.get(`/view/estimate/${estimateNo}`);
                        return response.data.data;
                    } catch (err) {
                        console.error(`견적서 ${estimateNo} 상세 정보 조회 실패:`, err);
                        return null;
                    }
                })
            );
            
            console.log('📋 견적서 상세 정보:', estimateDetails);
            
            // 견적서 데이터를 estimateA, estimateB 형태로 변환
            const [estimateA, estimateB] = estimateDetails.filter(detail => detail !== null);
            
            if (!estimateA || !estimateB) {
                setError('견적서 상세 정보를 가져오는데 실패했습니다.');
                return;
            }
            
            // GPT 요청 데이터 구성
            const gptRequestData = {
                estimateA: {
                    truckCount: estimateA.truckCount || 0,
                    truckTotalPrice: estimateA.truckTotalPrice || 0,
                    ownerMessage: estimateA.ownerMessage || '',
                    itemExtraCharges: estimateA.itemExtraCharges || [],
                    extraCharges: estimateA.extraCharges || [],
                    totalPrice: estimateA.totalPrice || 0,
                    holidayCharge: estimateA.holidayCharge || null,
                    goodDayCharge: estimateA.goodDayCharge || null,
                    weekendCharge: estimateA.weekendCharge || null
                },
                estimateB: {
                    truckCount: estimateB.truckCount || 0,
                    truckTotalPrice: estimateB.truckTotalPrice || 0,
                    ownerMessage: estimateB.ownerMessage || '',
                    itemExtraCharges: estimateB.itemExtraCharges || [],
                    extraCharges: estimateB.extraCharges || [],
                    totalPrice: estimateB.totalPrice || 0,
                    holidayCharge: estimateB.holidayCharge || null,
                    goodDayCharge: estimateB.goodDayCharge || null,
                    weekendCharge: estimateB.weekendCharge || null
                }
            };
            
            console.log('📤 GPT 요청 데이터:', gptRequestData);
            
            // GPT 분석 요청
            const response = await authApi.post<AnalysisResponse>('/gpt/compare', gptRequestData);
            
            console.log('✅ GPT 분석 성공:', response.data);
            console.log('📊 응답 구조 확인:', {
                success: response.data.success,
                message: response.data.message,
                data: response.data.data,
                comparisonTable: response.data.data?.comparisonTable,
                summary: response.data.data?.summary,
                recommendation: response.data.data?.recommendation
            });
            
            // 응답 데이터 설정 - data가 없으면 response.data 자체를 사용
            const resultData = response.data.data || response.data;
            if (resultData && (resultData.comparisonTable || resultData.summary || resultData.recommendation)) {
                // 올바른 형태로 변환
                const formattedData = {
                    comparisonTable: resultData.comparisonTable || [],
                    summary: resultData.summary || '',
                    recommendation: resultData.recommendation || ''
                };
                setAnalysisResult(formattedData);
                console.log('🎯 analysisResult 설정됨:', formattedData);
            } else {
                console.error('❌ 응답 데이터가 없음');
                setError('분석 결과 데이터가 없습니다.');
            }
        } catch (err) {
            console.error('❌ 분석 요청 실패:', err);
            setError('견적서 분석에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-2 text-sm text-gray-500">견적서 목록을 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto py-8 px-4">
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">견적서 AI 비교 분석</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            여러 견적서를 선택하여 AI가 최적의 견적서를 추천해드립니다.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/mypage/guest/estimate')}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← 견적서 목록으로
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="ml-2 text-sm text-red-600">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 견적서 선택 영역 */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">견적서 선택</h2>
                            
                            {/* 선택 상태 표시 */}
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-blue-900">
                                        선택된 견적서: {selectedEstimates.length}/2
                                    </span>
                                    {selectedEstimates.length === 2 && (
                                        <span className="text-xs text-green-600 font-medium">
                                            ✓ 비교 준비 완료
                                        </span>
                                    )}
                                </div>
                                {selectedEstimates.length < 2 && (
                                    <p className="text-xs text-blue-700 mt-1">
                                        비교할 견적서를 2개 선택해주세요
                                    </p>
                                )}
                            </div>
                            
                            <div className="space-y-4">
                                {estimates && estimates.length > 0 ? (
                                    estimates.map((estimate) => (
                                        <div
                                            key={estimate.estimateNo}
                                            className={`p-4 rounded-lg border transition-colors cursor-pointer
                                                ${selectedEstimates.includes(estimate.estimateNo)
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : selectedEstimates.length >= 2
                                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                                    : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                            onClick={() => {
                                                if (selectedEstimates.length >= 2 && !selectedEstimates.includes(estimate.estimateNo)) {
                                                    return; // 2개 선택 시 추가 선택 방지
                                                }
                                                toggleEstimate(estimate.estimateNo);
                                            }}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 mt-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedEstimates.includes(estimate.estimateNo)}
                                                        onChange={() => {}}
                                                        disabled={selectedEstimates.length >= 2 && !selectedEstimates.includes(estimate.estimateNo)}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-900">
                                                                {estimate.storeName}
                                                            </h3>
                                                            {/* <p className="mt-1 text-xs text-gray-500">
                                                                {estimate.moveDate && estimate.moveTime
                                                                    ? `${estimate.moveDate} ${estimate.moveTime}`
                                                                    : '날짜 정보 없음'}
                                                            </p> */}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-semibold text-blue-600">
                                                                {estimate.totalPrice.toLocaleString()}원
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                트럭 {estimate.truckCount}대
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>비교할 수 있는 견적서가 없습니다.</p>
                                        <p className="text-xs mt-2">먼저 견적서를 신청해주세요.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <Button
                                    className="w-full h-12 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
                                    onClick={handleAnalyze}
                                    disabled={selectedEstimates.length !== 2 || isAnalyzing}
                                >
                                    {isAnalyzing ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            분석 중...
                                        </div>
                                    ) : (
                                        '선택한 견적서 분석하기'
                                    )}
                                </Button>
                                <p className="mt-2 text-xs text-gray-500 text-center">
                                    * 정확히 2개의 견적서를 선택해주세요
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 분석 결과 영역 */}
                    <div className="space-y-6">
                        {(() => {
                            console.log('🎨 렌더링 시 analysisResult:', analysisResult);
                            return analysisResult ? (
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">AI 분석 결과</h2>
                                    
                                    {/* 요약 */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">📋 분석 요약</h3>
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            {analysisResult.summary || '요약 정보가 없습니다.'}
                                        </p>
                                    </div>

                                    {/* 비교 테이블 */}
                                    {analysisResult.comparisonTable && analysisResult.comparisonTable.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-medium text-gray-900 mb-3">📊 상세 비교</h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="text-left py-2 px-3 font-medium text-gray-700">구분</th>
                                                            <th className="text-center py-2 px-3 font-medium text-gray-700">견적서 A</th>
                                                            <th className="text-center py-2 px-3 font-medium text-gray-700">견적서 B</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {analysisResult.comparisonTable.map((item, idx) => (
                                                            <tr key={idx} className="border-b border-gray-100">
                                                                <td className="py-2 px-3 text-gray-700 font-medium">
                                                                    {getCategoryLabel(item.category)}
                                                                </td>
                                                                <td className="py-2 px-3 text-center text-gray-600">
                                                                    {formatValue(item.estimateA)}
                                                                </td>
                                                                <td className="py-2 px-3 text-center text-gray-600">
                                                                    {formatValue(item.estimateB)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* 추천 */}
                                    {analysisResult.recommendation && (
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 AI 추천</h3>
                                            <p className="text-sm text-blue-800">
                                                {analysisResult.recommendation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-full">
                                    <div className="text-center text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        <p className="mt-2 text-sm">
                                            왼쪽에서 2개의 견적서를 선택하고<br />
                                            분석하기 버튼을 눌러주세요.
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
} 