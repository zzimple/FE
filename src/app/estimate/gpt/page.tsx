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
    content: Estimate[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

interface AnalysisResponse {
    success: boolean;
    code: string;
    message: string;
    data: {
        analysis: string;
        highlights: {
            price: string[];
            service: string[];
            features: string[];
            recommendation: string;
        };
    };
}

export default function EstimateGptPage() {
    const router = useRouter();
    const [estimates, setEstimates] = useState<Estimate[]>([]);
    const [selectedEstimates, setSelectedEstimates] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse['data'] | null>(null);

    // 견적서 목록 가져오기
    useEffect(() => {
        const fetchEstimates = async () => {
            try {
                const response = await authApi.get<EstimateResponse>('/guest/my/estimate/list', {
                    params: {
                        page: 0,
                        size: 10 // 충분히 큰 수로 설정
                    }
                });
                setEstimates(response.data.content);
                setError(null);
            } catch (err) {
                console.error('견적서 목록 조회 실패:', err);
                setError('견적서 목록을 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEstimates();
    }, []);

    // 견적서 선택 토글
    const toggleEstimate = (estimateNo: number) => {
        setSelectedEstimates(prev => 
            prev.includes(estimateNo)
                ? prev.filter(id => id !== estimateNo)
                : [...prev, estimateNo]
        );
    };

    // GPT 분석 요청
    const handleAnalyze = async () => {
        if (selectedEstimates.length < 2) {
            setError('비교를 위해 2개 이상의 견적서를 선택해주세요.');
            return;
        }

        try {
            setIsAnalyzing(true);
            setError(null);
            const response = await authApi.post<AnalysisResponse>('/guest/my/estimates/analyze', {
                estimateNos: selectedEstimates
            });
            setAnalysisResult(response.data.data);
        } catch (err) {
            console.error('분석 요청 실패:', err);
            setError('견적서 분석에 실패했습니다.');
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
                        onClick={() => router.push('/mypage/guest/estimatelist')}
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
                            <div className="space-y-4">
                                {estimates && estimates.length > 0 ? (
                                    estimates.map((estimate) => (
                                        <div
                                            key={estimate.estimateNo}
                                            className={`p-4 rounded-lg border transition-colors cursor-pointer
                                                ${selectedEstimates.includes(estimate.estimateNo)
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                            onClick={() => toggleEstimate(estimate.estimateNo)}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 mt-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedEstimates.includes(estimate.estimateNo)}
                                                        onChange={() => {}}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-900">
                                                                {estimate.storeName}
                                                            </h3>
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {estimate.moveDate && estimate.moveTime
                                                                    ? `${estimate.moveDate} ${estimate.moveTime}`
                                                                    : '날짜 정보 없음'}
                                                            </p>
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
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <Button
                                    className="w-full h-12 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
                                    onClick={handleAnalyze}
                                    disabled={selectedEstimates.length < 2 || isAnalyzing}
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
                                    * 2개 이상의 견적서를 선택해주세요
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 분석 결과 영역 */}
                    <div className="space-y-6">
                        {analysisResult ? (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">AI 분석 결과</h2>
                                
                                {/* 주요 하이라이트 */}
                                <div className="space-y-6">
                                    {/* 가격 비교 */}
                                    {analysisResult.highlights.price.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 mb-2">💰 가격 비교</h3>
                                            <ul className="space-y-2">
                                                {analysisResult.highlights.price.map((item, idx) => (
                                                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                                                        <span className="text-blue-500 mr-2">•</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* 서비스 비교 */}
                                    {analysisResult.highlights.service.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 mb-2">🛠️ 서비스 비교</h3>
                                            <ul className="space-y-2">
                                                {analysisResult.highlights.service.map((item, idx) => (
                                                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                                                        <span className="text-blue-500 mr-2">•</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* 특징 비교 */}
                                    {analysisResult.highlights.features.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 mb-2">✨ 특징 비교</h3>
                                            <ul className="space-y-2">
                                                {analysisResult.highlights.features.map((item, idx) => (
                                                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                                                        <span className="text-blue-500 mr-2">•</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* 추천 */}
                                    {analysisResult.highlights.recommendation && (
                                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 AI 추천</h3>
                                            <p className="text-sm text-blue-800">
                                                {analysisResult.highlights.recommendation}
                                            </p>
                                        </div>
                                    )}

                                    {/* 상세 분석 */}
                                    <div className="mt-6">
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">📝 상세 분석</h3>
                                        <div className="prose prose-sm max-w-none text-gray-600">
                                            {analysisResult.analysis.split('\n').map((paragraph, idx) => (
                                                <p key={idx} className="mb-2">{paragraph}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-full">
                                <div className="text-center text-gray-500">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <p className="mt-2 text-sm">
                                        왼쪽에서 2개 이상의 견적서를 선택하고<br />
                                        분석하기 버튼을 눌러주세요.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 