"use client";

import React, { useState, useEffect } from "react";
import { authApi } from "@/lib/axios";
import Image from "next/image";

interface Item {
  itemTypeId: number;
  basePrice: number;
}

interface Category {
  title: string;
  startId: number;
  items: Array<{
    id: number;
    name: string;
  }>;
}

export default function BasicPricePage() {
  const [editMode, setEditMode] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [changes, setChanges] = useState<{ [key: number]: number }>({});

  const categories: Category[] = [
    {
      title: "가구",
      startId: 1001,
      items: [
        "침대", "쇼파", "옷장-단품", "옷장-연결장", "행거",
        "시스템 행거", "화장대", "수납장/서랍장", "진열장", "선반",
        "거실장/TV장", "책장", "책상", "테이블/식탁", "의자"
      ].map((name, index) => ({
        id: 1001 + index,
        name
      }))
    },
    {
      title: "가전",
      startId: 2001,
      items: [
        "TV", "모니터", "PC/데스크탑", "세탁기", "건조기",
        "청소기", "의류관리기", "냉장고", "전자레인지", "가스레인지",
        "정수기", "에어컨", "공기청정기", "선풍기", "안마의자"
      ].map((name, index) => ({
        id: 2001 + index,
        name
      }))
    },
    {
      title: "기타",
      startId: 3001,
      items: [
        "거울", "커튼", "빨래 건조대", "캐리어", "운동용품",
        "책", "화분", "비데", "조명기구"
      ].map((name, index) => ({
        id: 3001 + index,
        name
      }))
    }
  ];

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await authApi.get("/owner/my/estimate/default-prices");
        if (response.data.success) {
          setItems(response.data.data);
        }
      } catch (error) {
        console.error("기본금 설정 조회 실패:", error);
      }
    };

    fetchPrices();
  }, []);

  const handlePriceChange = (itemId: number, value: string) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setChanges(prev => ({
      ...prev,
      [itemId]: numericValue
    }));
  };

  const getItemPrice = (itemId: number) => {
    if (itemId in changes) {
      return changes[itemId];
    }
    const item = items.find(item => item.itemTypeId === itemId);
    return item?.basePrice || 0;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const handleSave = async () => {
    const updatedPrices = Object.entries(changes).map(([itemId, basePrice]) => ({
      itemTypeId: parseInt(itemId),
      basePrice
    }));

    try {
      const response = await authApi.post("/owner/my/estimate/default-prices", updatedPrices);
      if (response.data.success) {
        alert("기본금 설정이 저장되었습니다.");
        setEditMode(false); // 수정모드 종료
        setChanges({}); // 변경사항 초기화
        const newResponse = await authApi.get("/owner/my/estimate/default-prices");
        if (newResponse.data.success) {
          setItems(newResponse.data.data);
        }
      }
    } catch (error) {
      console.error("기본금 설정 저장 실패:", error);
      alert("저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const getImagePath = (categoryTitle: string, itemName: string): string => {
    const categoryMap: { [key: string]: string } = {
      "가구": "furniture",
      "가전": "appliance",
      "기타": "other"
    };

    const folder = categoryMap[categoryTitle] || "other";

    const nameMap: { [key: string]: string } = {
      "침대": "Bed",
      "쇼파": "Sofa",
      "옷장-단품": "WardrobeSing",
      "옷장-연결장": "WardrobeSing",
      "행거": "Hanger",
      "시스템 행거": "SystemHanger",
      "화장대": "DressingTable",
      "수납장/서랍장": "Drawer",
      "진열장": "Display",
      "선반": "Shelf",
      "거실장/TV장": "TvCabinet",
      "책장": "Bookshelf",
      "책상": "Desk",
      "테이블/식탁": "DiningTable",
      "의자": "Chair",
      // 가전
      "TV": "Tv",
      "모니터": "Moniter",
      "PC/데스크탑": "Pc",
      "세탁기": "WashingMachine",
      "건조기": "Dryer",
      "청소기": "VacuumCleaner",
      "의류관리기": "ClothingCare",
      "냉장고": "Refrigerator",
      "전자레인지": "Microwave",
      "가스레인지": "GasStove",
      "정수기": "WaterPurifier",
      "에어컨": "Aircon",
      "공기청정기": "AirPurifier",
      "선풍기": "Fan",
      "안마의자": "MassageChair",

      // 기타
      "거울": "Mirror",
      "커튼": "Curtain",
      "빨래 건조대": "DryingRack",
      "캐리어": "Carrier",
      "운동용품": "Fitness",
      "책": "Book",
      "화분": "PlantPot",
      "비데": "Bidet",
      "조명기구": "Light"
    };

  const fileName = nameMap[itemName] || "default";

  return `/icons/${folder}/${fileName}.jpeg`;
};

return (
  <div className="max-w-3xl mx-auto pt-4">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-lg font-semibold">물품 기본금 설정</h2>
      <button
        onClick={() => editMode ? handleSave() : setEditMode(true)}
        className={`
            inline-flex items-center text-sm font-medium transition-all
            ${editMode
            ? 'text-[#2948FF] hover:text-blue-700'
            : 'text-gray-500 hover:text-gray-700'
          }
          `}
      >
        {editMode ? (
          <>
            저장
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </>
        ) : (
          <>
            변경하기
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </>
        )}
      </button>
    </div>

    <div className="space-y-12">
      {categories.map((category, index) => (
        <div key={index}>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-base font-medium">{category.title}</h3>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-5 rounded-2xl transition-all
                    ${editMode
                    ? 'bg-white border-2 border-[#2948FF] shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-4">

                  <Image
                    src={getImagePath(category.title, item.name)}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="rounded-xl object-cover bg-gray-100"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/icons/placeholder.jpeg";
                    }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={formatPrice(getItemPrice(item.id)) + "원"}
                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                    disabled={!editMode}
                    className={`w-32 text-right outline-none rounded-lg px-3 py-2 transition-all
                        ${editMode
                        ? "bg-gray-50 text-[#2948FF] font-medium hover:bg-gray-100"
                        : "bg-transparent"
                      }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
}