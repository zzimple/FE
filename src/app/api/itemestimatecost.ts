// // src/api/estimate.ts
// import axios from "axios";

// // estimateNo로 예상비용 받아오기
// export async function fetchEstimatedCost(estimateNo: number) {
//   const res = await axios.get(`/estimates/owner/drafts/${estimateNo}/items/item-total`);
//   // itemTotal의 합계를 반환
//   const items = res.data.data.items;
//   const total = items.reduce((sum: number, item: any) => sum + (item.itemTotal || 0), 0);
//   return total;
// }