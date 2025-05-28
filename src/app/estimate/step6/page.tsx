"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import EstimateHeader from "@/components/common/EstimateHeader";
import SelectTab from "@/components/common/SelectTab";

interface ServiceOption {
  id: string;
  title: string;
  description: string;
  image: string;
  mandatories: string[];
}

const serviceOptions: ServiceOption[] = [
  {
    id: "일반",
    title: "일반이사",
    description: "포장된 짐을 목적지 공간까지 이동/운반합니다.",
    image: "/images/일반이사.jpeg",
    mandatories: [
      "이사 전까지 모든 포장을 완료해야 합니다.",
      "운반된 짐의 파손이나 분실 여부를 확인합니다.",
      "이후 이사를 직접 마무리합니다.",
    ],
  },
  {
    id: "반포장",
    title: "반포장이사",
    description:
      "고객님과 포장을 함께 진행하며, 도착지에서 가구 배치까지 돕습니다.",
    image: "/images/반포장이사.jpeg",
    mandatories: [
      "이사 전까지 귀중품 및 고가의 상품은 별도로 체크/보관해야 합니다.",
      "제공된 박스로 함께 포장을 진행합니다.",
      "운반된 짐의 파손이나 분실 여부를 확인합니다.",
      "박스의 잔 짐은 직접 정리합니다.",
      "이후 이사를 직접 마무리합니다.",
    ],
  },
  {
    id: "포장",
    title: "포장이사",
    description: "포장, 운반, 이동, 정리 등 모든 이사 과정을 진행합니다.",
    image: "/images/포장이사.jpeg",
    mandatories: [
      "이사 전까지 귀중품 및 고가의 상품은 별도로 체크/보관해야 합니다.",
      "운반된 짐의 파손이나 분실 여부를 확인합니다.",
      "도착지에서 가구와 짐이 배치될 곳을 안내합니다.",
      "완료된 이사를 기사님과 함께 검수합니다.",
    ],
  },
  {
    id: "가정이사",
    title: "가정이사",
    description:
      "규모가 큰 포장이사를 전문으로 하는 업체에서 보양작업, 포장, 운반, 이동, 정리 등 전체 과정을 수행하며, 요청에 따른 추가 서비스도 제공합니다.",
    image: "/images/가정이사.jpeg",
    mandatories: [
      "방문 견적 진행 후 최종 견적서를 확인합니다.",
      "이사 전까지 귀중품 및 고가의 상품은 별도로 체크/보관해야 합니다.",
      "운반된 짐의 파손이나 분실 여부를 확인합니다.",
      "도착지에서 가구와 짐이 배치될 곳을 안내합니다.",
      "완료된 이사를 함께 검수합니다.",
    ],
  },
];

export default function Step6Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(serviceOptions[0].id);
  const [agreed, setAgreed] = useState<boolean>(false);

  // 선택된 서비스 정보
  const current = serviceOptions.find((opt) => opt.id === selected)!;

  // 소형 이사(일반·반포장·포장) 공통 정보
  const smallInfo = [
    { label: "주요 차량", value: "1톤" },
    { label: "업체 구성", value: "소형 이사 전문 업체" },
    { label: "평균 작업 인원", value: "1-2명" },
    { label: "추천 평수", value: "20평 미만" },
  ];

  // 가정이사 전용 정보
  const homeInfo = [
    { label: "주요 차량", value: "2.5톤~5톤" },
    { label: "추가 서비스", value: "업체별 제공" },
    { label: "업체 구성", value: "가정 이사 전문 업체" },
    { label: "평균 작업 인원", value: "3명 이상" },
    { label: "추천 평수", value: "20평 이상" },
  ];

  const infoToShow = selected === "가정이사" ? homeInfo : smallInfo;

  const handleNext = () => {
    if (agreed) {
      router.push("/estimate/step7");
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white">
      {/* 헤더 */}
      <EstimateHeader step={6} title="서비스 종류" />

      <main className="flex-1 px-4 py-6 space-y-6">
        {/* 안내 텍스트 */}
        <h2 className="text-center text-base font-semibold text-gray-900">
          <span className="text-blue-500">원하시는 서비스</span>를 선택해주세요.
        </h2>

        {/* 탭 선택 */}
        <div className="flex justify-center gap-2">
          {serviceOptions.map((opt) => (
            <SelectTab
              key={opt.id}
              label={opt.id}
              selected={selected === opt.id}
              onClick={() => {
                setSelected(opt.id);
                setAgreed(false); // 서비스 변경 시 동의 해제
              }}
            />
          ))}
        </div>

        {/* 서비스 상세 */}
        <div className="space-y-4 text-center">
          <h3 className="text-lg font-bold text-gray-900">{current.title}</h3>
          <p className="text-sm text-gray-600 px-4">{current.description}</p>
          <div className="w-full h-48 overflow-hidden rounded-xl">
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 주요 정보 */}
        <div className="px-4 space-y-2 text-gray-600">
          {infoToShow.map((info) => (
            <div
              key={info.label}
              className="flex justify-between whitespace-nowrap"
            >
              <span>{info.label}</span>
              <span className="font-medium text-gray-900">{info.value}</span>
            </div>
          ))}
        </div>

        {/* 안내 사항 박스 */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mx-4">
          <h4 className="font-semibold text-red-600 mb-2">
            중요! 고객님 필수 진행 사항
          </h4>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
            {current.mandatories.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </div>

        {/* 동의 체크박스 */}
        <div className="flex items-center px-4">
          <input
            id="agree"
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            checked={agreed}
            onChange={() => setAgreed((prev) => !prev)}
          />
          <label htmlFor="agree" className="ml-2 text-sm text-gray-700">
            필수 진행 사항을 모두 확인하였으며, 동의합니다.
          </label>
        </div>
      </main>

      {/* 다음 버튼 */}
      <div className="px-4 py-6">
        <Button className="w-full" onClick={handleNext} disabled={!agreed}>
          다음
        </Button>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Button from "@/components/common/Button";
// import EstimateHeader from "@/components/common/EstimateHeader";
// import SelectTab from "@/components/common/SelectTab";

// interface ServiceOption {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   mandatories: string[];
// }

// const serviceOptions: ServiceOption[] = [
//   {
//     id: "일반",
//     title: "일반이사",
//     description: "포장된 짐을 목적지 공간까지 이동/운반합니다.",
//     image: "/images/일반이사.jpeg",
//     mandatories: [
//       '이사 전까지 모든 포장을 완료해야 합니다.',
//       '운반된 짐의 파손이나 분실 여부를 확인합니다.',
//       '이후 이사를 직접 마무리합니다.',
//     ],
//   },
//   {
//     id: "반포장",
//     title: "반포장이사",
//     description:
//       "고객님과 포장을 함께 진행하며, 도착지에서 가구배치까지 진행합니다.",
//     image: "/images/반포장이사.jpeg",
//     mandatories: [
//       '이사 전까지 귀중품 및 고가의 상품은 별도로 체크/보관해야 합니다.',
//       '제공된 박스로 함께 포장을 진행합니다.',
//       '운반된 짐의 파손이나 분실 여부를 확인합니다.',
//       '박스의 잔 짐은 직접 정리합니다.',
//       '이후 이사를 직접 마무리합니다.'
//     ],

//   },
//   {
//     id: "포장",
//     title: "포장이사",
//     description: "포장, 운반, 이동, 정리 등 모든 이사 과정을 진행합니다.",
//     image: "/images/포장이사.jpeg",
//     mandatories: [
//       '이사 전까지 귀중품 및 고가의 상품은 별도로 체크/보관해야 합니다.',
//       '운반된 짐의 파손이나 분실 여부를 확인합니다.',
//       '도착지에서 가구와 짐이 배치될 곳을 안내합니다.',
//       '완료된 이사를 기사님과 함께 검수합니다.'
//     ],
//   },
//   {
//     id: "가정이사",
//     title: "가정이사",
//     description: "규모가 큰 포장이사를 전문으로 하는 업체에서 보양작업, 포장, 운반, 이동, 정리 등 전체적인 이사를 수행하며, 고객 요청에 따른 추가 서비스도 제공합니다.",
//     image: "/images/가정이사.jpeg",
//     mandatories: [
//       '방문 견적 진행 후 최종 견적서를 확인합니다.',
//       '이사 전까지 귀중품 및 고가의 상품은 별도로 체크/보관해야 합니다.',
//       '운반된 짐의 파손이나 분실 여부를 확인합니다.',
//       '도착지에서 가구와 짐이 배치될 곳을 안내합니다.',
//       '완료된 이사를 함께 검수합니다.',
//     ],
//   },
// ];

// export default function Step6Page() {
//   const router = useRouter();
//   const [selected, setSelected] = useState<string>(serviceOptions[0].id);

//   const handleNext = () => {
//     router.push("/estimate/step7");
//   };

//   const current = serviceOptions.find((opt) => opt.id === selected)!;

//   return (
//     <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white">
//       <EstimateHeader step={6} title="서비스 종류" />

//       <main className="flex-1 px-4 py-6 space-y-6">
//         <h2 className="text-base font-semibold text-gray-900 text-center">
//           <span className="text-blue-500">원하시는 서비스</span>를 선택해주세요.
//         </h2>
//         {/** 탭 선택 헤더 */}
//         <div className="flex justify-center gap-2">
//           {serviceOptions.map((opt) => (
//             <SelectTab
//               key={opt.id}
//               label={opt.id}
//               selected={selected === opt.id}
//               onClick={() => setSelected(opt.id)}
//             />
//           ))}
//         </div>
//         {/* 선택된 서비스 내용 */}
//         <div className="space-y-4 text-center">
//           <h3 className="text-lg font-bold text-gray-900">{current.title}</h3>
//           <p className="text-sm text-gray-600 px-4">{current.description}</p>
//           <div className="w-full h-48 overflow-hidden rounded-xl">
//             <img
//               src={current.image}
//               alt={current.title}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         </div>

//         {/** 주요 정보 */}
//         <div className="px-4">
//           <div className="grid grid-cols-2 gap-4 text-gray-600">
//             {[
//               {label:'주요 차량', value:'1톤'},
//               {label:'업체 구성', value:'소형 이사 전문 업체'},
//               {label:'평균 작업 인원', value:'1-2명'},
//               {label:'추천 평수', value:'20평 미만'},
//             ].map((info) => (
//               <div key={info.label} className='flex justify-between'>
//                 <span>{info.label}</span>
//                 <span className='font-medium text-gray-900'>{info.value}</span>
//                 </div>
//             ))}
//           </div>
//         </div>

//         {/**안내사항 */}
//         <div className='bg-gray-100 border border-gray-300 rounded-lg p-4 mx-4'>
//           <h4 className='font-semibold text-red-600 ,mb-2'>중요! 고객님 필수 진행 사항</h4>
//           <ol className='list-decimal list-inside text-sm text-gray-700 space-y-1'>
//             {current.mandatories.map((item, idx) => (
//               <li key={idx}>{item}</li>
//             ))}
//             </ol>
//           </div>
//         </main>

//       <div className="px-4 py-6">
//         <Button onClick={handleNext}>다음</Button>
//       </div>
//     </div>
//   );
// }
