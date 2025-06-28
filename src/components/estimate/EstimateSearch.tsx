import React from "react";
import { EstimateSearchParams, MoveType, MoveOption } from "@/types/estimate";
import { HiOutlineSearch, HiOutlineRefresh } from "react-icons/hi";

const INPUT_STYLES = "w-full bg-gray-50 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all";

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

interface EstimateSearchProps {
    onSearch: (params: EstimateSearchParams) => void;
    initialParams: EstimateSearchParams;
    onReset?: () => void;
}

export default function EstimateSearch({ onSearch, initialParams, onReset }: EstimateSearchProps) {
    const [search, setSearch] = React.useState<EstimateSearchParams>(initialParams);

    // initialParams가 바뀔 때 search도 동기화
    React.useEffect(() => {
        setSearch(initialParams);
    }, [initialParams]);

    const handleSearch = () => {
        onSearch(search);
    };

    const handleReset = () => {
        setSearch(initialParams);
        onSearch(initialParams);
        if (onReset) onReset();
    };

    const getAvailableMonths = (year: string) => {
        const y = Number(year);
        return MONTHS;
    };

    const getAvailableDays = (year: string, month: string) => {
        const y = Number(year);
        const m = Number(month);
        if (!y || !m) return DAYS;
        if (y === 2025 && m === 4) return DAYS.filter(d => d <= 30); // 4월은 30일까지
        // 2월 처리 (윤년은 무시)
        if (m === 2) return DAYS.filter(d => d <= 28);
        // 4, 6, 9, 11월은 30일까지
        if ([4, 6, 9, 11].includes(m)) return DAYS.filter(d => d <= 30);
        return DAYS;
    };

    return (
        <div className="bg-white rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 날짜 검색 */}
                <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-500">이사 날짜</h3>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <select
                                className={INPUT_STYLES}
                                value={search.moveYear}
                                onChange={e => {
                                    setSearch(s => ({ ...s, moveYear: e.target.value, moveMonth: '', moveDay: '' }));
                                }}
                            >
                                <option value="">연도</option>
                                {YEARS.map((year) => (
                                    <option key={year} value={String(year)}>
                                        {year}년
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <select
                                className={INPUT_STYLES}
                                value={search.moveMonth}
                                onChange={e => {
                                    setSearch(s => ({ ...s, moveMonth: e.target.value, moveDay: '' }));
                                }}
                                disabled={!search.moveYear}
                            >
                                <option value="">월</option>
                                {getAvailableMonths(search.moveYear).map((month) => (
                                    <option key={month} value={String(month)}>
                                        {month}월
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <select
                                className={INPUT_STYLES}
                                value={search.moveDay}
                                onChange={e => setSearch(s => ({ ...s, moveDay: e.target.value }))}
                                disabled={!search.moveYear || !search.moveMonth}
                            >
                                <option value="">일</option>
                                {getAvailableDays(search.moveYear, search.moveMonth).map((day) => (
                                    <option key={day} value={String(day)}>
                                        {day}일
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 출발지 */}
                <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-500">출발지</h3>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                className={INPUT_STYLES}
                                placeholder="시/도"
                                value={search.fromRegion1}
                                onChange={e => setSearch(s => ({ ...s, fromRegion1: e.target.value }))}
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                className={INPUT_STYLES}
                                placeholder="구/군"
                                value={search.fromRegion2}
                                onChange={e => setSearch(s => ({ ...s, fromRegion2: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* 도착지 */}
                <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-500">도착지</h3>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                className={INPUT_STYLES}
                                placeholder="시/도"
                                value={search.toRegion1}
                                onChange={e => setSearch(s => ({ ...s, toRegion1: e.target.value }))}
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                className={INPUT_STYLES}
                                placeholder="구/군"
                                value={search.toRegion2}
                                onChange={e => setSearch(s => ({ ...s, toRegion2: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* 이사 타입 */}
                <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-500">이사 정보</h3>
                    <div className="flex gap-2">
                        <select
                            className={INPUT_STYLES}
                            value={search.moveType}
                            onChange={e => setSearch(s => ({ ...s, moveType: e.target.value as MoveType }))}
                        >
                            <option value="">이사 타입</option>
                            <option value="SMALL">소형이사</option>
                            <option value="FAMILY">가정이사</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <button 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={handleReset}
                >
                    <HiOutlineRefresh className="text-base" />
                    초기화
                </button>
                <button 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    onClick={handleSearch}
                >
                    <HiOutlineSearch className="text-base" />
                    검색
                </button>
            </div>
        </div>
    );
} 