"use client";

import { useState, ChangeEvent, DragEvent } from "react";
import { publicApi } from "@/lib/axios";
import Image from "next/image";
import GuestHeader from "@/components/headers/GuestHeader";
import Button from "@/components/common/Button";

export default function VisionUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [detectedItems, setDetectedItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileChange = (selectedFile: File | null) => {
        setDetectedItems([]);
        setError(null);
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleInputElementChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFileChange(e.target.files?.[0] || null);
    };

    const handleDragEvents = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        handleDragEvents(e);
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files?.[0] || null;
        handleFileChange(droppedFile);
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await publicApi.post("/api/vision/analyze", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setDetectedItems(response.data.detectedItems || []);
        } catch (err) {
            console.error(err);
            setError("분석 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-pretendard">
            <GuestHeader />
            <main className="pt-12">
                <div className="text-center py-12 px-4">
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl md:text-4xl">
                        AI 이미지 분석으로 짐 찾기
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
                        방 사진이나 가구 사진을 업로드하면, AI가 자동으로 물품을 인식하여 목록을 만들어 드립니다.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">이미지 업로드</h2>
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                    isDragOver ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300 bg-white'
                                }`}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleInputElementChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h10a4 4 0 014 4v5a4 4 0 01-4 4H7z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 16v1a2 2 0 01-2 2H6a2 2 0 01-2-2v-1"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12l-2-2m2 2l2-2m-2 2V6"></path></svg>
                                    <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
                                    <p className="text-xs">(.jpeg, .png, .gif)</p>
                                </div>
                            </div>
                            {preview && (
                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-800 mb-2">미리보기</h3>
                                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                                        <Image
                                            src={preview}
                                            alt="Preview"
                                            layout="fill"
                                            objectFit="contain"
                                        />
                                    </div>
                                </div>
                            )}
                            <Button
                                onClick={handleAnalyze}
                                disabled={!file || loading}
                                className="w-full mt-6 py-3"
                            >
                                {loading ? "분석 중..." : "분석하기"}
                            </Button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 min-h-[30rem]">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">분석 결과</h2>
                            {loading ? (
                                <div className="text-center py-10">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-500 border-t-transparent"></div>
                                    <p className="mt-2 text-gray-600">AI가 이미지를 분석하고 있습니다...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-10 text-red-500">
                                    {error}
                                </div>
                            ) : detectedItems.length > 0 ? (
                                <ul className="space-y-3">
                                    {detectedItems.map((item, index) => (
                                        <li key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                                            <svg className="w-5 h-5 text-cyan-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path></svg>
                                            <span className="text-gray-800">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    이미지를 업로드하고 분석하기 버튼을 눌러주세요.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
