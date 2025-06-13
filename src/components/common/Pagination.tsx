import React from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = startPage + maxVisiblePages - 1;
            
            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-1 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="이전 페이지"
            >
                <HiChevronLeft className="w-5 h-5" />
            </button>
            
            {pageNumbers[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        1
                    </button>
                    {pageNumbers[0] > 2 && (
                        <span className="flex items-center justify-center w-8 h-8 text-gray-400">...</span>
                    )}
                </>
            )}
            
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                        currentPage === page
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    {page}
                </button>
            ))}
            
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                        <span className="flex items-center justify-center w-8 h-8 text-gray-400">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        {totalPages}
                    </button>
                </>
            )}
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="다음 페이지"
            >
                <HiChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
} 