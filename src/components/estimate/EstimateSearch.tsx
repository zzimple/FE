import React from "react";
import { EstimateSearchParams } from "@/types/estimate";
import { HiOutlineSearch, HiOutlineRefresh } from "react-icons/hi";

const INPUT_STYLES = "w-full bg-gray-50 border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all";

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

interface EstimateSearchProps {
    onSearch: (params: EstimateSearchParams) => void;
    initialParams: EstimateSearchParams;
}

export default function EstimateSearch({ onSearch, initialParams }: EstimateSearchProps) {
    const [search, setSearch] = React.useState<EstimateSearchParams>(initialParams);

    const handleSearch = () => {
        onSearch(search);
    };

    const handleReset = () => {
        setSearch(initialParams);
        onSearch(initialParams);
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
                                onChange={e => setSearch(s => ({ ...s, moveYear: e.target.value }))}
                            >
                                <option value="">년</option> {/* ✅ placeholder 옵션 추가 */}
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
                                onChange={e => setSearch(s => ({ ...s, moveMonth: e.target.value }))}
                            >
                                <option value="">월</option> {/* ✅ placeholder 옵션 추가 */}
                                {MONTHS.map((month) => (
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
                            >
                                <option value="">일</option> {/* ✅ placeholder 옵션 추가 */}
                                {DAYS.map((day) => (
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

                {/* 이사 타입 및 옵션 */}
                <div className="space-y-2">
                    <h3 className="text-xs font-medium text-gray-500">이사 정보</h3>
                    <div className="flex gap-2">
                        <select
                            className={INPUT_STYLES}
                            value={search.moveType}
                            onChange={(e) => setSearch((s) => ({ ...s, moveType: e.target.value as any }))} // ✅ MoveType options으로 수정
                        >
                            <option value="">이사 타입</option> {/* placeholder */}
                            <option value="SMALL">소형이사</option> {/* ✅ MoveType: SMALL */}
                            <option value="FAMILY">가정이사</option> {/* ✅ MoveType: FAMILY */}
                        </select>
                        <select
                            className={INPUT_STYLES}
                            value={search.moveOption}
                            onChange={(e) => setSearch((s) => ({ ...s, moveOption: e.target.value as any }))} // ✅ MoveOption options으로 수정
                        >
                            <option value="">옵션</option> {/* placeholder */}
                            <option value="BASIC">일반</option>              {/* ✅ MoveOption: BASIC */}
                            <option value="PACKAGING">포장이사</option>      {/* ✅ MoveOption: PACKAGING */}
                            <option value="SEMI_PACKAGING">포장</option>
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