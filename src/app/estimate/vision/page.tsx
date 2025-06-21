"use client";

import { useState, ChangeEvent } from "react";
import { publicApi } from "@/lib/axios";
import Image from "next/image"

export default function VisionUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDetectedItems([]);
    setError(null);
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
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
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">이미지 분석</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {preview && (
        <div className="mb-4">
          <Image
            src={preview}
            alt="Preview"
            width={256}
            height={256}
            className="max-h-64 mx-auto"
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "분석 중..." : "분석하기"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {detectedItems.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium">검출된 물품:</h3>
          <ul className="list-disc list-inside">
            {detectedItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
