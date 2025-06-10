export type MoveCategory = "가구" | "가전" | "기타";

export interface MoveItem {
  id: string; 
  name: string; 
  image: string; 
  category: '가구' | '가전' | '기타';
}
// 쿠키에 저장할 구조
export type MoveItemMap = {
  [key in MoveCategory]?: string[];
};

export interface MoveItemDetail {
  name: string;
  quantity: number;
  etc?: {
    [key: string]: string | null;
  };
}
