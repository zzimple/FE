'use client';

import { useEffect, useState } from 'react';
import { publicApi } from '@/lib/axios';
import GuestHeader from '@/components/headers/GuestHeader';
import { furnitureItems } from '@/constants/items/furnitureItems';
import { applianceItems } from '@/constants/items/appliance';
import { otherItems } from '@/constants/items/otherItems';

interface PreferredItem {
  itemTypeId: number;
  itemTypeName: string;
  category: string;
}

type CategoryType = 'appliance' | 'furniture' | 'other';

const categoryLabels: Record<CategoryType, string> = {
  appliance: '가전제품',
  furniture: '가구',
  other: '기타'
};

const categoryColors: Record<CategoryType, string> = {
  appliance: 'bg-blue-50 text-blue-600',
  furniture: 'bg-green-50 text-green-600',
  other: 'bg-purple-50 text-purple-600'
};

export default function PreferredListPage() {
  const [items, setItems] = useState<PreferredItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');

  useEffect(() => {
    const fetchPreferred = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await publicApi.get('/api/vision');
        console.log('API 응답:', res.data);
        if (res.data.success) {
          setItems(res.data.data);
          console.log('설정된 아이템들:', res.data.data);
        } else {
          setError(res.data.message || '불러오기 실패');
        }
      } catch (e: any) {
        console.error('API 에러:', e);
        // API 에러 시 테스트용 더미 데이터 사용
        console.log('테스트용 더미 데이터 사용');
        const dummyData = [
          { itemTypeId: 1001, itemTypeName: "침대", category: "furniture" },
          { itemTypeId: 2001, itemTypeName: "TV", category: "appliance" },
          { itemTypeId: 3001, itemTypeName: "거울", category: "other" },
          { itemTypeId: 1002, itemTypeName: "쇼파", category: "furniture" },
          { itemTypeId: 2004, itemTypeName: "세탁기", category: "appliance" },
        ];
        setItems(dummyData);
        console.log('더미 데이터 설정:', dummyData);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferred();
  }, []);

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  // 카테고리별로 그룹핑
  const groupedItems: Record<CategoryType, PreferredItem[]> = {
    appliance: [],
    furniture: [],
    other: [],
  };
  filteredItems.forEach(item => {
    const lowerCategory = item.category.toLowerCase();
    if (lowerCategory === 'appliance') groupedItems.appliance.push(item);
    else if (lowerCategory === 'furniture') groupedItems.furniture.push(item);
    else if (lowerCategory === 'other') groupedItems.other.push(item);
  });
  console.log('filteredItems:', filteredItems);
  console.log('groupedItems:', groupedItems);

  const getImagePath = (itemTypeId: number, category: string, itemTypeName: string): string => {
    let itemList: any[] = [];
    const lowerCategory = category.toLowerCase(); // 대문자 → 소문자 변환
    
    switch (lowerCategory) {
      case 'furniture':
        itemList = furnitureItems;
        break;
      case 'appliance':
        itemList = applianceItems;
        break;
      case 'other':
        itemList = otherItems;
        break;
      default:
        return '';
    }

    // 1. itemTypeId로 매칭 시도
    const matchedById = itemList.find(item => item.id === String(itemTypeId));
    if (matchedById) {
      console.log(`ID 매칭 성공: ${itemTypeName} (ID: ${itemTypeId}) -> ${matchedById.image}`);
      return matchedById.image;
    }

    // 2. itemTypeName으로 매칭 시도
    const matchedByName = itemList.find(item => item.name === itemTypeName);
    if (matchedByName) {
      console.log(`이름 매칭 성공: ${itemTypeName} -> ${matchedByName.image}`);
      return matchedByName.image;
    }

    // 3. 부분 매칭 시도 (공백 제거 후)
    const normalizedName = itemTypeName.replace(/\s+/g, '');
    const matchedByNormalized = itemList.find(item => 
      item.name.replace(/\s+/g, '') === normalizedName
    );
    if (matchedByNormalized) {
      console.log(`정규화 매칭 성공: ${itemTypeName} -> ${matchedByNormalized.image}`);
      return matchedByNormalized.image;
    }

    console.log(`매칭 실패: ${itemTypeName} (ID: ${itemTypeId}, 카테고리: ${category})`);
    console.log('사용 가능한 아이템들:', itemList.map(item => `${item.name} (${item.id})`));
    
    return '';
  };

  const categories = ['all', 'appliance', 'furniture', 'other'] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GuestHeader />
        <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
          <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-lg shadow-sm p-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600">저장 항목을 불러오는 중입니다...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GuestHeader />
        <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
          <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-lg shadow-sm p-12">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GuestHeader />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              AI 분석 저장 항목
            </h1>
            <p className="text-gray-600 text-sm text-center">
              AI가 분석한 저장 물품들을 확인해보세요!
            </p>
          </div>

          {/* 통계 */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>총 {items.length}개의 저장 항목</span>
              <span>{filteredItems.length}개 표시</span>
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? '전체' : categoryLabels[category]}
                </button>
              ))}
            </div>
          </div>

          {/* 아이템 목록 */}
          <div className="space-y-8">
            {selectedCategory === 'all' ? (
              (['appliance', 'furniture', 'other'] as const).map((cat) =>
                groupedItems[cat].length > 0 && (
                  <div key={cat}>
                    <div className="font-bold text-lg mb-3 text-gray-700 flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${cat === 'appliance' ? 'bg-blue-400' : cat === 'furniture' ? 'bg-green-400' : 'bg-purple-400'}`}></span>
                      {categoryLabels[cat]}
                    </div>
                    <div className="space-y-4">
                      {groupedItems[cat].map(item => {
                        const imagePath = getImagePath(item.itemTypeId, item.category, item.itemTypeName);
                        const categoryType = item.category.toLowerCase() as CategoryType;
                        return (
                          <div
                            key={item.itemTypeId}
                            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-4">
                              {/* 이미지 */}
                              <div className="flex-shrink-0">
                                {imagePath ? (
                                  <img
                                    src={imagePath}
                                    alt={item.itemTypeName}
                                    className="w-16 h-16 object-cover rounded-lg border"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-200 rounded-lg border flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">이미지 없음</span>
                                  </div>
                                )}
                              </div>
                              {/* 정보 */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {item.itemTypeName}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )
            ) : (
              groupedItems[(selectedCategory.toLowerCase() as CategoryType)].length > 0 ? (
                <div>
                  <div className="font-bold text-lg mb-3 text-gray-700 flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${(selectedCategory.toLowerCase() === 'appliance') ? 'bg-blue-400' : (selectedCategory.toLowerCase() === 'furniture') ? 'bg-green-400' : 'bg-purple-400'}`}></span>
                    {categoryLabels[selectedCategory.toLowerCase() as CategoryType]}
                  </div>
                  <div className="space-y-4">
                    {groupedItems[(selectedCategory.toLowerCase() as CategoryType)].map(item => {
                      const imagePath = getImagePath(item.itemTypeId, item.category, item.itemTypeName);
                      const categoryType = item.category.toLowerCase() as CategoryType;
                      return (
                        <div
                          key={item.itemTypeId}
                          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            {/* 이미지 */}
                            <div className="flex-shrink-0">
                              {imagePath ? (
                                <img
                                  src={imagePath}
                                  alt={item.itemTypeName}
                                  className="w-16 h-16 object-cover rounded-lg border"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-lg border flex items-center justify-center">
                                  <span className="text-gray-500 text-xs">이미지 없음</span>
                                </div>
                              )}
                            </div>
                            {/* 정보 */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                  {item.itemTypeName}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center">해당 카테고리 항목이 없습니다.</div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
