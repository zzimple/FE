// interface MemberTypeSelectorProps {
//   userRole: "GUEST" | "STAFF" | null;
//   setUserRole: (value: "GUEST" | "STAFF") => void;
// }

// export default function MemberTypeSelector({ userRole: memberType, setUserRole: setMemberType }: MemberTypeSelectorProps) {
//   return (
//     <div className="space-y-2">
//       <p className="text-sm font-bold">회원 유형 선택</p>
//       <div className="flex gap-2">
//         <button
//           type="button"
//           onClick={() => setMemberType("GUEST")}
//           className={`w-full h-14 rounded-full border text-sm ${memberType === "GUEST" ? "bg-blue-200" : ""}`}
//         >
//           고객
//         </button>
//         <button
//           type="button"
//           onClick={() => setMemberType("STAFF")}
//           className={`w-full h-14 rounded-full border text-sm ${memberType === "STAFF" ? "bg-blue-200" : ""}`}
//         >
//           직원
//         </button>
//       </div>
//     </div>
//   );
// }