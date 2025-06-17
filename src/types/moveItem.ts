export type MoveCategory = "가구" | "가전" | "기타";

export interface MoveItem {
  id: number;  // 이거는 프론트 전용 !!! (아이쳄 이름, 이미지, 카테고리)
  name: string; 
  image: string; 
  category: MoveCategory;
}
// 쿠키 저장용 (선택된 항목의 id만 저장)
export type MoveItemMap = {
  [key in MoveCategory]?: number[];
};

export interface MoveItemDetail { // 이거는 백엔드로 최종 전송할 데이터용임 !
  itemTypeId: number; // 이건 백엔드 명세에 맞게 ! 변수 설정함
  quantity: number;
  etc?: {
    [key: string]: string | number| boolean| null;
  };
}
